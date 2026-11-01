# 26 · Import von 5 Produkten als Entwurf (CEO-Auftrag vom 01.11.2026)

Stand: 01.11.2026 · Erstellt von Claude
Status: **Vorbereitet und getestet – Import in Shopify NICHT ausgeführt** (technische Blockade, siehe 26.5).

## 26.1 Lieferant und Lager
| Punkt | Angabe | Nachweis |
|---|---|---|
| Lieferant | Warmako B.V., Van Nelleweg 1 – Unit 3.11, 3044 BC Rotterdam, NL · KVK 27230977 · BTW NL801831775B01 | warmako.com/pages/contact (abgerufen 01.11.2026) ✔ |
| Lager | **ein** „centrale magazijn in Nederland“ | warmako.com/pages/about ✔ |
| Genaue Lageranschrift | ❓ nicht veröffentlicht | – |
| Versand | „Bestellingen worden op werkdagen binnen 48 uur door ons magazijn verwerkt“ | Kundenservice-Text auf warmako.com ✔ |
| Verfügbarkeit | je Variante aus der öffentlichen Produktdatei `/products/<handle>.js` (`available`) sowie „Op voorraad“ auf der Produktseite | abgerufen 01.11.2026 ✔ |

Begründung: Warmako nennt nur **ein** Zentrallager. Damit stammen alle verfügbaren Artikel aus demselben Lager in den Niederlanden.
CJ (Lager DE) schied aus, weil es dort keine passende Ware gibt (`23`, `24`).

## 26.2 Auswahl (alle Rukka, alle aus dem Zentrallager NL)
| # | Shopify-Titel | Warmako-Produkt-ID | Warmako-Art. (1. Variante) | Varianten importiert | nicht verfügbar → **nicht** importiert |
|---|---|---|---|---|---|
| 1 | Rukka Stormy Hundemantel mit Fleecefutter | 9595007566071 | 6038 | 9 (25–65) | – |
| 2 | Rukka Windy Thermal Softshell-Hundejacke, schwarz | 9595005829367 | 8141 | 8 | Maat 30 |
| 3 | Rukka Sock Shoes Hundeschuhe, rutschfest (4 Stück) | 9598676304119 | 8150 | 5 (Gr. 1, 2, 3, 5, 6) | Gr. 4, 7 |
| 4 | Rukka Protect Overall für Hunde, wasserdicht | 9598680531191 | 6988 | 3 (25, 30, 40) | 35, 45–65 |
| 5 | Rukka Comfy Knit Fleecejacke für Hunde | 9595008155895 | 6998 | 10 (Grün 30/35, Schwarz 25–60) | Grün 25, 40–65; Schwarz 65 |

**Abweichungen von der Wunschliste:**
- **Overall:** Der Protect Overall ist der einzige Overall bei Warmako. Er ist wind- und wasserdicht, ein Wärmefutter wird **nicht** angegeben. Das steht so im Text. Verfügbar sind nur 3 kleine Größen.
- **Schuhe:** Ich habe die Sock Shoes statt der Step Shoes genommen. Bei den Sock Shoes sind 5 von 7 Größen verfügbar, bei den Step Shoes nur 3 von 8.
- **Nicht genommen:** Scruffs Drying Coat. Hersteller aus Großbritannien, dafür bräuchte es eine verantwortliche Person in der EU (GPSR), und die ist unbekannt.
- **Sock Shoes:** Die Hinweise des Lieferanten auf „Verletzungen, Allergien, empfindliche Pfoten“ habe ich **nicht** übernommen (keine medizinischen Aussagen).

## 26.3 Shopify-Daten (Datei `import/produkte-warmako-rukka.json`)
- **Status:** DRAFT, im Code festgelegt. Das Skript ruft keine Veröffentlichung auf.
- **Vendor:** Rukka.
- **Typ:** Hundemantel / Hundejacke / Hundeschuhe / Overall.
- **Tags:**
  - Kategorie: `kategorie-maentel` (Nr. 1, 2, 5), `kategorie-pfotenschutz` (Nr. 3), `kategorie-overalls` (Nr. 4).
  - Für alle: `quelle-warmako`, `marke-rukka`, `lager-nl`, `ek-ungeprueft`, `import-entwurf`.
- **Kollektionen:** automatisch über die bestehenden Tag-Regeln.
  - `hundemaentel`: Nr. 1, 2, 5
  - `pfotenschutz`: Nr. 3
  - `winter-overalls`: Nr. 4
  - Ein Entwurf ist im Shop trotzdem nicht sichtbar.
