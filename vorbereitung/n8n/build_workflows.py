"""Erzeugt die n8n-Workflow-Dateien für Knuddelwuff aus den Code-Dateien in ./code.

Aufruf: python3 build_workflows.py  →  schreibt workflows/*.json
Keine Zugangsdaten in den Dateien: Credentials werden nach dem Import in n8n ausgewählt.
"""
import json
import pathlib
import uuid

HERE = pathlib.Path(__file__).parent
CODE = HERE / "code"
OUT = HERE / "workflows"
SHEET_URL = "BITTE_GOOGLE_SHEET_URL_EINTRAGEN"
SHEET_NAME = "Pipeline"
TELEGRAM_CHAT_ID = "BITTE_EIGENE_TELEGRAM_CHAT_ID_EINTRAGEN"
MODEL = "claude-haiku-5-5"

PRODUKT = (
    "Knuddelwuff ist ein deutscher Online-Shop im Aufbau für Hunde-Winterzubehör "
    "(Wintermäntel, Regen- und Wetterschutz, Pfotenschutz). Sortiment, Preise, Lieferzeiten und "
    "Händlerkonditionen stehen noch nicht fest."
)
REGELN = (
    "Regeln: Schreibe auf Deutsch, in der Sie-Form, sachlich. Nutze NUR die übergebenen Daten. "
    "Erfinde keine Personen, Namen, Fakten, Preise, Lieferzeiten, Bewertungen oder Produkteigenschaften "
    "(z. B. nicht 'wasserdicht', 'nachhaltig', 'Bestseller'). Wenn Informationen fehlen, sag das."
)
SYSTEM_BEWERTUNG = (
    f"{PRODUKT} {REGELN} Aufgabe: Bewerte, ob der Betrieb als Geschäftskontakt passt "
    "(Hundesalon, Hundeschule/-trainer, Hundepension/-tagesstätte, Zoofachgeschäft/Händler mit Hundebezug). "
    "Schreibe außerdem einen kurzen Telefon-Leitfaden (max. 120 Wörter) für einen ersten Anruf, "
    "dessen Ziel ist zu fragen, ob grundsätzlich Interesse an einem Austausch besteht und ob wir "
    "dazu per E-Mail Informationen schicken dürfen (Einwilligung erfragen und Datum/Kanal notieren). "
    'Antworte ausschließlich als JSON: {"passt":"ja|nein|unklar","begruendung":"…","telefonleitfaden":"…"}'
)
SYSTEM_ENTWURF = (
    f"{PRODUKT} {REGELN} Aufgabe: Schreibe einen E-Mail-Entwurf (max. 120 Wörter) an einen Betrieb, "
    "der der Kontaktaufnahme per E-Mail zugestimmt hat. Nimm Bezug auf die erteilte Einwilligung "
    "(Datum und Kanal werden übergeben). Kein Druck, keine Rabatte, keine Versprechen. Schließe mit dem Satz: "
    "'Wenn Sie keine weiteren E-Mails wünschen, antworten Sie einfach kurz – dann melde ich mich nicht mehr.' "
    'Antworte ausschließlich als JSON: {"betreff":"…","text":"…"}'
)


def nid():
    return str(uuid.uuid4())


def code_node(name, file, pos):
    return {"parameters": {"jsCode": (CODE / file).read_text(encoding="utf-8")},
            "id": nid(), "name": name, "type": "n8n-nodes-base.code", "typeVersion": 2, "position": pos}


def sheet_ref():
    return ({"__rl": True, "value": SHEET_URL, "mode": "url"},
            {"__rl": True, "value": SHEET_NAME, "mode": "name"})


def sheets_node(name, operation, pos, match=None):
    doc, sheet = sheet_ref()
    p = {"operation": operation, "documentId": doc, "sheetName": sheet}
    if operation in ("appendOrUpdate", "update"):
        p["columns"] = {"mappingMode": "autoMapInputData", "value": {}, "matchingColumns": [match], "schema": []}
        p["options"] = {}
    else:
        p["options"] = {}
    return {"parameters": p, "id": nid(), "name": name, "type": "n8n-nodes-base.googleSheets",
            "typeVersion": 4.7, "position": pos}


