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
