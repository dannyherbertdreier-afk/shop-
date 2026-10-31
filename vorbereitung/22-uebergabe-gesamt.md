# Knuddelwuff – Übergabeprotokoll, Entwickler-Protokoll und CEO-Bericht

Stand: 30.10.2026, ca. 19:10 Uhr · Erstellt von Claude (Claude Code) · Keine Rechtsberatung.
Kennzeichnung: ✔ geprüft · ⚠️ offen/Risiko · ❓ unbestätigt

---

# TEIL 1 – ÜBERGABEPROTOKOLL

## 1.1 Systeme und Zugänge
| System | Stand | Hinweis |
|---|---|---|
| GitHub-Repo `dannyherbertdreier-afk/shop-` (öffentlich) | `main` = `a0a9e59` unverändert ✔ · Arbeitsbranch `claude/shop-vorbereitung` | PR #4 (Knuddelwuff-Umbenennung Demo) offen, nicht mergen |
| GitHub Pages (alte Demo) | Workflow `disabled_manually` ✔, Seite 404 ✔ | nicht wieder einschalten ohne Freigabe |
| Shopify-Shop `zcrydz-s0.myshopify.com` | Plan laut API „Basic“; Passwortschutz an; Theme „Whisper“ aktiv | Testphase/Abbuchung ❓ (per API nicht lesbar) |
| Shopify-App „Claude Einrichtung“ (Dev Dashboard) | Rechte: `write_themes, write_content, write_online_store_navigation, write_products` | ⚠️ Client-Secret wurde im Chat übermittelt → nach Abschluss App **löschen** oder Secret **neu erzeugen** |
| CJdropshipping | Konto vorhanden; mit Shop **verbunden** („Autorisiert“) ✔ | von CJ angefragte Shopify-Rechte ❓ (Berechtigungsseite nicht gesehen) |
| Printify | Konto vorhanden, **nicht verbunden** | – |
| Harvey | in der Cloud-Sitzung installiert (flüchtig) | geparkt; Konfiguration im Repo gesichert |
| n8n-Pipeline | Workflows gebaut und getestet, **nicht in Betrieb** | Konten (n8n, Google, Anthropic-API, Telegram) fehlen |

## 1.2 Geltende Regeln (CEO-Vorgaben)
- Kein Merge nach `main`, kein Deployment, GitHub Pages bleibt aus, PR #4 bleibt offen.
- Shop bleibt passwortgeschützt; Launch nur mit ausdrücklicher CEO-Freigabe.
- Keine kostenpflichtigen Dienste/Apps, keine Zahlungen aktivieren, keine Produkte importieren ohne Freigabe.
- Keine erfundenen Produkte, Bewertungen, Lieferzeiten, rechtlichen Angaben.
- Hero-Überschrift exakt: „Gut geschützt durch den Winter.“
- Markenname „Knuddelwuff“ = Arbeitsname, rechtlich nicht freigegeben (Ähnlichkeit „Knuffelwuff“).
- Datennutzung von Betriebsdaten: laut CEO durch **IHK** freigegeben (Dokument nachreichen).
- E-Mails: Claude **bereitet nur vor und sendet an den CEO**; Versand ausschließlich durch den CEO; Entwürfe nur bei dokumentierter Einwilligung.
- Keine LinkedIn-Automatisierung, keine gekauften Listen, keine Massenmails.

## 1.3 Dokumente (Ordner `vorbereitung/`)
01 Design-Paket · 02 Produkt-Prüfliste · gewinnrechner.xlsx · 04 Motive + `motive/` · 05 Firmendaten-Checkliste ·
06 Produkt-Shortlist (alt) · 07 GitHub Pages abschalten ✔ · 08 Audit · 09 Shopify-Einrichtung · 10 App-Strategie ·
11 Startseite/Navigation/Kategorien · 12 Integration Printify/CJ · 13 Recht-Checkliste · 14 Conversion ·
15 SEO/Traffic · 16 Arbeitsplan/CEO-Aufgaben · 17 Shopify-Anleitung offene Bereiche · **18 Shopify-Fortschritt (Ist-Stand)** ·
**19 Launch-Voraussetzungen** · **20 Produkt-Shortlist Launch** · **21 Architektur-Entscheidung** · 22 dieses Dokument ·
`shopify-theme-sicherung/` · `harvey/` · `n8n/`

## 1.4a Nachtrag 31.10.2026
- CJ per API geprüft (`23`): in EU-Lagern **keine** Hundebekleidung/-schuhe; CJ-Regenmantel wird **nicht** importiert.
- Phase 2 (`24`): Favorit **Rukka über Warmako (NL)**, Dropshipping über Droppery; Einkaufspreise nur mit
  Händlerkonto (Voraussetzung: Gewerbe, USt-IdNr., aktiver Webshop). Shortlist 12 Kandidaten.
