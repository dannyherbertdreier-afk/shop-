# 1 · Design-Paket für Shopify

Stand: 29.10.2026 · Markenname noch offen → überall **[MARKENNAME]** ersetzen, sobald er feststeht.

Ziel: Den Look des bisherigen Prototyps (Waldgrün, Creme, ruhig und hochwertig) in einem
**kostenlosen Shopify-Theme** nachbauen – nur über die Theme-Einstellungen, ohne eigenen Code.

---

## 1.1 Theme-Wahl

| Option | Einschätzung |
|---|---|
| **Horizon** (kostenlos) | Laut mehreren Quellen das aktuelle Standard-Theme für neue Shops, flexibel aufgebaute Abschnitte. **Empfehlung für den Start.** |
| **Dawn** (kostenlos) | Älter, weiterhin gepflegt, laut Quellen sehr schnell. Gute Alternative, falls Horizon zu komplex wirkt. |

Beide im Shopify-Admin unter **Onlineshop → Themes** prüfen. Welche Themes angeboten werden,
kann sich ändern.

---

## 1.2 Farben

| Rolle | Farbe | Hex | Einsatz |
|---|---|---|---|
| Primär | Waldgrün | `#183D32` | Buttons, Überschriften, Kopfzeilen-Leiste, Footer-Newsletter |
| Hintergrund | Warmes Cremeweiß | `#F8F6F0` | Seitenhintergrund |
| Fläche | Helles Salbeigrün | `#DCE7DC` | Kacheln, Platzhalter, Hinweise |
| Text | Dunkles Anthrazit | `#242824` | Fließtext, Footer-Hintergrund |
| Akzent | Dezentes Orange | `#D9824B` | Hauptbutton im Startbild, Zähler im Warenkorb |
| Akzent-Text | Dunkles Orange | `#8A4A1F` | kleine Akzent-Texte auf hellem Grund |
| Ränder Formularfelder | Graugrün | `#878377` | Eingabefelder, Größen-Buttons |

**Kontraste** (im Prototyp gemessen, WCAG):
- Weiß auf Waldgrün 11,98 : 1
- Waldgrün auf Creme 11,09 : 1
- Dunkler Text auf Orange 5,95 : 1
- Formularränder `#878377` auf Weiß 3,79 : 1

**Nicht verwenden:** Orange `#D9824B` als Schrift auf hellem Grund (nur 2,68 : 1, zu schwach).

**So in Shopify (Horizon/Dawn):** Theme bearbeiten → Theme-Einstellungen → **Farben / Farbschemata**.
Vorschlag für 3 Schemata:

| Schema | Hintergrund | Text | Button | Button-Text |
|---|---|---|---|---|
| Standard (hell) | `#F8F6F0` | `#242824` | `#183D32` | `#FFFFFF` |
| Dunkel | `#183D32` | `#FFFFFF` | `#D9824B` | `#1F1A16` |
| Akzent-Fläche | `#DCE7DC` | `#242824` | `#183D32` | `#FFFFFF` |

---

## 1.3 Schriften

| Rolle | Wunsch | Ausweichschrift, falls nicht im Shopify-Schriftmenü |
|---|---|---|
| Überschriften | **Manrope**, fett (700–800) | eine moderne, geometrische Sans-Serif aus dem Menü, z. B. „Montserrat“ oder „Outfit“, falls angeboten |
| Fließtext | **Inter**, normal (400) | eine gut lesbare Sans-Serif, z. B. „Assistant“ oder „Work Sans“, falls angeboten |

⚠️ **Nicht geprüft:** Ob Manrope und Inter in der Shopify-Schriftbibliothek enthalten sind, konnte ich
nicht bestätigen. Im Theme-Editor unter **Theme-Einstellungen → Typografie** nachsehen.

Vorteil der Shopify-Schriftbibliothek: Die Schriften werden über Shopify ausgeliefert. Das sollte
das Datenschutz-Thema „Schriften direkt von Google laden“ aus dem Prototyp entschärfen.
Mit dem Datenschutztext abgleichen.

**Größen und Abstände:**
- Überschriften kräftig, Fließtext normal
- Ecken leicht abgerundet (Buttons und Karten ca. 10–14 px, falls einstellbar)
- Viel Weißraum
- Produktbilder im Hochformat 4:5

---

## 1.4 Startseite – Abschnitte und Texte

Reihenfolge wie im Prototyp. In Klammern: typischer Abschnittsname im Theme (kann je nach Theme
abweichen).

### ① Startbild (Bild-Banner / Hero)
- **Kleine Überzeile:** Winterkollektion
- **Überschrift:** Gut geschützt durch den Winter.
  *(Festgelegt durch den CEO am 29.10.2026. Bekannter Hinweis aus der Textprüfung: „geschützt“
  kann als Schutzversprechen gelesen werden – bei der rechtlichen Prüfung der Shop-Texte mit ansehen.)*
- **Text:** Entdecke durchdachte Winterbegleiter für deinen Hund – für kalte Spaziergänge, nasse
  Wege und frostige Tage.
