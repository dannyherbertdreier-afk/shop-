# Knuddelwuff – CJ-Produktrecherche Phase 1: CEO-Bericht und Entwickler-Protokoll

Stand: 30.10.2026 (Recherche) / 31.10.2026 (Bericht) · Erstellt von Claude (Claude Code) · Keine Rechtsberatung.
Kennzeichnung: ✔ geprüft · ⚠️ offen/Risiko · ❓ unbestätigt

Grundlage: Arbeitsschritt 1.4 aus `22-uebergabe-gesamt.md`.
Ausgeführt wurde nur Lesezugriff: **keine Importe, keine Bestellungen, nichts veröffentlicht, keine Änderungen am Shop.**

---

# TEIL 1 – CEO-BERICHT

## Kurz gesagt
- Der Zugang zu CJ über den API-Schlüssel funktioniert ✔.
- **„dog winter coat“ (Lager DE/EU):** genau **1** passendes Produkt. Es ist ein **Regenmantel**, kein gefütterter Wintermantel.
- **„dog boots“ (Lager DE/EU):** **0** passende Produkte.
- Empfehlung: Der Regenmantel eignet sich höchstens als Zusatzartikel, **nicht** als Hauptprodukt für den Winterstart.
  Für Mäntel und Pfotenschutz braucht es eine andere Lösung (siehe „Entscheidungen“).

## Ergebnis „dog winter coat“ – Dog Raincoat (grün)
- 🔗 [CJ-Produktseite (PID 2109548450556198913)](https://cjdropshipping.com/product/-p-2109548450556198913.html)
  ⚠️ Aufbau der Adresse wie bei CJ üblich; Seite selbst nicht aufrufbar (Bot-Schutz von CJ).
- 🔗 [Produktbild](https://cf.cjdropshipping.com/17917632/47ee0532-0d5f-4b70-9922-b93907d3ec2d.jpg)

| Kriterium | Wert | Einordnung |
|---|---|---|
| Artikelnummer | CJFU3247916, nur 1 Variante (Green) | ✔ |
| Einkaufspreis | 23,68 USD ≈ **21,20 €** (EZB-Kurs 30.10.2026: 1 € = 1,1172 USD) | ✔ Preis; ❓ Währung USD ist Annahme (CJ nennt sie in der Antwort nicht) |
| Versand DE → DE | GLS, Hermes, Hellmann je **0,00** | ❓ unüblich, vermutlich im Preis enthalten → in CJ-Oberfläche bestätigen |
| Lieferzeit | „3-5“ | ❓ Einheit (vermutlich Tage) und Bearbeitungszeit fehlen → **nicht** als Shop-Lieferzeit verwenden |
| Lagerbestand | **200 Stück, Lager Deutschland** | ✔ |
| Größe | nur 1 Größe: Hunde 15–20 kg, Halsumfang < 54 cm | ✔ laut Beschreibung |
| Material | PU/Kunstleder, Futter 50D-Mesh | ✔ laut Beschreibung |

### Marge (Einkauf 21,20 €, Versand 0 €; **ohne** Zahlungsgebühren, Werbung, Retouren)
| Verkaufspreis brutto | netto (19 % USt.) | Rohertrag | Marge | Rohertrag ohne USt. (Kleinunternehmer) |
|---|---|---|---|---|
| 39,95 € | 33,57 € | 12,37 € | 37 % | 18,75 € |
| 49,95 € | 41,97 € | 20,77 € | 49 % | 28,75 € |

CJs Preisvorschlag 80,52 (vermutlich USD) ist **kein** geprüfter Marktpreis.

### Was gegen das Produkt spricht
- Regenmantel ohne Fütterung → passt nur bedingt zu „Gut geschützt durch den Winter.“
- Nur eine Größe → hohes Retourenrisiko; Größentabelle kaum sinnvoll.
- Lieferantentext enthält Platzhalter „[BRAND NAME]“ → Text muss komplett neu geschrieben werden.
- Zoll-Code/Kategorie bei CJ: „furniture“ (Möbel) → Daten des Lieferanten schlecht gepflegt.
- Neu gelistet (12.10.2026), Lieferant „fulian“ versendet selbst; keine Erfahrungswerte.
- Hersteller und EU-Verantwortlicher (GPSR) fehlen in den CJ-Daten ⚠️.

## Ergebnis „dog boots“
- In keinem EU-Lager (DE, FR, IT, ES, PL, CZ, NL, BE, HU) ein Hundeschuh oder Pfotenschutz.
- Gegenproben „dog shoes“, „pet shoes“, „dog paw protector“: ebenfalls 0.
- ❓ Nicht ausgeschlossen: Angebote, die nur in der CJ-Oberfläche erscheinen, nicht über die API.

## Hinweis Großbritannien
Im Lager GB gibt es Hunderte Hundeprodukte. GB ist **nicht EU** → Zoll und Einfuhrumsatzsteuer; laut Vorgabe ausgeschlossen.

## Entscheidungen für den CEO
| # | Frage | Optionen |
|---|---|---|
| 1 | Regenmantel weiter prüfen? | Ja: in CJ-Oberfläche Versandpreis bestätigen, ggf. Testkauf (kostet Geld → nur mit Freigabe) · Nein: verwerfen |
| 2 | Wie kommen wir an Wintermäntel/Pfotenschutz? | a) Lager außerhalb EU (z. B. China) zulassen – mehr Auswahl, aber lange Lieferzeit und Zollfragen · b) andere Lieferanten mit EU-Lager prüfen · c) CJ-Oberfläche mit Filter „Ships from: Germany“ gegenprüfen |

