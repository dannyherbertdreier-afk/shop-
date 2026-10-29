# 11 · Startseite, Navigation und Kategorien (Shopify)

Stand: 29.10.2026 · Arbeitsname **Knuddelwuff** (rechtlich **nicht** freigegeben, Ähnlichkeit zu
„Knuffelwuff“ ist ein offenes Risiko) · ergänzt `01-design-paket.md` (Farben, Schriften, Texte).

**Grundregeln für alle Texte:** keine erfundenen Bewertungen, Kunden, Verkaufszahlen, Zertifikate
oder Lieferzeiten. Platzhalter in `[eckigen Klammern]` erst füllen, wenn die Angabe belegt ist.

---

## 11.1 Kategorien (in Shopify: „Kollektionen“)

Wenige, klar getrennte Kategorien. Ein Produkt darf in mehreren Kollektionen sein.

| Kollektion | URL-Handle | Inhalt | Art der Kollektion | Start |
|---|---|---|---|---|
| Alle Produkte | `alle-produkte` | alles | automatisch (alle aktiven Produkte) | JETZT anlegen |
| Hundemäntel | `hundemaentel` | Mäntel, Westen, Regenmäntel | automatisch über Produkt-Tag `kategorie-maentel` | JETZT anlegen, leer lassen |
| Pfotenschutz | `pfotenschutz` | Schuhe, Socken | Tag `kategorie-pfotenschutz` | JETZT anlegen, leer lassen |
| Winter-Overalls | `winter-overalls` | Overalls | Tag `kategorie-overalls` | JETZT anlegen, leer lassen |
| Zubehör | `winterzubehoer` | Leuchtanhänger, Halstücher, Decken | Tag `kategorie-zubehoer` | JETZT anlegen, leer lassen |
| Eigene Designs | `eigene-designs` | Print-on-Demand-Produkte mit eigenen Motiven | Tag `quelle-pod` | SPÄTER (erst mit Produkten) |

**Warum über Tags:** Neue Produkte landen automatisch in der richtigen Kollektion. Das spart
Handarbeit und Fehler beim späteren Import aus Printify und CJdropshipping.

**Weitere Tags für jedes Produkt** (nur intern, für Filter und Auswertung):
- `quelle-printify` oder `quelle-cj`
- `groesse-xs` … `groesse-xl` nur falls kein Varianten-Filter genutzt wird
- `saison-winter`

Leere Kollektionen bitte **nicht** in der Navigation zeigen. Erst einblenden, wenn Produkte drin sind.

---

## 11.2 Navigation

### Hauptmenü (Header) – handy-tauglich, maximal 5 Punkte
1. Hundemäntel
2. Pfotenschutz
3. Overalls
4. Zubehör
5. Größe finden

### Footer-Menü 1 „Hilfe“
- Größe & häufige Fragen
- Versand & Lieferung
- Widerruf & Rückgabe
- Kontakt

### Footer-Menü 2 „Rechtliches“ (Pflicht, Inhalte siehe `13-recht-checkliste.md`)
- Impressum
- Datenschutzerklärung
- AGB
- Widerrufsbelehrung
- Versand- und Zahlungsbedingungen

### Footer-Menü 3 „Über Knuddelwuff“
- Über uns

---

## 11.3 Seiten (in Shopify: „Seiten“ bzw. „Richtlinien“)

| Seite | Wo in Shopify | Status |
|---|---|---|
| Größe & häufige Fragen | Seite | Text in `01-design-paket.md` Abschnitt 1.6 vorhanden; Lieferzeit/Rückgabe noch offen |
| Über uns | Seite | Text in `01-design-paket.md` Abschnitt ⑤ |
| Kontakt | Seite mit Kontaktformular | Kontaktdaten: **CEO muss liefern** |
| Versand & Lieferung | Richtlinie bzw. Seite | erst nach Lieferanten-Klärung |
| Impressum, Datenschutz, AGB, Widerruf | Richtlinien | von Rechtstexte-Dienst bzw. Anwalt, **nicht** selbst schreiben |

---

## 11.4 Startseite – Aufbau nach Kaufentscheidung

Reihenfolge so, wie ein Besucher denkt: *Bin ich hier richtig? → Habe ich das Problem? → Was gibt
es? → Kann ich vertrauen? → Offene Fragen? → Kaufen.*

