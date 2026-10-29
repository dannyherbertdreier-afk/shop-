# 9 · Shopify-Architektur und Einrichtungs-Reihenfolge

Stand: 29.10.2026 · Arbeitsname **Knuddelwuff** (rechtlich nicht freigegeben)

**Wichtig:** Claude hat **keinen Shopify-Zugang**. Alle Schritte führt der CEO im Shopify-Admin aus
(Claude kann per Screenshot begleiten). Menünamen stammen aus dem englischen Shopify Help Center
→ in der deutschen Oberfläche können sie anders heißen.

**Markierungen:**
- **JETZT** = im Testshop sofort einrichten
- **SPÄTER** = erst wenn Voraussetzung erfüllt
- **CEO MUSS ENTSCHEIDEN** = Geschäftsentscheidung oder Kosten
- **NOCH NICHT ANFASSEN** = bewusst gesperrt

---

## 9.1 Architektur (schlank)

| Ebene | Lösung | Begründung |
|---|---|---|
| Shop-System | Shopify, Plan **Basic** (kleinster regulärer Plan) | Kasse, Steuern, Bestellungen, Apps fertig; Upgrade jederzeit |
| Theme | **Horizon** oder **Dawn** (beide im Theme Store als „Free“ gelistet) | keine Theme-Kosten; Design per Einstellungen (`01`, `11`) |
| Sortiment | Kollektionen über Tags (`11.1`) | neue Produkte sortieren sich automatisch |
| Lieferanten | Printify (POD), CJdropshipping (Dropshipping) – **erst nach Produktfreigabe** verbinden (`12`) | |
| Zahlung | Shopify Payments (für Deutschland verfügbar) | keine externe Transaktionsgebühr (siehe 9.3) |
| Rechtstexte | Rechtstexte-Dienst mit Schnittstelle (`10`, `13`) | Texte bleiben aktuell |
| Apps | Start mit **0 Apps** (`10`) | Ladezeit, Datenschutz, Kosten |
| Automatisierung | Shopify-eigene Warenkorbabbruch- und Bestell-E-Mails; später Shopify Flow | 0 € |

### Kosten laut shopify.com/de/preise (abgerufen 29.10.2026)
Die Seite zeigte bei der Recherche **USD** (vermutlich wegen Abruf aus den USA). **EUR-Preise
UNBESTÄTIGT** – vor Abschluss im eigenen Konto ablesen.

| Plan | monatlich zahlen | jährlich zahlen (je Monat) | Transaktionsgebühr ohne Shopify Payments |
|---|---|---|---|
| Basic | 39 USD | 29 USD | 2 % |
| Grow | 105 USD | 79 USD | 1 % |
| Advanced | 399 USD | 299 USD | 0,6 % |

- Testphase laut Seite: **„3 Tage kostenlos testen, danach 1 $/Monat für 3 Monate“**.
- Kartengebühr mit Shopify Payments (Basic, online): 2,9 % + 30 ¢ (USD-Anzeige, EUR-Satz UNBESTÄTIGT).
- ⚠️ Der Gewinnrechner rechnet mit 33 €/Monat (UNBESTÄTIGT). Nach Ablesen des EUR-Preises dort anpassen.

---

## 9.2 Reihenfolge der Einstellungen

