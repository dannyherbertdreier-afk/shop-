# Uhren-Shop – Demo-Nachbau (Referenz: poedagarparis.com)

Klickbare E-Commerce-Webanwendung, nachgebaut nach dem Shop
`https://poedagarparis.com/en-de` (Stand der Daten: 27.10.2026).

> **Demo-Shop.** Es werden keine echten Bestellungen, Zahlungen, E-Mails oder
> Lieferungen ausgelöst. Bestellungen, Warenkorb und Newsletter-Eintrag werden
> nur im `localStorage` des jeweiligen Browsers gespeichert.

## Starten

Voraussetzung: Node.js 18+ (getestet mit Node 22).

```bash
npm install
npm run dev        # Entwicklungsserver, http://localhost:5173
npm run build      # Produktions-Build nach dist/
npm run preview    # Build ausliefern, http://localhost:4173
npm test           # Unit-Tests (Preislogik, Suche/Filter, Validierung)
npm run test:e2e   # Browser-Test (benötigt laufendes `npm run preview` und Playwright)
```

## Auf dem iPhone testen

**Variante A – im selben WLAN (am einfachsten):**

1. Auf dem Computer im Projektordner `npm install` und dann `npm run dev` ausführen.
2. Vite zeigt neben `Local:` auch eine Zeile `Network: http://192.168.x.x:5173/` an.
3. iPhone ins selbe WLAN, diese `Network`-Adresse in Safari öffnen.
4. Optional: Teilen → „Zum Home-Bildschirm“ für ein App-ähnliches Icon.

Falls die Seite nicht lädt: Firewall des Computers für Port 5173 erlauben.

**Variante B – öffentlich hosten:** `npm run build` erzeugt einen statischen
Ordner `dist/`, der auf jedem Static-Host (z. B. GitHub Pages, Netlify)
läuft (relative Pfade + Hash-Routing). Bitte vorher die Hinweise zu Marken- und
Bildrechten unten beachten.

## Funktionen

- Startseite nach Referenz: Laufband, transparenter Header über dem Hero,
  „Our Customers' Favorite Watches“-Karussell, Markengeschichte, Zusagen-Kacheln,
  Featured Product, FAQ-Akkordeon, Newsletter, Footer mit Menüs
- Navigation Desktop + mobiles Seitenmenü, Kollektionen „2026 Collection“ (alle 33
  Produkte) und „Best Sellers“ (14 Produkte aus dem Startseiten-Karussell)
- Filter (Verfügbarkeit, Farbe, Maximalpreis), Sortierung (7 Optionen),
  1/2-Spalten-Umschalter mobil; Zustand steckt in der URL
- Suche: Live-Overlay im Header + Ergebnisseite mit Filtern
- Produktseite: Galerie (Wischen, Pfeile, Thumbnails), Varianten als
  Bild-Swatches, ausverkaufte Varianten gesperrt, Angebots-Bundles wie im
  Original („Buy 1, Get 1 Free“, „Buy 2, Get 2 Free“, „Mix & Match“ mit Menge)
- „Buy 1, Get 1 Free“-Aktion im Warenkorb: alle Einheiten nach Preis sortiert,
  jede zweite (günstigere) gratis – identische Logik auf Produktseite und im Warenkorb
- Warenkorb (Drawer + Seite): Menge ändern, entfernen, leeren, persistent über Reload
- Demo-Checkout mit Validierung (E-Mail, Pflichtfelder, PLZ je Land),
  Bestellbestätigung, „Track my order“, „My orders“
- Kontaktformular mit Validierung, FAQ/About/Returns-Seiten, Policy-Platzhalter, 404

## Datenpflege

Produktdaten liegen in `src/data/products.json` und wurden aus dem öffentlichen
Shopify-Endpunkt `/products.json` des Referenzshops erzeugt:

```bash
curl -L "https://poedagarparis.com/en-de/products.json?limit=250" -o scripts/source/products.json
npm run import:products
```

Das Skript bereinigt die Beschreibungs-HTML (nur einfache Tags) und setzt die
Best-Seller-Reihenfolge. Bilder werden direkt vom Shopify-CDN des Originals geladen.

## Aufbau

- `src/lib/` – Katalog/Filter/Suche, Preislogik, Validierung, Texte
- `src/state/ShopContext.tsx` – Warenkorb, Bestellungen, UI-Zustand
- `src/components/`, `src/pages/` – UI
- `tests/` – Unit-Tests (Vitest) und Browser-Test (Playwright)

## Bewusst nicht übernommen / Einschränkungen

- **Marken- und Bildrechte:** Name, Produktfotos und Texte gehören dem
  Referenzshop. Für eine öffentliche oder kommerzielle Nutzung braucht es
  eigene Rechte bzw. eigene Inhalte. Das Logo ist als Schrift nachgestellt,
  nicht als Originaldatei kopiert.
- Keine echte Zahlungsanbindung, kein Kundenkonto, kein Versand.
- Countdown-Timer („offer expires in …“), Klarna-Ratenhinweis und
  Bewertungszahlen (z. B. „4.8/5 · 2,841“, „13,618+ customers“) wurden **nicht**
  übernommen, da sie im Nachbau nicht belegbar bzw. nicht funktional wären.
- Rechtstexte (Datenschutz, AGB, Impressum …) sind Platzhalter.
- Blog und Währungs-/Sprachumschalter des Originals fehlen (Anzeige fest EUR/EN).
- Farbfilter-Gruppen sind aus Variantennamen abgeleitet (z. B. „Black Gold“ → Black + Gold).