| # | Abschnitt (Theme-Baustein) | Inhalt | Zweck | Wann |
|---|---|---|---|---|
| 0 | Ankündigungsleiste | nur **belegte** Fakten, z. B. Versandkosten, sobald festgelegt | Kosten früh klären, damit es an der Kasse keine Überraschung gibt | SPÄTER |
| 1 | Hero (Bild-Banner) | **„Gut geschützt durch den Winter.“** + Text + Button „Winterkollektion entdecken“ | in 3 Sekunden klar machen, worum es geht | JETZT |
| 2 | Hauptnutzen (Icons mit Text, 3–4 Spalten) | siehe Texte 11.5 A | Nutzen statt Merkmale | JETZT |
| 3 | Winterproblem (Bild mit Text) | siehe Texte 11.5 B | Besucher erkennt seine Situation wieder | JETZT |
| 4 | Kategorien (Kollektionsliste) | 4 Kollektionen mit Bild | schnell zum passenden Produkt | JETZT, sobald Bilder da sind |
| 5 | Empfohlene Produkte | 4 echte Produkte | Einstieg in den Kauf | **erst mit echten Produkten** |
| 6 | Vertrauen (Icons/Text) | siehe Texte 11.5 C – nur belegte Aussagen | Unsicherheit vor dem ersten Kauf senken | JETZT als Gerüst, Inhalte nach Klärung |
| 7 | FAQ (Akkordeon) | 4–6 Fragen aus `01-design-paket.md` 1.6 | Einwände vor dem Kauf beantworten | JETZT |
| 8 | Abschluss-Handlungsaufforderung | siehe Texte 11.5 D | zweite Chance zum Klick | JETZT |
| 9 | Footer | Menüs 11.2, Zahlungsarten-Symbole (automatisch vom Theme) | Pflichtlinks, Vertrauen | JETZT |

**Bewusst weggelassen:** Newsletter-Pop-up, Countdown, „Nur noch 3 Stück“, Bewertungs-Slider
ohne echte Bewertungen, Video-Hero (Ladezeit auf dem Handy).

---

## 11.5 Texte zum Einfügen

### A · Hauptnutzen (Überschrift: „Gemacht für kalte Spaziergänge“)
| Titel | Text |
|---|---|
| Für Kälte und Nässe | Mäntel, Overalls und Pfotenschutz für Schnee, Regen und Streusalz. |
| Die richtige Größe | Messanleitung für Rückenlänge, Brust- und Halsumfang auf jeder Produktseite. |
| Wenige, ausgewählte Produkte | Wir nehmen nur Produkte auf, die wir vorher selbst geprüft haben. |

⚠️ Satz 3 nur verwenden, wenn wirklich jedes Produkt vorher als Muster geprüft wurde
(siehe `02-produkt-pruefliste.md`). Sonst weglassen.

### B · Winterproblem (Überschrift: „Kalte Pfoten, nasses Fell?“)
> Streusalz, Matsch und eisiger Wind machen den Winterspaziergang für viele Hunde ungemütlich –
> besonders für kleine, kurzhaarige oder ältere Hunde. Mit dem passenden Mantel und Pfotenschutz
> bleibt die Runde für euch beide entspannt.

⚠️ „besonders für kleine, kurzhaarige oder ältere Hunde“ ist eine allgemeine Aussage. Vor dem
Start von einem Tierarzt oder einer seriösen Quelle bestätigen lassen oder streichen.

### C · Vertrauen (nur Punkte nutzen, die stimmen)
| Baustein | Text | Bedingung |
|---|---|---|
| Sicher bezahlen | Bezahlung über [Zahlungsanbieter] | erst nach Einrichtung |
| Versand | Versand nach Deutschland: [Kosten], Lieferzeit [x–y] Werktage | erst nach Lieferanten-Test |
| Widerruf | 14 Tage Widerrufsrecht | gesetzlich; genaue Formulierung aus der Widerrufsbelehrung |
| Kontakt | Fragen? [E-Mail] – wir antworten werktags | Reaktionszeit nur angeben, wenn sie eingehalten werden kann |

### D · Abschluss
- **Überschrift:** Bereit für den nächsten Winterspaziergang?
- **Button:** Jetzt Winterkollektion ansehen

---

## 11.6 Produktseite – Aufbau

1. Bilder (Hochformat 4:5, erstes Bild freigestellt, weitere am Hund)
2. Titel + Preis inkl. MwSt. + Hinweis „zzgl. Versand“ (Theme-Einstellung, siehe `09`)
3. Größenauswahl als Buttons, darunter Link „Größe finden“
4. Button „In den Warenkorb“ (gut sichtbar, auf dem Handy ohne Scrollen erreichbar)
5. Kurz-Info-Zeilen: Versand, Rückgabe, Kontakt (nur belegte Werte)
6. Beschreibung nach Vorlage `01-design-paket.md` 1.5
7. Pflichtangaben GPSR (Hersteller/Verantwortlicher, Produktkennung, Warnhinweise)
8. Ergänzende Produkte (automatisch über Shopify Search & Discovery, siehe `10-app-strategie.md`)

---

## 11.7 Warenkorb

- **Warenkorb-Schublade** (Drawer) statt eigener Seite: Kunde bleibt auf der Produktseite.
- Anzeigen: Zwischensumme, Hinweis „Versand wird an der Kasse berechnet“ bzw. feste Versandkosten.
- **Kein** Pflicht-Upsell-Pop-up.
- Optional später: Hinweis „Noch [x] € bis zum kostenlosen Versand“ – **nur** wenn es diese Schwelle
  wirklich gibt und sie wirtschaftlich durchgerechnet ist (`gewinnrechner.xlsx`).