- **Varianten:**
  - SKU = `WM-` + Warmako-Artikelnummer der Variante.
  - Barcode = EAN der Variante ✔.
  - Bestand wird in Shopify nicht verfolgt (`tracked:false`).
  - Gewicht nur dort, wo Warmako unterschiedliche Werte angibt (Windy, Sock Shoes). Beim Stormy gibt Warmako für alle Größen 250 g an, das wirkt wie ein Platzhalter und wurde nicht übernommen.
- **Preis = UVP (Warmako-„Adviesverkoopprijs“):**

  | # | Produkt | Preis |
  |---|---|---|
  | 1 | Stormy Hundemantel | 54,99 € |
  | 2 | Windy Thermal Jacke | 49,99 € |
  | 3 | Sock Shoes | 24,99 € |
  | 4 | Protect Overall | 64,90 € |
  | 5 | Comfy Knit Jacke | 34,90 € |

  Ein Vergleichspreis (durchgestrichener Preis) wird nicht gesetzt.
- **Einkaufspreis (cost per item):** **leer.** Er ist nicht verifiziert, weil er nur mit Händlerkonto sichtbar ist.
- **Metafelder (nur bekannte Daten):**

  | Metafeld | befüllt bei |
  |---|---|
  | `custom.material` | Nr. 2, 3, 4 |
  | `custom.pflege` | alle 5 |
  | `custom.groessentabelle` | Nr. 3 (Maße je Größe laut Lieferant) |
  | `custom.hersteller`, `custom.eu_verantwortlicher`, `custom.warnhinweise` | **leer**, keine verifizierte Angabe |

- **Bilder:** **nicht** übernommen, weil die Nutzungsrechte nicht geklärt sind. Die Quell-Links stehen in der JSON-Datei (`supplier.url`).
- **Texte:** sachlich aus den niederländischen Lieferantenangaben übersetzt. Keine Bewertungen, keine Lieferzeiten, keine Zertifikate. Der Hinweis „laut Lieferant“ steht dort, wo es um Materialeigenschaften geht.

## 26.4 Tests
- `python3 import/shopify_draft_import.py`: Probelauf mit Prüfungen auf DRAFT, doppelte Varianten, 13-stellige EAN, verbotene Begriffe und Metafeld-Schlüssel → **ok**.
- `python3 import/test_shopify_draft_import.py`: **5/5 Tests ok.** Geprüft werden: 5 Produkte, nur DRAFT, nur ein Lieferant, kein Doppelanlegen und Abbruch, wenn ein Status nicht DRAFT ist.
- ⚠️ **Nicht getestet:** der echte Aufruf gegen die Shopify-API (`productSet`, API-Version 2026-10). Das wird erst beim ersten Lauf mit Zugangsdaten sichtbar. Fehler beim Anlegen lassen das Skript abbrechen.

## 26.5 Blockade
- In dieser Sitzung sind **keine Shopify-Zugangsdaten** vorhanden. Bisher kamen Client-ID und Secret der App „Claude Einrichtung“ über den Chat.
- **Weg A (empfohlen):**
  1. Secret in den App-Einstellungen neu erzeugen (das alte liegt im Chatverlauf).
  2. `SHOPIFY_SHOP`, `SHOPIFY_CLIENT_ID` und `SHOPIFY_CLIENT_SECRET` als Umgebungsvariablen der Cloud-Umgebung hinterlegen.
  3. Claude führt `python3 vorbereitung/import/shopify_draft_import.py --apply` aus und liest danach jeden Status gegen.
- **Weg B (ohne Claude):**
  1. Im Shopify-Admin unter Produkte → Importieren die Datei `import/shopify-import-entwurf.csv` hochladen.
  2. Die Datei enthält `Status = draft` und `Published = FALSE`.
  3. ⚠️ Das CSV-Format habe ich nicht gegen einen echten Shopify-Import getestet. Die Vorschau vor dem Import bitte genau prüfen.

## 26.6 Nicht verifiziert
- Einkaufspreise und Marge
- Kosten und Zustellzeit beim Dropshipping (Droppery)
- Genaue Anschrift des Lagers
- Größentabellen für Nr. 1, 2, 4 und 5 (Warmako verweist auf eine „maattabel“, die ich nicht gefunden habe)
- Herstelleranschrift für die GPSR-Angaben
- Bildrechte
- Ob Warmako an Knuddelwuff liefert: Voraussetzungen sind Gewerbe, USt-IdNr. und ein aktiver Webshop
