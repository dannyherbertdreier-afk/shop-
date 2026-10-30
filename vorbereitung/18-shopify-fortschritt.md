# 18 · Shopify-Fortschritt (Ist-Stand im echten Shop)

Stand: 30.10.2026 · **Quelle der Angaben:** Screenshots des CEO (S) bzw. Angabe des CEO/der Projektleitung (A).
Claude hat keinen Shopify-Zugang und hat **nichts selbst eingestellt**.

| Bereich | Ist-Stand | Quelle | Bewertung |
|---|---|---|---|
| Konto | angelegt (Testphase) | A | ✔ |
| Währung | EUR | S | ✔ |
| Backup-Region | Deutschland | S | ✔ |
| Einheiten / Zeitzone | metrisch, kg / Berlin | S | ✔ |
| Shop-Sprache | Deutsch (Standard) | S | ✔ |
| Märkte | Österreich entfernt, nur Deutschland | A | ✔ (entspricht Empfehlung) |
| Preise inkl. USt (19 %) | an | S | ✔ |
| USt auf Versand | aus | S | ⚠️ offen – Steuerberater (zusammen mit Kleinunternehmer-Frage) |
| Shopify-Steuerdienst | aktiv | S | ✔ bis 100.000 € Umsatz gebührenfrei (`17` Teil 11) |
| Bestellabwicklung | Bestätigungsschritt an; keine automatische Ausführung; Auto-Archiv an | S | ✔ |
| Kundenkonten | Shop-Anmeldung an; Google/Facebook aus | A | ✔ |
| Checkout | E-Mail, Gastbestellung, einseitig; Adress-Autovervollständigung, „Erneut kaufen“ an | A | ✔ (Gastbestellung laut Baymard wichtig gegen Abbrüche) |
| Rückgabe-/Stornoanträge | an | A | ⏳ Regeln prüfen (`17` Teil 11) |
| Versand Standard | 5,99 €, kostenlos ab 55 €, 3–5 Werktage | A | ⚠️ Lieferzeit unbestätigt; Schwelle nach Lieferantenpreisen prüfen |
| Versand Express | 9,99 €, 1–2 Werktage | A | ⚠️ **Empfehlung: entfernen**, bis Lieferant bestätigt |
| Shopname | „Mein Shop“ | S | offen (Markenfreigabe) |
| Shop-Adresse | Privatadresse eingetragen | S | offen: vor Launch entscheiden (Impressum, Rechnungen) |
| Absender-E-Mail | private Gmail-Adresse | S | offen: wird ohne eigene Domain laut Help Center auf `…@shopifyemail.com` umgeschrieben |
| Passwortschutz | an (laut CEO) | A | ✔ bleibt an |
| Theme, Menüs, Seiten, Kollektionen, E-Mail-Design, Richtlinien | noch nicht begonnen | – | Anleitung `17` |
| Printify / CJ | Konten vorhanden, **nicht verbunden** | A | ✔ wie geplant |

---

## Änderungen per API durch Claude (30.10.2026)

Zugang: eigene App „Claude Einrichtung“ (Dev Dashboard), Rechte nur Themes, Inhalte, Navigation, Produkte/Kollektionen.
**Nach Abschluss App deinstallieren und löschen.** Schlüssel liegen nicht im Repository.

| Bereich | Änderung | Kontrolle |
|---|---|---|
| Seiten | „Über uns“ (`/pages/ueber-uns`) und „Größe & häufige Fragen“ (`/pages/groesse-und-faq`) angelegt | API-Antwort ✔ |
| Kollektionen | Hundemäntel, Pfotenschutz, Winter-Overalls, Winterzubehör – automatisch über Tags `kategorie-*` | API-Antwort ✔ (Sichtbarkeit im Onlineshop ungeprüft) |
| Hauptmenü | Startseite, Alle Produkte, Größe & FAQ, Über uns, Kontakt | API-Antwort ✔ |
| Footer-Menü | Suche, Größe & FAQ, Über uns, Kontakt | API-Antwort ✔ |
| Theme-Farben | 4 Farbschemata nach Design-Paket (Creme, Waldgrün, Salbei, Sand; Orange als Akzent auf Dunkelgrün) | Datei neu ausgelesen ✔, Passwortseite live ✔ |
| Schriften | Überschriften Manrope 700, Text Inter 400, H1 64 px; Button-Ecken 10 px | Datei ✔, Passwortseite live ✔ |
| Startseite | Hero „Gut geschützt durch den Winter.“ + Text + 2 Buttons; Vorteile (3); Winterproblem + Größe; Über uns; FAQ (4); Abschluss-Aufruf; Beispielprodukt-Abschnitte **ausgeblendet** (nicht gelöscht) | Datei ✔, **Optik ungeprüft** (Shop passwortgeschützt) |
| Footer | Links „Über uns“, „Größe & FAQ“ gesetzt; „Rückgabebedingungen“ und Newsletter-Anmeldung ausgeblendet | Datei ✔ |
| Produktseite | Preis mit Steuerhinweis; „Das könnte dir auch gefallen“ | Datei ✔ |
| Passwortseite | „Wir öffnen bald. / Wir bereiten gerade alles für den Winter vor.“, Newsletter-Feld aus | live geprüft ✔ |
| Warenkorb | war bereits „Drawer“ – unverändert | ✔ |