def claude_node(name, system, user_expr, pos):
    body = ("={{ JSON.stringify({ model: '" + MODEL + "', max_tokens: 900, system: "
            + json.dumps(system, ensure_ascii=False) + ", messages: [{ role: 'user', content: " + user_expr + " }] }) }}")
    return {"parameters": {
        "method": "POST", "url": "https://api.anthropic.com/v1/messages",
        "authentication": "genericCredentialType", "genericAuthType": "httpHeaderAuth",
        "sendHeaders": True,
        "headerParameters": {"parameters": [{"name": "anthropic-version", "value": "2023-06-01"}]},
        "sendBody": True, "specifyBody": "json", "jsonBody": body,
        "options": {"batching": {"batch": {"batchSize": 1, "batchInterval": 1500}}, "timeout": 60000}},
        "id": nid(), "name": name, "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": pos}


def telegram_node(name, text_expr, pos):
    return {"parameters": {"chatId": TELEGRAM_CHAT_ID, "text": text_expr, "additionalFields": {}},
            "id": nid(), "name": name, "type": "n8n-nodes-base.telegram", "typeVersion": 1.2, "position": pos}


def note(text, pos, w=520, h=360):
    return {"parameters": {"content": text, "width": w, "height": h}, "id": nid(), "name": "Hinweis",
            "type": "n8n-nodes-base.stickyNote", "typeVersion": 1, "position": pos}


def chain(names):
    return {a: {"main": [[{"node": b, "type": "main", "index": 0}]]} for a, b in zip(names, names[1:])}


