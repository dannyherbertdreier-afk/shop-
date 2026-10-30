# n8n-Pipeline Knuddelwuff – Anleitung

Stand: 30.10.2026 · erstellt von Claude · **noch nicht in Betrieb**.

## Was die Pipeline macht
| Workflow | Ablauf | Versendet etwas? |
|---|---|---|
| `knuddelwuff_1_betriebe_finden.json` | OpenStreetMap → Tabelle „Pipeline“ (neu/aktualisiert über `osm_id`) → max. 20 unbewertete Betriebe pro Lauf → Claude bewertet + schreibt Telefon-Leitfaden (Ziel: Einwilligung erfragen) → Tabelle → Zusammenfassung per Telegram an CEO | Nein (nur Telegram an CEO) |
| `knuddelwuff_2_email_entwuerfe.json` | Tabelle → nur Zeilen mit `einwilligung = ja` **und** `einwilligung_datum` **und** `email_fuer_entwurf` **und** noch ohne Entwurf (max. 10/Lauf) → Claude schreibt Entwurf → Tabelle → Entwurf per Telegram an CEO | **Nein.** Es gibt keinen E-Mail-Versand-Knoten. Der CEO versendet selbst. |

Beide Workflows sind beim Import **inaktiv**; die Zeitpläne (WF1 montags 7 Uhr, WF2 täglich 8 Uhr) laufen erst nach Aktivierung.

## Ablauf für dich (CEO)
1. Workflow 1 läuft → Tabelle füllt sich mit Betrieben, Bewertung und Telefon-Leitfaden.
2. Du rufst passende Betriebe an. Stimmt jemand E-Mails zu, trägst du ein: `einwilligung` = ja, `einwilligung_datum`, `einwilligung_kanal` (z. B. Telefon), `einwilligung_nachweis` (z. B. Gesprächsnotiz), `email_fuer_entwurf`, ggf. `ansprechpartner`.
3. Workflow 2 schickt dir den Entwurf aufs iPhone (Telegram). Du entscheidest und versendest selbst.

## Einrichtung (erst nach CEO-Freigabe – verursacht ggf. Kosten)
1. **Google-Tabelle** anlegen, Blatt „Pipeline“ nennen, Kopfzeile aus `pipeline_vorlage.csv` einfügen. URL kopieren.
2. **n8n** (Cloud-Testphase oder selbst gehostet; Node.js ≥ 24 nötig) → *Import from File* → beide JSON-Dateien.
3. In allen Google-Sheets-Knoten `BITTE_GOOGLE_SHEET_URL_EINTRAGEN` durch die Tabellen-URL ersetzen.
4. Zugangsdaten in n8n anlegen und in den Knoten auswählen:
   - **Google Sheets OAuth2** (eigenes Google-Konto)
   - **Header Auth** für Claude: Name `x-api-key`, Wert = Anthropic-API-Schlüssel (kostenpflichtig nach Verbrauch; Modell `claude-haiku-5-5`)
   - **Telegram API**: eigenen Bot bei @BotFather erstellen; `BITTE_EIGENE_TELEGRAM_CHAT_ID_EINTRAGEN` durch deine Chat-ID ersetzen
5. Erst **manuell** testen („Start (manuell)“), Ergebnis in der Tabelle prüfen, dann ggf. aktivieren.
6. Suchgebiete erweitern: Knoten „Suchgebiete & Kategorien“, Liste `staedte`.

## Geprüft (30.10.2026, in einer temporären n8n-2.44.2-Installation, Node.js 24)
| Prüfung | Ergebnis |
|---|---|
| Tests der Code-Knoten (`node tests/test_code_nodes.cjs`) | 12/12 bestanden |
| Import beider Workflows | erfolgreich, 14 bzw. 9 Knoten, inaktiv |
| n8n-Prüfung der Knoten-Parameter vor Ausführung | nur gemeldet: Platzhalter-Tabellen-URL (erwartet) |
| Probelauf mit Schein-URL | Code-Knoten lief; Abbruch bei OpenStreetMap-Abfrage (`ECONNRESET`) – Netzwerksperre der Cloud-Umgebung, wie bei Harvey |
| E-Mail-/SMTP-Knoten | keine vorhanden |

**Nicht geprüft:** Google-Sheets-, Claude- und Telegram-Schritte (keine Zugangsdaten, kein Konto – bewusst).

## Daten und Recht
- Quelle: © OpenStreetMap-Mitwirkende, ODbL (Namensnennung; Weitergabe der Datenbank nur unter ODbL).
- Datennutzung laut CEO durch IHK bestätigt. E-Mails nur nach dokumentierter Einwilligung; Claude versendet nichts.
- Tabelle enthält Kontaktdaten → nicht öffentlich teilen.

## Dateien
`workflows/*.json` (Import), `code/*.js` (Code-Knoten), `build_workflows.py` (erzeugt die JSON-Dateien neu),
`tests/test_code_nodes.cjs`, `pipeline_vorlage.csv`.
