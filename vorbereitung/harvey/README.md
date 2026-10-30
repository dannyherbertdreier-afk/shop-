# Harvey für Knuddelwuff – Installations- und Konfigurationsprotokoll

Stand: 30.10.2026 · Harvey: https://github.com/ethanplusai/harvey, Commit siehe `harvey-version.txt`

## Status

| Schritt | Status | Nachweis |
|---|---|---|
| Voraussetzungen | Python 3.13 ✔, Claude-CLI 2.1.314 mit `--safe-mode` ✔ | Testaufruf `claude -p --safe-mode` → „OK“ |
| Installation | ✔ in der Cloud-Sitzung (`/home/user/ethanplusai/harvey`, venv) | `harvey --help`, `harvey status` laufen |
| Claude als Provider | ✔ (Standard) | – |
| Training auf Knuddelwuff | ✔ manuell (Shop passwortgeschützt → kein Website-Training möglich) | `harvey.local.yaml`, `product_knowledge.md` |
| Signale | ✔ 26 kostenlose Signale bestätigt (`harvey signals --confirm free`) | Ausgabe „26 signal(s) confirmed“ |
| Versand | **pausiert** (`harvey sending pause`), Freigabepflicht an, kein Postfach verbunden | „Sending paused“ |
| Firmensuche (OpenStreetMap) | ✖ **blockiert**: Netzwerk der Cloud-Umgebung bricht Verbindungen zu `overpass-api.de` (sowie `overpass.kumi.systems`, `overpass.private.coffee`) ab | Proxy-Status `ws_closed_mid_exchange`, 0 Firmen |
| Website-Profiling | ✖ voraussichtlich nicht möglich: Harvey ruft Websites bewusst **ohne** Proxy auf (`harvey/public_http.py`, `trust_env=False`); in dieser Umgebung läuft Internetzugang nur über den Proxy (**Vermutung**, nicht getestet) | Code gelesen |
| Leads / E-Mail-Entwürfe | 0 / 0 | – |
| Dashboard | nur innerhalb der Cloud-Sitzung (`127.0.0.1:5555`), vom iPhone nicht erreichbar | – |

## Konfiguration (Datei `harvey.local.yaml` in diesem Ordner)
- Persona: Platzhalter `[NAME ABSENDER]`, `[ABSENDER-ADRESSE]` (nichts erfunden)
- Produkt: „Online-Shop im Aufbau“, keine Preise, keine Produktversprechen; Ziel: Rückmeldung (`get_reply`)
- ICP: Hundesalon, Zoofachgeschäft, Hundepension, Hundetagesstätte, Hundeschule; 1–20 Mitarbeitende; Inhaber/Geschäftsführung
- Testgebiet: Mannheim und Frankfurt am Main (je 15 km Radius)
- Versand: Freigabe für jede E-Mail, max. 10/Tag, Stopp ab 3 % Bounces, keine Catch-all-Adressen, Mo–Fr 9–17 Uhr
- Claude-Nutzung: max. 30 % des Tageskontingents, Ruhezeit 20–08 Uhr (Europe/Berlin)
- LinkedIn: aus · Opt-out-Zeile auf Deutsch · Postanschrift: **fehlt (CEO)**

## Lokale Anpassungen am Harvey-Code (`lokale-anpassungen.diff`)
1. OpenStreetMap-Kategorien für Hundebetriebe (`shop=pet_grooming`, `shop=pet`, `amenity=animal_boarding`, `amenity=animal_training`) – Harvey kannte nur US-Handwerk.
2. Deutsche Abmelde-Antworten werden erkannt („abmelden“, „nein danke“, „kein Interesse“, „keine Werbung“ …).
3. Opt-out-Zeile darf „Antworten Sie (einfach) mit …“ verwenden.

## Rechtlicher Hinweis (wichtig)
§ 7 Abs. 2 Nr. 2 UWG: Werbung per E-Mail ohne **vorherige ausdrückliche Einwilligung** gilt als unzumutbare Belästigung –
auch gegenüber Unternehmen. Harvey weist selbst darauf hin („Germany wants prior consent even for business email“).
Telefonwerbung gegenüber Unternehmen ist dagegen mit „zumindest mutmaßlicher Einwilligung“ zulässig (§ 7 Abs. 2 Nr. 1 UWG).
→ Kalt-E-Mails an deutsche Hundebetriebe nur nach anwaltlicher Prüfung bzw. mit Einwilligung. Quelle: https://www.gesetze-im-internet.de/uwg_2004/__7.html
Keine Rechtsberatung.

## Nicht im Repository (bewusst)
Lead-Daten mit Personennamen (Repository ist öffentlich), Zugangsdaten, `.env`.

## Technische Qualitätsprüfung (30.10.2026)

| Prüfung | Ergebnis |
|---|---|
| Neue Tests `test_knuddelwuff_local.py` (DE-Opt-outs, Pet-OSM-Tags, Opt-out-Zeile, lokale Config) | **30 bestanden, 0 fehlgeschlagen** |
| Bestehende Tests der betroffenen Bereiche (Config, Compliance-Footer, Opt-out, Security-Defaults, Discover, Outbox, Gmail-Inbox) | 306 bestanden, 0 fehlgeschlagen |
| Gesamte Harvey-Testsuite (inkl. neuer Tests) | **2640 bestanden, 26 übersprungen, 0 fehlgeschlagen** |
| Versand | `harvey sending status` → „PAUSED — paused manually“ |
| require_approval / max_daily_sends / LinkedIn | true / 10 / aus (per Test und Config geprüft) |
| Pipeline | 0 Firmen, 0 Kontakte, 0 Outbox-Einträge |
| CLI | alle 18 Unterbefehle antworten auf `--help`; `harvey status`, `harvey outbox` laufen |
| Secrets | keine `.env`; `harvey.local.yaml`, `data/` laut `.gitignore` von Harvey ausgeschlossen; Scan des Knuddelwuff-Repos (inkl. Historie) ohne Treffer |
| Lead-Daten im Knuddelwuff-Repo | keine |

Bekannte Einschränkungen der Patches: Teilwort-Erkennung („abmelden“, „kein interesse“) kann in seltenen Fällen eine Antwort
fälschlich als Abmeldung werten (sichere Richtung: Kontakt endet). Deutsche Anführungszeichen „…“ in der Opt-out-Zeile werden
vom Prüf-Regex nicht erkannt → gerade Anführungszeichen verwenden.
