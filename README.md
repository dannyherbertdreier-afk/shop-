# Knuddelwuff – Demo-Shop für Hunde-Winterbekleidung

Klickbarer Demo-Onlineshop für die Arbeitsmarke **Knuddelwuff**: Hundemäntel,
Pfotenschutz, Winter-Overalls und Winterzubehör für Hundebesitzer in Deutschland.

> **Demo im Aufbau.** Alle Produkte sind Beispielprodukte mit Beispielpreisen.
> Es werden keine echten Bestellungen, Zahlungen, E-Mails oder Lieferungen
> abgewickelt. Warenkorb, Demo-Bestellungen und Newsletter-Eintrag liegen nur im
> `localStorage` des jeweiligen Browsers. Rechtstexte sind Platzhalter.
> „Knuddelwuff“ ist ein Arbeitsname; die Markenverfügbarkeit ist nicht geprüft.
> Achtung: Es existiert eine sehr ähnliche Marke für Hundebetten („Knuffelwuff“).
> Vor einem echten Start ist eine Markenprüfung nötig.

Live-Vorschau (nach dem Merge in `main`): https://dannyherbertdreier-afk.github.io/shop-/

## Starten

Voraussetzung: Node.js 18+ (getestet mit Node 22).

```bash
npm install
npm run dev              # Entwicklungsserver, http://localhost:5173
npm run build            # Produktions-Build nach dist/
npm run preview          # Build ausliefern, http://localhost:4173
npm test                 # Unit-Tests (Katalog, Suche/Filter, Warenkorb, Validierung)
npm run test:e2e         # Browser-Test (benötigt laufendes `npm run preview` und Playwright)
npm run sample:products  # Beispielprodukte neu erzeugen
```

Veröffentlicht wird automatisch per GitHub Actions (`.github/workflows/pages.yml`),
sobald Änderungen in `main` landen.

## Funktionen

- Startseite: Hero, Vorteile, Kategorien, ausgewählte Produkte, Über-uns-Bereich, FAQ
- Kollektionen: Winterkollektion + Hundemäntel, Pfotenschutz, Winter-Overalls, Winterzubehör
- Filter (Kategorie, Größe, Farbe, Höchstpreis, Verfügbarkeit), Sortierung, 1/2-Spalten-Ansicht mobil
- Suche (Overlay mit Sofortergebnissen + Ergebnisseite), berücksichtigt Umlaute
- Produktseite: Bildergalerie, Farb- und Größenauswahl (Größe muss bewusst gewählt werden),
  Menge, Größenhilfe, klar gekennzeichnete Beispielprodukte und -preise
- Warenkorb (Seitenleiste + Seite), Demo-Kasse mit Validierung, Bestätigung, Bestellverfolgung
- Kontaktformular, FAQ, Über uns, Versand/Rückgabe- und Rechtsseiten als Platzhalter, Bildnachweise

## Produktdaten pflegen

Die Beispielprodukte stehen in `scripts/sample-products.mjs` (Name, Kategorie, Preis,
Farben, Größen, Bilder, Texte). Nach Änderungen `npm run sample:products` ausführen;
das Skript erzeugt `src/data/products.json` mit allen Varianten (Farbe × Größe).

Kategorien und Kollektionen: `src/lib/catalog.ts`. Texte für FAQ/Vorteile: `src/lib/content.tsx`.

## Bilder und Lizenzen

Fotos liegen in `public/images/` und stammen von Wikimedia Commons (CC0, CC BY 3.0,
CC BY-SA 4.0). Urheber, Lizenz und Quelle stehen in `src/data/image-credits.json` und
werden im Shop unter „Bildnachweise“ angezeigt. Die Fotos sind Beispielmotive, nicht die
angebotenen Produkte. Produkte ohne Foto zeigen bewusst „Produktbild folgt“.

## Offene Punkte für spätere Phasen

- Rechtstexte (Impressum, Datenschutz, AGB, Widerruf) und Unternehmensdaten
- Echte Lieferanten, Produktdaten, Maßtabellen, Versand- und Rückgabebedingungen
- Echte Zahlungsabwicklung (z. B. über ein Shop-System)
- Markenrecherche für „Knuddelwuff“