| # | Bereich | Was genau | Markierung |
|---|---|---|---|
| 1 | Konto | Shopify-Konto anlegen (Testphase) | **CEO MUSS ERLEDIGEN** |
| 2 | Shopname | Settings → General: Shopname „Knuddelwuff“ als Arbeitsname; ist intern änderbar. Die `myshopify.com`-Adresse ist laut gängiger Praxis nach Anlage nicht änderbar (UNBESTÄTIGT) → neutralen Namen wählen, z. B. ohne Marke | **CEO MUSS ENTSCHEIDEN** |
| 3 | Sprache | Deutsch als Shop-Sprache | JETZT |
| 4 | Währung | EUR als Shop-Währung (Settings → General → Store defaults) | JETZT |
| 5 | Deutschland | Shopify Markets hat laut Help Center **keinen „primären Markt“** mehr, sondern eine **„Backup Region“** (Settings → General → Store defaults) → Deutschland setzen | JETZT |
| 6 | Märkte | Zunächst nur Deutschland. Weitere EU-Länder: Markets → Markt → „Includes“ → Land hinzufügen | SPÄTER (CEO MUSS ENTSCHEIDEN, welche Länder) |
| 7 | Steuern | Settings → Taxes and duties → „Include tax in prices“ (Bruttopreise); je Produkt „Charge tax on this product“ | JETZT, aber **CEO MUSS ENTSCHEIDEN**: Kleinunternehmer ja/nein (Shopify-Hilfe dazu nicht gefunden → Steuerberater) |
| 8 | Versand | Ein Versandprofil für Deutschland vorbereiten. App-Lagerorte (Printify/CJ) bekommen laut Help Center **nicht automatisch** Versandtarife → nach Verbindung prüfen, sonst sind Produkte „nicht lieferbar“ | Grundprofil JETZT, Tarife SPÄTER (nach Lieferantenpreisen) |
| 9 | Checkout | Kontaktfeld: E-Mail; Telefon optional; Rechtstexte erscheinen automatisch im Checkout-Footer, sobald unter Policies hinterlegt. **Bestell-Button-Text** „zahlungspflichtig bestellen“ (§ 312j BGB): ob Shopify ihn auf Deutsch so beschriftet, ist **UNBESTÄTIGT** → im Test sichtbar prüfen; anpassbar unter Online Store → „Edit default theme content“ → „Checkout & system“ | JETZT einstellen, Button im Test prüfen |
| 10 | Kundenkonten | „Legacy customer accounts“ sind laut Help Center veraltet → neue Kundenkonten nutzen, Gastkauf erlauben | JETZT |
| 11 | E-Mails | Settings → Notifications: Logo, Farben (`01`), Texte für Bestellbestätigung und Versand; Warenkorbabbruch-Mail: Apps → Messaging → Automations → „Abandoned checkout emails“ (Standard-Zustand und Wartezeit UNBESTÄTIGT → nachsehen) | JETZT (Absender-Adresse: CEO) |
| 12 | Navigation | Menüs laut `11.2` | JETZT |
| 13 | Kategorien | Kollektionen laut `11.1` (leer anlegen) | JETZT |
| 14 | Theme | Horizon installieren, Farben/Schriften laut `01` | JETZT |
| 15 | Mobil | Jede Seite im Theme-Editor in der Handy-Ansicht prüfen | JETZT |
| 16 | Startseite | Abschnitte und Texte laut `11.4`/`11.5` (ohne Produkt-Abschnitt) | JETZT |
| 17 | Produktseiten | Vorlage laut `11.6` | Vorlage JETZT, Inhalte SPÄTER |
| 18 | Warenkorb | Warenkorb-Schublade laut `11.7` | JETZT |
| 19 | Passwortschutz | Neue Shops starten laut Help Center im privaten Modus mit Passwortseite | **NOCH NICHT ANFASSEN** (bleibt an) |
| 20 | Domain | eigene Domain (DNS: A-Record 23.227.38.65, CNAME www → shops.myshopify.com) oder Kauf über Shopify (1 Jahr, Verlängerung automatisch, nicht erstattbar, Preis je Endung) | **CEO MUSS ENTSCHEIDEN**, erst nach Markenfreigabe |
| 21 | Zahlung | Shopify Payments einrichten: EUR-Geschäftskonto (kein Sparkonto), Firmendaten, Identitätsprüfung; Einzelunternehmer möglich, Wohnsitz Deutschland Pflicht | **CEO MUSS ERLEDIGEN** |
| 22 | Testbestellung | Shopify Payments → Testmodus (erst nach abgeschlossener Einrichtung), Testkarte Visa 4242 4242 4242 4242; alternativ „Test payment gateway“. Laut Help Center: **Testen erst mit bezahltem Plan** möglich. Im Testmodus keine echten Bestellungen | SPÄTER (nach Plan-Wahl) |
| 23 | Launch | Online Store → „Launch store“ / Passwort entfernen | **NOCH NICHT ANFASSEN** – erst nach Abschlussliste 9.3 |

---

## 9.3 Abschlussliste vor dem Launch (alles muss ✔ sein)
- [ ] Markenname rechtlich freigegeben
- [ ] Impressum, Datenschutz, AGB, Widerruf, Versand eingebunden (`13`)
- [ ] Gewerbe, Steuer, LUCID, ggf. EAR erledigt (`05`, `13`)
- [ ] Produkte mit GPSR-Angaben, geprüften Mustern, eigenen Fotos
- [ ] Versandtarife je Lieferant geprüft
- [ ] Testbestellung inkl. E-Mails, Button-Text, Rechnung, Storno durchgespielt
- [ ] Cookie-Einwilligung geprüft (`10`, Teil C)
- [ ] CEO-Freigabe schriftlich

## Quellen (abgerufen 29.10.2026)
- Preise: https://www.shopify.com/de/preise
- Shopify Payments Deutschland: https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/germany · …/germany/requirements
- Testmodus / Testbestellungen: https://help.shopify.com/en/manual/checkout-settings/test-orders/payments-test-mode · https://help.shopify.com/de/manual/checkout-settings/test-orders
- Passwortseite: https://help.shopify.com/en/manual/online-store/themes/password-page
- Markets: https://help.shopify.com/en/manual/markets-new/manage
- Steuern: https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/sell-in-germany/german-merchants-product-page · https://help.shopify.com/en/manual/taxes/eu/germany
- Versand: https://help.shopify.com/en/manual/shipping/setting-up-and-managing-your-shipping/shipping-profiles · https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/troubleshooting
- Kundenkonten: https://help.shopify.com/en/manual/customers/customer-accounts/legacy-customer-accounts
- Checkout Deutschland: https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/sell-in-germany/german-merchant-checkout-page
- Rechtstexte: https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos
- Warenkorbabbruch: https://help.shopify.com/en/manual/promoting-marketing/create-marketing/abandoned-checkouts
- Themes: https://themes.shopify.com/themes?price%5B%5D=free · https://changelog.shopify.com/posts/horizon-10-new-free-themes-by-shopify
- Domains: https://help.shopify.com/en/manual/domains/add-a-domain/buying-domains · https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-domain-manual
- Benachrichtigungen: https://help.shopify.com/en/manual/orders/notifications/email-templates