- `25`: Produktdaten-Struktur und Entwurf der Produktseite mit Metafeldern (nur im Repo).
- Der Schritt in 1.4 unten ist damit überholt.

## 1.4 Laufender Arbeitsschritt
CJ ist verbunden. Nächster Schritt: In CJ `dog winter coat` (danach `dog boots`) suchen, Versandort-Filter Germany/EU,
Screenshots der Ergebnisse an Claude → Bewertung (Preis, Versand, Lieferzeit, Marge) → erst dann „List“ in den Shop.

---

# TEIL 2 – ENTWICKLER-PROTOKOLL

## 2.1 Repository
- Branch `claude/shop-vorbereitung`, letzte Commits:
  `40db247` n8n-Pipeline · `4b41a5c`/`6ba09cd` CEO-Entscheidungen · `2bab27c` Architektur ·
  `2a282c2` Harvey-QA · `e28d706` Harvey-Doku · `15abaf9` Produkt-Shortlist · `8cdfbbb` Launch-Voraussetzungen ·
  `ba29cee` Theme-Texte/Metafelder · `37651ba` Beispielprodukte/Versand · `3d265b3` Theme-Sicherung
- `main` unverändert `a0a9e59`. Keine Secrets im Repo (Scan inkl. Historie ohne Treffer).

## 2.2 Shopify (Admin GraphQL API 2026-10, Client-Credentials-Grant, Token 24 h)
Umgesetzt und per erneutem Auslesen geprüft:
- Seiten `ueber-uns`, `groesse-und-faq`; Kollektionen (Smart, Tag-Regeln) `hundemaentel` (`kategorie-maentel`),
  `pfotenschutz`, `winter-overalls`, `winterzubehoer`.
- Menüs `main-menu`, `footer` neu.
- Theme „Whisper“ (Horizon-Familie, themeStoreId 2481): `config/settings_data.json` (4 Farbschemata, Manrope 700/Inter 400,
  H1 64, Radius 10), `templates/index.json` (Hero, Vorteile, Problem/Größe, Über uns, FAQ-Accordion, CTA; Beispiel-Sektionen
  disabled), `sections/footer-group.json`, `templates/password.json`, `templates/product.json` (Steuerhinweis, DE-Text),
  `templates/404|cart|page.contact|list-collections.json` (DE).
- 4 Beispielprodukte (`Sample Product`) → `DRAFT` (0 aktiv).
- 6 Produkt-Metafeld-Definitionen `custom.*` (multi_line_text_field): hersteller, eu_verantwortlicher, warnhinweise,
  material, pflege, groessentabelle (noch nicht im Template ausgegeben).
- Sicherungen: `vorbereitung/shopify-theme-sicherung/original-30-10-2026/` und `geaendert-30-10-2026/`.
Blockiert: Versandprofile (`ACCESS_DENIED`, fehlt `read/write_shipping`), Publikation der Kollektionen
(fehlt `read/write_publications`), Plan/Billing nicht lesbar, Sichtprüfung Storefront (Besucher-Passwort fehlt).

## 2.3 Harvey (github.com/ethanplusai/harvey @ `4237f07`)
- Installiert im ephemeren Container (`/home/user/ethanplusai/harvey`, venv), Branch `knuddelwuff-local`.
- Patches: DE-Opt-outs (handler.py, config.py), OSM-Tags für Hundebetriebe (discover.py) → `vorbereitung/harvey/lokale-anpassungen.diff`.
- Tests: neue 30/30; Gesamtsuite 2640 passed, 26 skipped, 0 failed. Versand `PAUSED`, require_approval true, max 10/Tag, LinkedIn aus.
- Blocker: Overpass-API über Agent-Proxy (`ECONNRESET`); Profiling mit `trust_env=False` in dieser Umgebung voraussichtlich
  nicht lauffähig (nicht getestet/umgangen); Dashboard nur 127.0.0.1.
- Vertragsrisiko: Claude Consumer Terms untersagen Zugriff „through automated or non-human means … bot, script“ außer per API-Key.
  → Harvey geparkt (Architektur-Entscheidung 21).

## 2.4 n8n-Pipeline (`vorbereitung/n8n/`)
- `workflows/knuddelwuff_1_betriebe_finden.json` (14 Knoten): Manual/Schedule → Code (Suchgebiete) → HTTP Overpass
  (form-urlencoded, Batch 1/3 s) → Code (Zeilen, Dedupe `osm_id`) → Sheets appendOrUpdate (`osm_id`) → Sheets read
  (executeOnce) → Code (max 20 unbewertet) → HTTP Anthropic Messages (`claude-haiku-5-5`, Header-Auth `x-api-key`) →
  Code (JSON parsen) → Sheets update → Code (Zusammenfassung) → Telegram an CEO.
