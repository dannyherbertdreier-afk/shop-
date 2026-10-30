# 21 · Architektur-Entscheidung: Kontaktfindung für Knuddelwuff

Stand: 30.10.2026 · Recherche ohne Installation, ohne Konten, ohne Kosten. Keine Rechtsberatung.

## Harte Randbedingungen aus der Recherche (mit Quelle)

| # | Befund | Quelle |
|---|---|---|
| R1 | E-Mail-Werbung ohne vorherige ausdrückliche Einwilligung unzulässig, auch B2B (§ 7 Abs. 2 Nr. 2 UWG); B2B-Telefon nur mit „zumindest mutmaßlicher Einwilligung“ (Nr. 1), „allgemeiner Sachbezug reicht nicht“ (BayLDA, BGH I ZR 27/08) | gesetze-im-internet.de/uwg_2004/__7.html · lda.bayern.de Info-Blatt Werbung |
| R2 | DSK: „Nicht zulässig ist … das Auslesen der Daten aus einem Online-Impressum zum Zweck der werblichen Nutzung“ – betrifft Daten von Einzelunternehmern (personenbezogen) | DSK Orientierungshilfe Werbung, Feb. 2022, Nr. 4.2 |
| R3 | Claude Pro/Max (Consumer Terms): verboten ist Zugriff „through automated or non-human means, whether through a bot, script, or otherwise“, außer per API-Key oder ausdrücklicher Erlaubnis; Limits gelten für „ordinary, individual usage“ | anthropic.com/legal/consumer-terms · code.claude.com/docs/en/legal-and-compliance |
| R4 | Google Places (EWR-Bedingungen): Namen/Adressen nicht speichern („copy and save business names, addresses“ verboten), nur place_id dauerhaft, Koordinaten max. 30 Tage | cloud.google.com/terms/maps-platform/eea |
| R5 | OpenStreetMap: kostenlos, speicherbar unter ODbL (Namensnennung; Share-Alike erst bei Weitergabe). DE-Bestand: shop=pet 2.900, pet_grooming 838, animal_boarding 497, animal_training 822 | osmfoundation.org Licence FAQ · taginfo.geofabrik.de |
| R6 | Harvey-Dashboard nur auf 127.0.0.1, Fernzugriff per Tunnel; Docker nur Linux | Harvey README |
| R7 | n8n Community Edition: interne Geschäftsnutzung kostenlos (Sustainable Use License); keine offizielle iOS-App; Freigabe per Telegram „Send and Wait for Response“ | github.com/n8n-io/n8n LICENSE.md · docs.n8n.io |

## Vergleich

| Kriterium | 1 Harvey lokal | 2 Harvey auf VPS | 3 n8n-Workflow | 4 Hybrid (Datendienst + Harvey) |
|---|---|---|---|---|
| Monatliche Kosten | 0 € zusätzlich (Claude-Abo vorausgesetzt) | VPS ab 5,99 € netto (Hetzner CX23; Seite zeigte „currently unavailable“) bzw. 9,50 € brutto (Netcup, 12 Mon.); iPhone-Zugang per Tailscale: gratis nur nicht-kommerziell, sonst $8/Nutzer | Cloud Starter 20 €/Monat (jährlich) **oder** selbst gehostet auf VPS ab ~6–10 €; Claude-API Haiku: Cent-Bereich (Schätzung); Sheets/Telegram 0 € | VPS + Datendienst (DataForSEO $0,012/Abfrage + $0,00036/Eintrag) + ggf. API |
| Technische Komplexität | mittel | hoch (Server, Updates, Tunnel) | niedrig–mittel | hoch |
| Zuverlässigkeit | nur wenn Rechner läuft | gut | gut (Cloud) | gut, viele Teile |
| Wartung | gering | hoch | gering (Cloud) / mittel (selbst gehostet) | hoch |
| Datenschutz | Daten lokal ✔ | Daten auf eigenem Server ✔ | Cloud: Daten bei n8n + Google Sheets; selbst gehostet: eigener Server | wie 2 + Datendienst |
| Automatisierbarkeit | eingeschränkt | hoch | hoch, frei gestaltbar (Telefon-Leitfaden statt E-Mail) | hoch |
| Abhängigkeit vom eigenen Rechner | **hoch** | keine | keine | keine |
| iPhone-Bedienung | nein | nur mit Tunnel/Tailscale | **ja** (Telegram-Freigabe, Sheets-App, Formular-Links) | nur mit Tunnel |
| Passung zum Ziel | Harvey ist auf **E-Mail-Versand** ausgelegt – in DE ohne Einwilligung nicht nutzbar | wie 1 | Telefon-/Brief-Leitfäden und Freigabe direkt abbildbar | Doppelaufwand |
| Vertrags-Risiko | Claude-Abo im Dauerbetrieb (R3) | **hoch** (R3, unbeaufsichtigt) | keins mit API-Key | wie 2 |

## Empfehlung

**Option 3 als schlanke Variante – Harvey vorerst parken.**

- Datenquelle: **OpenStreetMap** (kostenlos, speicherbar, Kategorien für Hundebetriebe vorhanden), **nicht** Google Places (R4).
- Pipeline: **Google Sheets** (gratis, iPhone-App, keine Datensatzgrenze wie bei Airtable Free mit 1.000 API-Calls/Monat).
- Qualifizierung + Gesprächsleitfaden: **Claude über API-Key** (Haiku), nicht über das Abo (R3).
- Freigabe vom iPhone: **Telegram „Send and Wait for Response“**.
- Kein E-Mail-Versand; Ergebnis ist ein Telefon-/Brief-Leitfaden je Betrieb.
- Betrieb: zunächst **n8n Cloud Starter** (keine Server-Wartung), später ggf. selbst gehostet.

**Vorbehalt (entscheidend):** R1 und R2 betreffen jede Variante gleich. Ob gezielte Telefon- oder Briefansprache von
Hundebetrieben mit Daten aus OSM/Websites zulässig ist, muss vor dem Aufbau rechtlich geklärt werden.
Ohne diese Klärung ist jede automatisierte Kontaktfindung eine Investition mit unklarem Nutzen.

## Genau ein nächster Schritt
**Anwaltliche Erstberatung (oder IHK-Rechtsauskunft) mit drei Fragen:**
1. Dürfen wir Hundebetriebe (oft Einzelunternehmer) anhand öffentlicher Branchendaten (OSM, Website) **telefonisch** oder **per Brief** ansprechen – unter welchen Bedingungen gilt „mutmaßliche Einwilligung“?
2. Dürfen wir diese Kontaktdaten dafür in einer eigenen Tabelle speichern (DSGVO, DSK-Orientierungshilfe Nr. 4.2)?
3. Wie holen wir rechtssicher eine Einwilligung für spätere E-Mails ein?

## CEO-Entscheidung (30.10.2026)
- Laut CEO: **„Wir dürfen diese Daten nutzen.“** Von Claude **nicht** rechtlich geprüft; Grundlage (Anwalt/IHK, Umfang) noch nicht dokumentiert.
- Unverändert gilt, solange nicht ausdrücklich anders freigegeben: **kein E-Mail-Versand ohne Einwilligung** (§ 7 Abs. 2 Nr. 2 UWG), kein automatischer Versand.
- Architektur: Option 3 (n8n + OpenStreetMap + Google Sheets + Claude-API + Telegram-Freigabe), Harvey vorerst geparkt.