**Nicht angefasst:** Shopname, Passwortschutz, Zahlungen, Versand, Rechtstexte.

## Aufgabe 1 – Beispielprodukte (30.10.2026)

| Produkt | Handle | Vorher | Nachher (per API erneut ausgelesen) |
|---|---|---|---|
| Beispielprodukt | animals-and-pet-supplies-example-product-1 | Aktiv | **Entwurf** |
| Beispielprodukt | animals-and-pet-supplies-example-product-2 | Aktiv | **Entwurf** |
| Beispielprodukt | animals-and-pet-supplies-example-product-3 | Aktiv | **Entwurf** |
| Beispielprodukt | animals-and-pet-supplies-example-product-4 | Aktiv | **Entwurf** |

Zuordnung: einzige 4 Produkte im Shop, Tag „Sample Product“, angelegt 08:11 Uhr zusammen mit dem Theme. Nicht gelöscht.
Zählung danach: 0 aktiv, 4 Entwurf. Sichtbarkeit im Shop von außen **ungeprüft** (Passwortschutz).

## Aufgabe 2 – Express-Versand entfernen (30.10.2026): NICHT DURCHGEFÜHRT

- Status: **blockiert – fehlende Berechtigung**.
- Lesender Test `deliveryProfiles` → Shopify-Antwort: „Access denied for deliveryProfiles field.“ (`ACCESS_DENIED`).
- Die App „Claude Einrichtung“ hat keine Versand-Rechte (`read_shipping`/`write_shipping`). Auf CEO-Anweisung keine Rechte ergänzt, nichts umgangen.
- Versandtarife sind **unverändert**: Express 9,99 € (1–2 Werktage) besteht weiterhin.
- Optionen: CEO entfernt den Tarif selbst (Einstellungen → Versand und Zustellung), oder CEO ergänzt bewusst die Versand-Rechte in einer neuen App-Version.

## Aufgabe 3 – Durchgang „autonomer Shopify-Manager“ (30.10.2026)

**Rechte-Prüfung:** Neuer Zugangsschlüssel liefert weiterhin nur `write_themes, write_content, write_online_store_navigation, write_products`
(die Schreibrechte schließen Lesen ein). **Versand- und Verkaufskanal-Rechte sind nicht aktiv.**

| Aufgabe | Ergebnis | Kontrolle |
|---|---|---|
| 1 Bestand prüfen | Theme „Whisper“ aktiv, „Horizon“ unveröffentlicht; 4 Produkte, 0 aktiv; Shopname „Mein Shop“ | API ✔ |
| 2 Express-Versand entfernen | **nicht möglich** – fehlende Rechte `read_shipping`/`write_shipping` | – |
| 3 Plan und Kosten | Plan laut API „Basic“, keine Partner-Entwicklungs-Shop; Rechnungen/Testphase per API **nicht lesbar** | API ✔ (nur Planname) |
| 4 Englische Reste | übersetzt: 404 („Seite nicht gefunden“ …), Warenkorb („Warenkorb“, „Das könnte dir auch gefallen“, „Alle ansehen“), Kontaktformular („Senden“), Kategorienübersicht („Kategorien“) | Dateien neu ausgelesen ✔ |
| 5 Mobile Darstellung | Überschriften skalieren laut Theme-Code automatisch (`clamp()` in `snippets/theme-styles-variables.liquid`); **Sichtprüfung offen** (Besucher-Passwort fehlt) | Code gelesen |
| 6 Seiten auf Fehler | Vorlagen ohne englische Reste; Optik **ungeprüft** | API ✔ |
| 7 Vorbereitung Printify/CJ | 6 leere Produkt-Datenfelder (Metafelder `custom.*`): Hersteller (GPSR), EU-Verantwortlicher (GPSR), Warn- und Sicherheitshinweise, Material, Pflegehinweise, Größentabelle | API-Antwort ✔ |

Sicherungen der 4 geänderten Vorlagen: `shopify-theme-sicherung/original-30-10-2026/templates_*.json`.
Die Datenfelder werden noch **nicht** auf der Produktseite angezeigt (erst sinnvoll, wenn echte Produkte mit Werten existieren).
