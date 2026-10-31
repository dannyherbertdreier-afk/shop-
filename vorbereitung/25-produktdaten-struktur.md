# 25 · Produktdaten-Struktur und Entwurf für die Produktseite

Stand: 31.10.2026 · Erstellt von Claude · **Nur Entwurf im Repository, nichts im Shop geändert.**

## 25.1 Zweck
Für die Kandidaten aus `24` (vor allem Rukka über Warmako) wird festgelegt, welche Daten pro Produkt
nötig sind und wo sie in Shopify landen. So kann nach der CEO-Freigabe ohne Nacharbeit übernommen werden.

## 25.2 Felder pro Produkt

| Shopify-Feld | Inhalt | Quelle | Pflicht vor Freischaltung |
|---|---|---|---|
| Titel | „Rukka Stormy Hundemantel, gefüttert“ (Muster) | eigener Text | ja |
| Beschreibung | eigener Text nach Vorlage `01`; **keine** Lieferantentexte, keine unbelegten Versprechen | eigener Text | ja |
| Hersteller (`vendor`) | Markenname, z. B. Rukka | Lieferant | ja |
| Produkttyp | `Hundemantel` / `Hundeschuhe` / `Overall` / `Zubehör` | eigene Liste | ja |
| Tags | `kategorie-maentel` bzw. `kategorie-pfotenschutz`, `kategorie-overalls`, `kategorie-zubehoer`; `quelle-warmako` (neu, analog zu `quelle-cj`) | `11.1` | ja |
| Variante: Option 1 | `Größe` (z. B. „25“ … „65“) | Lieferant | ja |
| Variante: Option 2 | `Farbe` (nur wenn mehrere) | Lieferant | – |
| Variante: SKU | Lieferanten-Artikelnummer + Größe, z. B. `WM-6038-40` | Lieferant | ja |
| Variante: Barcode | EAN/GTIN, z. B. 6413910758055 (siehe Hinweis unten) | Lieferant | ja (für Google Shopping) |
| Variante: Preis | Verkaufspreis brutto (Startwert = UVP) | CEO-Entscheidung | ja |
| Variante: Einkaufspreis (`cost per item`) | EK netto laut Händlerkonto | Händlerkonto | ja (für Margenbericht) |
| Gewicht | laut Lieferant | Lieferant | ja (Versand) |
| `custom.material` | Materialzusammensetzung | Lieferant/Etikett | ja |
| `custom.pflege` | Pflegehinweise | Lieferant/Etikett | ja |
| `custom.groessentabelle` | Größe → Rückenlänge/Brust/Hals in cm | **Hersteller** (nicht raten) | ja |
| `custom.warnhinweise` | Sicherheits-/Gebrauchshinweise (z. B. „kein Grip auf Eis“ bei Step Shoes) | Hersteller | ja |
| `custom.hersteller` | Name, Postanschrift, E-Mail/Website (GPSR) | Hersteller | ja |
| `custom.eu_verantwortlicher` | nur nötig, wenn der Hersteller nicht in der EU sitzt; bei Rukka (Finnland) vermutlich „entfällt“ ❓ | Hersteller/Berater | ja |

**Hinweis EAN:** Ob die Lieferanten-EAN je Größe verschieden ist, ist **nicht verifiziert**. Warmako zeigt
pro Produkt eine EAN. Die EAN je Variante steht erst im Händlerkonto bzw. im Datenfeed.

## 25.3 Neue Tags (Vorschlag)
- `quelle-warmako`, `quelle-bigbuy`, `quelle-hurtta` – analog zu `quelle-cj` / `quelle-printify` (`12.3`).
- Die Kollektionen (Smart, Tag-Regeln `kategorie-*`) bleiben unverändert. Neue Quell-Tags beeinflussen sie nicht.

## 25.4 Entwurf Produktseiten-Vorlage
Datei: `shopify-entwurf/templates_product_mit_metafeldern.json`
(Basis: `shopify-theme-sicherung/geaendert-30-10-2026/templates_product.json`).

- Unter der Produktbeschreibung kommen 6 Textblöcke hinzu: Material, Pflegehinweise, Größentabelle,
  Sicherheits- und Warnhinweise, Hersteller und Verantwortliche Person in der EU.
- Jeder Block zeigt `{{ closest.product.metafields.custom.<feld>.value }}` (gleiche Schreibweise wie die
  vorhandenen Blöcke `{{ closest.product.title }}`).
- ⚠️ **Nicht im Shop getestet.** Ob das Theme „Whisper“ mehrzeilige Metafelder in diesem Textblock korrekt
  ausgibt, ist nicht verifiziert.
- ⚠️ Die Überschrift erscheint auch bei leerem Feld. Vor der Freischaltung müssen also alle Felder befüllt sein.
  Das ist bei Pflichtangaben ohnehin nötig.
- Einspielen erst mit CEO-Freigabe. Vorher Sicherung des aktuellen `templates/product.json` ziehen.
  Rückweg: Datei aus `shopify-theme-sicherung/geaendert-30-10-2026/` zurückspielen.

## 25.5 Beispiel (nur Daten, kein Import): Rukka Stormy Coat
| Feld | Wert | Status |
|---|---|---|
| vendor | Rukka | ✔ |
| Größen | 25, 30, 35, 40, 45, 50, 55, 60, 65 | ✔ (Bedeutung ❓) |
| SKU-Muster | WM-6038-25 … WM-6038-65 | Vorschlag |
| Barcode | 6413910758055 | ✔ (je Größe ❓) |
| Preis | 54,99 € (UVP) | Vorschlag, CEO entscheidet |
| Einkaufspreis | – | ❓ Händler-Login |
| Material/Pflege | – | ❓ Etikett/Datenblatt fehlt |
| Größentabelle | – | ❓ Hersteller |
| Hersteller | Luhta Sportswear Company, Finnland (Adresse ❓) | teilweise |
| Tags | `kategorie-maentel`, `quelle-warmako` | Vorschlag |