def triggers(rule):
    manual = {"parameters": {}, "id": nid(), "name": "Start (manuell)",
              "type": "n8n-nodes-base.manualTrigger", "typeVersion": 1, "position": [0, 0]}
    sched = {"parameters": {"rule": {"interval": [rule]}}, "id": nid(), "name": "Zeitplan",
             "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.2, "position": [0, 200]}
    return manual, sched


def wf1():
    manual, sched = triggers({"field": "weeks", "triggerAtDay": [1], "triggerAtHour": 7})
    osm = {"parameters": {
        "method": "POST", "url": "https://overpass-api.de/api/interpreter",
        "sendHeaders": True,
        "headerParameters": {"parameters": [{"name": "User-Agent", "value": "Knuddelwuff-Betriebssuche (n8n)"}]},
        "sendBody": True, "contentType": "form-urlencoded",
        "bodyParameters": {"parameters": [{"name": "data", "value": "={{ $json.query }}"}]},
        "options": {"batching": {"batch": {"batchSize": 1, "batchInterval": 3000}}, "timeout": 120000,
                    "response": {"response": {"responseFormat": "json"}}}},
        "id": nid(), "name": "OpenStreetMap abfragen", "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2, "position": [440, 100]}
    user = ("'Betrieb: ' + JSON.stringify({ name: $json.name, kategorie: $json.kategorie, ort: $json.ort, "
            "website: $json.website, telefon_vorhanden: !!$json.telefon })")
    nodes = [
        manual, sched,
        code_node("Suchgebiete & Kategorien", "01_suchgebiete.js", [220, 100]),
        osm,
        code_node("In Tabellenzeilen umwandeln", "02_osm_zu_zeilen.js", [660, 100]),
        sheets_node("In Pipeline speichern", "appendOrUpdate", [880, 100], match="osm_id"),
        sheets_node("Pipeline lesen", "read", [1100, 100]),
        code_node("Noch nicht bewertete auswählen", "03_unbewertete_auswaehlen.js", [1320, 100]),
        claude_node("Claude: bewerten & Leitfaden", SYSTEM_BEWERTUNG, user, [1540, 100]),
        code_node("Bewertung auswerten", "04_bewertung_auswerten.js", [1760, 100]),
        sheets_node("Bewertung speichern", "update", [1980, 100], match="osm_id"),
        code_node("Zusammenfassen", "05_zusammenfassen.js", [2200, 100]),
        telegram_node("Zusammenfassung an CEO", "={{ $json.text }}", [2420, 100]),
        note("## Knuddelwuff 1 – Betriebe finden & bewerten\n"
             "Findet Hundebetriebe in OpenStreetMap, speichert sie in der Pipeline-Tabelle, lässt Claude bewerten "
             "und einen Telefon-Leitfaden schreiben.\n\n**Versendet nichts.** Nur eine Zusammenfassung per Telegram an den CEO.\n\n"
             "Vor dem Start: Google-Sheet-URL, Telegram-Chat-ID und Zugangsdaten eintragen (siehe ANLEITUNG.md).\n"
             "Daten: © OpenStreetMap-Mitwirkende, ODbL.", [0, -420]),
    ]
    names = ["Suchgebiete & Kategorien", "OpenStreetMap abfragen", "In Tabellenzeilen umwandeln",
             "In Pipeline speichern", "Pipeline lesen", "Noch nicht bewertete auswählen",
             "Claude: bewerten & Leitfaden", "Bewertung auswerten", "Bewertung speichern",
             "Zusammenfassen", "Zusammenfassung an CEO"]
    con = chain(names)
    con["Start (manuell)"] = {"main": [[{"node": names[0], "type": "main", "index": 0}]]}
    con["Zeitplan"] = {"main": [[{"node": names[0], "type": "main", "index": 0}]]}
    # "Pipeline lesen" soll nur einmal laufen, egal wie viele Zeilen gespeichert wurden
    nodes[6]["executeOnce"] = True
    return {"name": "Knuddelwuff 1 – Betriebe finden & bewerten", "nodes": nodes, "connections": con,
            "active": False, "settings": {"executionOrder": "v1"}, "pinData": {}}


def wf2():
    manual, sched = triggers({"field": "days", "triggerAtHour": 8})
    user = ("'Betrieb: ' + JSON.stringify({ name: $json.name, kategorie: $json.kategorie, ort: $json.ort, "
            "ansprechpartner: $json.ansprechpartner || '', einwilligung_datum: $json.einwilligung_datum, "
            "einwilligung_kanal: $json.einwilligung_kanal, notizen: $json.notizen || '' })")
    e = "$('Entwurf auswerten').item.json"
    text = ("={{ '📧 E-Mail-ENTWURF (nicht versendet)\\nAn: ' + " + e + ".email_fuer_entwurf + ' (' + " + e + ".name + ')\\n"
            "Einwilligung am: ' + " + e + ".einwilligung_datum + '\\n\\nBetreff: ' + " + e + ".email_betreff + '\\n\\n' + "
            + e + ".email_entwurf + '\\n\\n— Du entscheidest selbst, ob und wann du diese E-Mail versendest.' }}")
    nodes = [
        manual, sched,
        sheets_node("Pipeline lesen", "read", [220, 100]),
        code_node("Kontakte mit Einwilligung", "06_einwilligung_auswaehlen.js", [440, 100]),
        claude_node("Claude: E-Mail-Entwurf", SYSTEM_ENTWURF, user, [660, 100]),
        code_node("Entwurf auswerten", "07_entwurf_auswerten.js", [880, 100]),
        sheets_node("Entwurf speichern", "update", [1100, 100], match="osm_id"),
        telegram_node("Entwurf an CEO senden", text, [1320, 100]),
        note("## Knuddelwuff 2 – E-Mail-Entwürfe (nur mit Einwilligung)\n"
             "Schreibt Entwürfe **nur** für Zeilen mit Einwilligung = ja, Einwilligungsdatum und E-Mail-Adresse.\n\n"
             "**Kein E-Mail-Versand-Knoten.** Der Entwurf geht nur per Telegram an den CEO.", [0, -420]),
    ]
    names = ["Pipeline lesen", "Kontakte mit Einwilligung", "Claude: E-Mail-Entwurf", "Entwurf auswerten",
             "Entwurf speichern", "Entwurf an CEO senden"]
    con = chain(names)
    con["Start (manuell)"] = {"main": [[{"node": names[0], "type": "main", "index": 0}]]}
    con["Zeitplan"] = {"main": [[{"node": names[0], "type": "main", "index": 0}]]}
    return {"name": "Knuddelwuff 2 – E-Mail-Entwürfe (nur mit Einwilligung)", "nodes": nodes, "connections": con,
            "active": False, "settings": {"executionOrder": "v1"}, "pinData": {}}


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for fname, wf in (("knuddelwuff_1_betriebe_finden.json", wf1()), ("knuddelwuff_2_email_entwuerfe.json", wf2())):
        (OUT / fname).write_text(json.dumps(wf, ensure_ascii=False, indent=2), encoding="utf-8")
        print("geschrieben:", fname, "–", len(wf["nodes"]), "Knoten")