- `workflows/knuddelwuff_2_email_entwuerfe.json` (9 Knoten): Sheets read → Code (nur einwilligung=ja + Datum + Adresse +
  ohne Entwurf, max 10) → Anthropic → Code → Sheets update → Telegram (Entwurf an CEO). **Kein Mail-/SMTP-Knoten.**
- Erzeugt durch `build_workflows.py`; Code-Knoten in `code/*.js`; Platzhalter: Sheet-URL, Telegram-Chat-ID; keine Credentials im JSON.
- Tests: `node tests/test_code_nodes.cjs` → 12/12. Import in n8n 2.44.2 (Node 24, isolated-vm neu gebaut) erfolgreich,
  beide inaktiv. Pre-Execution-Check: nur Platzhalter-URL gemeldet. Probelauf: Code-Knoten ok, Overpass `ECONNRESET` (Netzwerk).
- Nicht getestet: Sheets, Anthropic, Telegram (keine Konten).

## 2.5 Offene technische Punkte
1. Express-Versandtarif entfernen (CEO im Admin oder Rechte `read/write_shipping`).
2. Kollektionen im Online Store veröffentlichen (Rechte `read/write_publications` oder CEO im Admin).
3. Storefront-Sichtprüfung mobil/desktop (Besucher-Passwort).
4. Produkte aus CJ übernehmen → Tags `kategorie-*`, `quelle-cj`; Metafelder befüllen; Metafelder im Produkt-Template ausgeben.
5. n8n: Betrieb außerhalb dieser Cloud-Umgebung (Overpass erreichbar).
6. App „Claude Einrichtung“ nach Abschluss löschen / Secret rotieren.

---

# TEIL 3 – CEO-BERICHT

## Kurz gesagt
Der Shop ist technisch weit: Design, Startseite, Menüs, Seiten und Kategorien stehen, CJdropshipping ist **verbunden**.
Jetzt kommen die **ersten echten Produkte**. Verkaufen dürfen wir erst, wenn Rechtstexte, Gewerbe/Steuer und
Zahlungsanbieter stehen. Für die Kontaktsuche liegt eine fertige, geprüfte n8n-Lösung bereit – noch nicht in Betrieb.

## Fertig
- Shop-Design (Creme/Waldgrün), Startseite „Gut geschützt durch den Winter.“, Menüs, Seiten „Über uns“ und „Größe & FAQ“
- 4 Kategorien, deutsche Texte, Pflichtfelder für Produktangaben
- Beispielprodukte auf Entwurf, Passwortschutz an
- CJdropshipping mit dem Shop verbunden
- Launch-Checkliste, Produkt-Shortlist, Architektur-Entscheidung, klickbare To-do-Liste
- Kontaktsuche: n8n-Abläufe gebaut und getestet (finden → bewerten → Telefon-Leitfaden → E-Mail-Entwurf nur mit Einwilligung, an dich)

## Offen / blockiert
| Punkt | Wer |
|---|---|
| Express-Versand „1–2 Werktage“ löschen | CEO |
| Plan und Abbuchungsdatum prüfen | CEO |
| Besucher-Passwort für Sichtprüfung | CEO → Claude |
| Erste Produkte in CJ suchen (Lager DE/EU) und Screenshots schicken | CEO → Claude prüft |
| Rechtstexte-Dienst, Gewerbe, Finanzamt/Kleinunternehmer | CEO |
| Zahlungsanbieter (Shopify Payments) | CEO |
| Markenname prüfen lassen | CEO + Anwalt |
| IHK-Auskunft zur Datennutzung als Dokument ablegen | CEO |
| n8n-Kontaktsuche starten (n8n, Google-Tabelle, Claude-API, Telegram) | CEO entscheidet, Kosten |

## Kosten (Stand Recherche, teils in USD angezeigt)
- Shopify Basic: 39 $ monatlich bzw. 29 $/Monat jährlich (EUR ❓)
- CJ: Installation kostenlos, Kosten je Bestellung
- n8n Cloud: 20 €/Monat bei jährlicher Zahlung (Testphase kostenlos) · Claude-API Haiku: Cent-Bereich (Schätzung)
- Bisher wurde durch Claude **nichts** gebucht oder bezahlt.

## Risiken
- Unbelegte Lieferzeiten (Express 1–2 Werktage) sind abmahnfähig
- Markenname nicht freigegeben
- Zugangs-Secret der Shopify-App liegt im Chatverlauf → App später löschen
- Margen bei Print-on-Demand knapp; Dropshipping-Preise erst mit CJ-Konto prüfbar

## Nächster Schritt
In CJ nach `dog winter coat` suchen (Versandort Germany/EU), Screenshots an Claude senden.