**Nächster Schritt (Vorschlag):** Option 2c (5 Minuten, kostenlos), danach Entscheidung zwischen 2a und 2b.

---

# TEIL 2 – ENTWICKLER-PROTOKOLL

## 2.1 Zugriff
- Endpoint: `POST https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken`, Body `{"apiKey": $CJ_API_KEY}`.
- Antwort `code 200, Success`, openId 59707, Token gültig bis `2027-04-28T23:34:36+08:00`.
- Token nur in der flüchtigen Arbeitsablage der Sitzung gespeichert; **nicht** im Repo. Header für Folgeaufrufe: `CJ-Access-Token`.

## 2.2 Abfragen (nur lesend)
| Endpoint | Parameter | Zweck |
|---|---|---|
| `GET product/listV2` | `keyWord`, `countryCode`, `page`, `size=100` (max. 5 Seiten) | Suche je Lagerland |
| `GET product/list` | `productNameEn`, `countryCode`, `pageNum`, `pageSize=200` | Gegenprobe zweiter Suchweg |
| `GET product/query` | `pid` | Details, Varianten, Beschreibung |
| `GET product/stock/getInventoryByPid` | `pid` | Lagerbestand je Lager |
| `POST logistic/freightCalculate` | `startCountryCode=DE`, `endCountryCode=DE`, `vid`, `quantity=1` | Versandkosten/-dauer |

- Lagerländer: DE, FR, IT, ES, PL, CZ, NL, BE, HU (GB nur zur Information abgefragt).
- Suchbegriffe: `dog winter coat`, `dog boots`; Gegenproben `dog coat`, `dog jacket`, `pet clothes`, `dog clothes`,
  `dog shoes`, `pet shoes`, `dog paw protector`.
- Filter der Treffer (Name, Regex): Tierbezug `\b(dogs?|pets?|puppy)\b` UND Kleidung/Schuh
  (`coat|jacket|vest|cloth|sweater|hoodie|jumpsuit|parka|boot|shoe|sock|paw`), ohne `harness|leash|collar|costume|rack|bed`.
- Beide Suchwege lieferten dasselbe Ergebnis. Die Treffermengen je Land stehen im CEO-Bericht.
- Pausen ≥ 1,1 s zwischen Aufrufen; Punktekontingent laut Antwort 50.000/Tag, davon zum Zeitpunkt ~5.400 genutzt.

## 2.3 Produktdaten Kandidat
- PID `2109548450556198913`, SKU `CJFU3247916`, VID `2109548450702999554` (Green), `sellPrice 23.68`, `suggestSellPrice 80.52`.
- `productType SUPPLIER_SHIPPED_PRODUCT`, `supplierName fulian`, `entryCode 4421100090` („furniture“),
  `categoryName Home, Garden & Furniture / Home Storage / Furniture`, Gewicht 250 g, `createrTime 2026-10-12`, `listedNum 8`.
- Lager: `Germany Warehouse`, `cjInventoryNum 200`, `factoryInventoryNum 0`, Variante `verifiedWarehouse 1`.
- Versand: 3 Tarife (GLS/Hermes/hellmann DE to DE), `logisticAging "3-5"`, `logisticPrice 0.0`, `totalPostageFee 0.0`.
- Währung: Feld `currency` in Suchergebnissen `null` → USD angenommen. Kurs: EZB-Referenzkurs 30.10.2026, USD 1,1172.

## 2.4 Offene technische Punkte
1. Versandpreis 0,00 und Lieferzeit-Einheit in CJ-Oberfläche bestätigen (API-Wert nicht belastbar).
2. Prüfen, ob die API Angebote privater Lieferanten bzw. reine Oberflächen-Angebote ausblendet.
3. Bei Übernahme eines Produkts (erst nach CEO-Freigabe): Tags `kategorie-*`, `quelle-cj`; Metafelder
   `custom.hersteller`, `custom.eu_verantwortlicher` usw. befüllen – Daten dazu fehlen bei CJ.
4. Produkte, die nur in der CJ-Oberfläche erscheinen, prüft der CEO; Claude bewertet anhand von Screenshots.

## 2.5 Nicht getan
Keine Importe/„List“-Aktionen, keine Bestellungen, keine Zahlungen, keine Änderungen an Shopify oder Theme,
kein Merge nach `main`.