- **Button 1:** Winterkollektion entdecken → Kollektion „Alle Produkte“
- **Button 2:** Größe finden → Seite „Größe & häufige Fragen“
- **Bild:** eigenes Foto oder Lieferanten-Foto mit Nutzungsrecht. Keine fremden Logos sichtbar.

### ② Vorteile (Mehrspaltig / Icons mit Text)
| Titel | Text |
|---|---|
| Für kalte und nasse Tage | Mäntel, Overalls und Pfotenschutz für Schnee, Regen und Streusalz. |
| Komfort unterwegs | Bei der Auswahl sollen Bewegungsfreiheit und Passform im Mittelpunkt stehen. |
| Praktisch für jeden Spaziergang | Durchdachte Begleiter – vom Leuchtanhänger bis zum Trockenmantel. |
| Die passende Größe finden | Messtipps für Rückenlänge, Brust- und Halsumfang. |

### ③ Kategorien (Kollektionsliste)
| Kollektion | Kurzbeschreibung |
|---|---|
| Hundemäntel | Mäntel und Westen für kalte, nasse und windige Tage. |
| Pfotenschutz | Schuhe, Socken und Pflege – für Wege mit Schnee und Streusalz und für drinnen danach. |
| Winter-Overalls | Overalls, die auch die Beine bedecken. |
| Winterzubehör | Pullover, Leuchtanhänger, Leine und Trockenmantel – für unterwegs und danach. |
| Eigene Designs *(neu, für Print on Demand)* | Hoodies, Halstücher und mehr mit [MARKENNAME]-Motiven. |

### ④ Produktauswahl (Ausgewählte Kollektion)
- **Überschrift:** Ausgewählt für kalte Tage
- **Inhalt:** 4 Produkte mit echten Fotos

### ⑤ Über uns (Bild mit Text)
- **Überzeile:** Über [MARKENNAME]
- **Überschrift:** Für Hunde, die auch im Winter rauswollen.
- **Text:** [MARKENNAME] ist für Hundebesitzer, die bei Kälte, Regen und Schnee nicht auf
  gemeinsame Spaziergänge verzichten möchten. Unser Ziel: wenige, durchdachte Produkte, die du
  leicht findest und in der richtigen Größe bestellst.
- **Button:** Mehr über uns

### ⑥ Häufige Fragen (Akkordeon / Sammelbare Inhalte)
Texte siehe Abschnitt 1.6.

### ⑦ Newsletter
- **Überschrift:** Bereit für den Winter?
- **Text:** Trag dich ein und erfahre als Erste/r von neuen Produkten.
- ⚠️ Für einen echten Newsletter braucht es eine Einwilligung mit Bestätigungsmail
  (Double-Opt-in) und einen Datenschutzhinweis. Vor dem Start klären.

---

## 1.5 Vorlage für Produktbeschreibungen

```
[Kurzsatz: wofür das Produkt gedacht ist – ohne Versprechen wie „wasserdicht“, solange nicht vom Lieferanten belegt]

Eigenschaften
• [Merkmal laut Lieferant]
• [Verschluss / Passform laut Lieferant]

Material: [laut Lieferant – Pflichtangabe bei Textilien prüfen]
Pflege: [laut Lieferant]
Größen: [Größentabelle mit Rückenlänge, Brust- und Halsumfang in cm]

Hersteller/Verantwortlicher: [Name, Anschrift, E-Mail – Pflicht nach GPSR]
Sicherheitshinweise: [falls vorhanden]
```

**Regel:** Nur Eigenschaften nennen, die der Lieferant schriftlich angibt. Keine Begriffe wie
„wasserdicht“, „warm bis -20 °C“, „Testsieger“, „Bestseller“ ohne Beleg.

---

## 1.6 Texte für „Größe & häufige Fragen“

**Wie finde ich die richtige Größe?**
Miss deinen Hund im Stehen mit einem weichen Maßband:
- **Rückenlänge:** vom Halsansatz bis zum Rutenansatz
- **Brustumfang:** an der breitesten Stelle hinter den Vorderbeinen
- **Halsumfang:** dort, wo normalerweise das Halsband sitzt

Vergleiche die Werte mit der Größentabelle auf der Produktseite. Liegt dein Hund zwischen zwei
Größen, wähle meist die größere.

**Wie lange dauert die Lieferung?**
*[Erst ausfüllen, wenn Lieferanten und Versand feststehen.]*

**Kann ich Produkte zurückgeben?**
*[Erst ausfüllen, wenn die Widerrufsbelehrung und die Rückgaberegeln rechtlich geprüft sind.]*

**Wie erreiche ich euch?**
*[Kontaktwege eintragen, sobald die Firmendaten feststehen.]*

---

## 1.7 Vor der Freischaltung des Shops (Passwortschutz bleibt bis dahin an)

- [ ] Platzhalter **[MARKENNAME]** überall ersetzt
- [ ] Alle Produktbilder mit geklärtem Nutzungsrecht, keine fremden Logos
- [ ] Rechtstexte eingebunden (siehe `05-firmendaten-checkliste.md`)
- [ ] Testbestellung mit echter Zahlung und Rücksendung durchgespielt
