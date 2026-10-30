# 17 · Shopify-Anleitung für die offenen Bereiche

Stand: 30.10.2026 · Arbeitsname Knuddelwuff (rechtlich nicht freigegeben)

**Lesehilfe**
- **Klickpfade** stammen aus dem Shopify Help Center. Auch die deutschen Hilfeseiten lieferten
  englischen Text → **deutsche Menünamen sind UNBESTÄTIGT**. Im Zweifel die Lupe 🔍 im Admin nutzen.
- **Neu seit 2025/2026:** Menüs liegen laut Help Center unter **Content → Menus** (nicht mehr
  Online Store → Navigation).
- Claude hat **keinen Shopify-Zugang**. Alles hier ist **vorbereitet**, nicht umgesetzt.
- Spalte **„Empfehlung“**: *beibehalten* = Standard lassen · *ändern* = nur mit konkretem Vorteil.

---

## 1 · E-Mail-Benachrichtigungen

| Einstellung | Shopify-Standard (laut Help Center) | Empfehlung | Klickpfad |
|---|---|---|---|
| Kunden-Benachrichtigungen (Bestellbestätigung usw.) | „Most customer notifications are sent automatically and can't be deactivated.“ Vollständige Standardliste: UNBESTÄTIGT | **beibehalten** | Settings → Notifications → Customer notifications |
| Design der E-Mails | Standardvorlage | **ändern**: Logo + Akzentfarbe `#183D32` (`01`) – wirkt seriöser, kostet nichts | … → **Customize email template** → Logo „Choose file“, Farbe eintragen |
| Absenderadresse | ohne eigene authentifizierte Domain wird sie zu `store+…@shopifyemail.com` umgeschrieben | **vorerst beibehalten**; nach Domainkauf Domain authentifizieren (+ DMARC-Eintrag `_dmarc` / `v=DMARC1; p=none;`) | Settings → Notifications → **Sender email** |
| Mitarbeiter-Benachrichtigung | Kontoinhaber erhält standardmäßig jede neue Bestellung; Wochenübersicht montags 9 Uhr | **beibehalten** | Settings → Notifications → Staff notifications |
| Warenkorbabbruch-E-Mail | an/aus und Wartezeit: **UNBESTÄTIGT**. Zielgruppe standardmäßig nur Kunden mit Marketing-Einwilligung | **einschalten, aber Zielgruppe „nur Marketing-Abonnenten“ lassen**, bis rechtlich geklärt ist, ob Erinnerungsmails ohne Einwilligung zulässig sind | Apps → Messaging → Automations → „Abandoned checkout emails by Shopify“ → Edit settings |

**Textvorschlag Bestellbestätigung (Zusatzzeile, im Template einfügen):**
> Danke für deine Bestellung bei Knuddelwuff! Sobald dein Paket unterwegs ist, bekommst du eine
> E-Mail mit Sendungsnummer. Fragen? Antworte einfach auf diese E-Mail.

⚠️ „Antworte einfach“ nur verwenden, wenn die Absender-/Antwortadresse wirklich gelesen wird.

---

## 2 · Navigation und Hauptmenü

- **Standard:** Hauptmenü = Home + Catalog; Footer-Menü = Search.
- **Klickpfad:** Content → Menus → Menü antippen → Add menu item → Name → Link suchen → Add → **Save menu**.
- **Empfehlung:** ändern auf die Struktur aus `11.2` – **aber erst, wenn Kollektionen Produkte haben**.
  Bis dahin Standard lassen (leere Kategorien wirken unfertig).
- **Untermenüs:** per Drag & Drop unter einen Eintrag ziehen, max. 2 Ebenen; auf dem Handy wird der
  obere Eintrag zum Aufklapp-Button. Für den Start **keine Untermenüs** (5 Punkte reichen).

## 3 · Footer und Informationsseiten

| Seite | Wo | Standard | Empfehlung |
|---|---|---|---|
| Rückgabe/Widerruf, Datenschutz, AGB, Versand | Settings → **Policies** → „Written policies“ | leer; „Use automated policy“ bzw. „Insert template“ verfügbar | **nicht** Shopify-Vorlagen verwenden, sondern Texte des Rechtstexte-Dienstes (`10`) |
| Impressum | Settings → Policies: Feld **Legal notice** existiert; Shopifys Deutschland-Seite nennt das Feld **Contact information** | – | ⚠️ **Widerspruch zwischen Shopify-Seiten** → Rechtstexte-Dienst entscheiden lassen, welches Feld |
| Anzeige | Richtlinien werden **automatisch im Checkout-Footer** verlinkt; Rückgabe-Richtlinie auf Bestellübersicht, Versand-Richtlinie auf Produktseite + Warenkorb | – | **beibehalten** |
| Über uns, Größe & FAQ, Kontakt | Online Store → Pages → Add page | keine bestätigten Standardseiten | **anlegen**, Texte `01` 1.6 + `11.5`; Sichtbarkeit „Hidden“ bis fertig |
| Kontaktformular | laut Help Center ggf. Theme-Abschnitt bzw. Code nötig | UNBESTÄTIGT | im Theme prüfen; sonst E-Mail-Adresse als Text |

## 4 · Kollektionen

- **Klickpfad:** Products → Collections → Add collection.
- **Neu:** Shopify ersetzt laut Help Center „manuell/automatisch“ durch ein neues Modell mit
  **Quellen** (Products, Variants, Collection, App) und Bedingungen („Match all/any conditions“).
  Neue Kollektion startet mit leerer Products-Quelle.
- **Empfehlung:** Kollektionen aus `11.1` mit Bedingung **Produkt-Tag** anlegen (genaue Bezeichnung
  der Tag-Option im Menü: UNBESTÄTIGT). Bis zu 60 Bedingungen möglich.
- Jetzt anlegen ist unschädlich; **nicht ins Menü** nehmen, solange leer.

## 5 · Theme

| Punkt | Fakt (Quelle) | Empfehlung |
|---|---|---|
| Vorinstalliertes Theme | Help Center nennt **Dawn** als Standard; ob neue Shops inzwischen Horizon bekommen: UNBESTÄTIGT | im Admin nachsehen: Online Store → Themes |
| Horizon | 10 kostenlose Horizon-Themes (seit 21.05.2025), „Theme blocks“, Farb-Paletten, Slide-out-Warenkorb | **Horizon** – neuere Technik, gleiche Kosten (0 €) |
| Dawn | kostenlos, minimalistisch | gute Alternative, falls bereits installiert und ausreichend |
| Schriften | **Manrope und Inter sind in der Shopify-Schriftbibliothek** (shopify.dev) | Überschriften Manrope 700/800, Text Inter 400 (`01`) |
| Farben | bis zu 21 Farbschemata; bei Horizon „Color palettes“ | 3 Schemata aus `01` 1.2 |
| Logo / Favicon | Logo max. 300 px breit; Favicon empfohlen 32 × 32 px | erst nach Markenfreigabe; bis dahin Textlogo |
| Klickpfad | Online Store → Themes → **Edit theme** → Zahnrad (Theme settings) | – |

**Ein Theme hinzufügen ändert nichts am aktiven Shop**, solange man nicht auf „Publish“ tippt.
Vorgehen: Horizon hinzufügen → bearbeiten → erst danach veröffentlichen (der Shop bleibt trotzdem passwortgeschützt).

## 6 · Startseite

Aufbau, Reihenfolge und Texte: **`11.4` und `11.5`** (Hero exakt „Gut geschützt durch den Winter.“).
- Abschnitt „Empfohlene Produkte“ **erst mit echten Produkten**.
- Kein Pop-up, kein Countdown, keine Video-Hero.
- Startseiten-Titel und Meta-Beschreibung: Online Store → **Preferences** → „Social sharing image and SEO“.
  Vorschlag Titel: `Knuddelwuff – Winterbegleiter für Hunde` · Beschreibung:
  `Hundemäntel, Pfotenschutz und Winterzubehör für kalte, nasse Spaziergänge. Mit Größenberatung.`
  (Name erst nach Freigabe final.)

## 7 · Produktseiten

| Punkt | Fakt | Empfehlung |
|---|---|---|
| Variantenauswahl | Theme bietet „Variant pills“; Standard Buttons/Dropdown: UNBESTÄTIGT | **Buttons (pills)** für Größen – auf dem Handy schneller als ein Dropdown |
| „Das könnte dir auch gefallen“ | Abschnitt **Related products**: Edit theme → Products → Default product → Add section | **hinzufügen**, sobald ≥ 4 Produkte |
| Ergänzende Produkte | nur über App **Search & Discovery** (bis 10 je Produkt, nur bei Bestand > 0) | **SPÄTER** (`10`) |
| Inhalt | Vorlage `01` 1.5, GPSR-Angaben (`13`) | – |
| Versand-Richtlinie | wird laut Help Center auf Produktseiten verlinkt | **beibehalten** |

## 8 · Warenkorb

- **Klickpfad:** Edit theme → Theme settings → **Cart**.
- Optionen: **Drawer**, Page, Popup notification; Standard: UNBESTÄTIGT. Shopify selbst: „To keep the
  customer on the product page, use the drawer or pop-up notification option.“
- **Empfehlung: Drawer.** „Cart note“ (Kundenkommentar) **aus** lassen (Dropshipping kann keine
  Sonderwünsche umsetzen). Für leeren Warenkorb eine Kollektion zeigen („Alle Produkte“).
- Gratisversand-Fortschrittsbalken: im Theme nicht belegt → **keine App dafür**.

## 9 · Mobile Optimierung

- In der Shopify-App: Menü → Online Store → Manage all themes → Edit theme. Im Vorschau-Inspektor:
  **Antippen = Einstellung wählen, Doppeltippen = wie ein Kunde klicken**.
- Prüfliste je Seite (iPhone): Hero-Text lesbar · Kaufbutton ohne Scrollen sichtbar · Größenbuttons
  groß genug · Menü öffnet sich · Footer-Links erreichbar · keine abgeschnittenen Texte.

## 10 · Passwortschutz und Launch-Vorbereitung

| Punkt | Fakt (Help Center) | Empfehlung |
|---|---|---|
| Passwort für Besucher | Online Store → Preferences → Store access → Private mode → **Password** (nicht das Admin-Passwort!) | **bleibt an**; eigenes Testpasswort setzen und nur an Tester geben |
| Passwortseite gestalten | Theme-Editor → Seitenauswahl „Home page“ → Passwortseite | Text: „Knuddelwuff öffnet bald. Wir bereiten gerade alles für den Winter vor.“ – **kein** Newsletter-Formular, solange Datenschutz nicht steht |
| Spam-Schutz | hCaptcha ist standardmäßig aktiv | **beibehalten** |
| Vor dem Launch (laut Shopify) | Plan wählen (Gebühren erst nach Testphase), Geschäftsadresse, Zahlungsart eingerichtet **und Testmodus aus**, Testbestellung | siehe `09.3` + CEO-Freigabe |
| Launch | Online Store → „Private“ → Public → Update (erstes Mal „Launch store“) | **NOCH NICHT ANFASSEN** |

---

## 11 · Versand und Rückgabe – Prüfung der bereits gesetzten Werte

| Gesetzt (laut CEO) | Befund | Empfehlung |
|---|---|---|
| Standard 5,99 € | im Gewinnrechner noch mit 4,90 € gerechnet | Gewinnrechner pro Produkt mit 5,99 € rechnen |
| Kostenlos ab 55 € | Wirkung auf Marge **nicht berechenbar**, solange Einkaufs- und Versandkosten der Lieferanten fehlen | Schwelle nach den ersten echten Preisen neu prüfen |
| Express 9,99 €, 1–2 Werktage | Keine Quelle stützt 1–2 Werktage bei Print on Demand (Produktionszeit kommt hinzu) oder CJ (Frankfurter Lager hat laut CJ nicht jeden Artikel vorrätig; Beispiel dort: 5–8 Werktage Laufzeit) | **Express-Tarif entfernen**, bis ein Lieferant ihn schriftlich bestätigt (Tarif lässt sich jederzeit neu anlegen) |
| Lieferzeit 3–5 Werktage (Standard) | Shopify zeigt die Lieferzeit **im Checkout unter der Versandart**; Angabe ist dort optional. Gesetzlich muss ein Liefertermin angegeben werden (Art. 246a § 1 Abs. 1 Nr. 10 EGBGB). Händlerbund empfiehlt Tage statt Werktage; „voraussichtlich“, „in der Regel“ gelten laut Urteilen als riskant | Zahl erst nach Testbestellungen festlegen; Formulierung z. B. „Lieferzeit: ca. X–Y Tage“ vom Rechtstexte-Dienst bestätigen lassen |
| Rückgabe- und Stornoanträge an | Shopify: für EU-Kunden elektronischer Weg für das 14-tägige Widerrufsrecht nötig; empfohlen: Frist mind. 14 Tage, Storno „Until item is fulfilled“ | Regeln prüfen: Settings → Policies → **Return and cancellation rules** → Frist ≥ 14 Tage, Storno bis Versand; Rücksendekosten: **CEO entscheidet** |
| Shopify-Steuerdienst aktiv | laut Shopify-Preisseite: EU-Freigrenze 100.000 €, bei Shops ab 13.05.2026 über die gesamte Laufzeit; darüber 0,25 % je Bestellung, max. 0,99 € | **beibehalten** – für den Start kostenlos |

## Quellen (abgerufen 30.10.2026)
Benachrichtigungen: https://help.shopify.com/en/manual/fulfillment/setup/notifications/customer-notifications · https://help.shopify.com/en/manual/fulfillment/setup/notifications/customizing-notification-template · https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-your-email · https://help.shopify.com/en/manual/fulfillment/setup/notifications/staff-notifications
Warenkorbabbruch: https://help.shopify.com/en/manual/promoting-marketing/create-marketing/abandoned-checkouts · https://help.shopify.com/en/manual/promoting-marketing/create-marketing/marketing-automations/types
Menüs/Seiten: https://help.shopify.com/en/manual/online-store/menus-and-links/editing-menus · https://help.shopify.com/en/manual/online-store/menus-and-links/drop-down-menus · https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-your-store · https://help.shopify.com/en/manual/online-store/themes/theme-structure/pages
Richtlinien: https://help.shopify.com/de/manual/checkout-settings/refund-privacy-tos · https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/sell-in-germany/german-merchant-checkout-page
Kollektionen: https://help.shopify.com/en/manual/products/collections/create-collection · https://help.shopify.com/en/manual/products/collections/automated-collections
Theme: https://help.shopify.com/en/manual/online-store/setting-up · https://changelog.shopify.com/posts/horizon-10-new-free-themes-by-shopify · https://help.shopify.com/en/manual/online-store/themes/theme-structure/theme-settings · https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts#available-fonts · https://themes.shopify.com/themes/horizon/presets/horizon
Produktseite: https://help.shopify.com/en/manual/online-store/themes/customizing-themes/add-complementary-products · https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-recommendations
Mobil: https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/preview-inspector
Passwort/Launch: https://help.shopify.com/en/manual/online-store/themes/password-page · https://help.shopify.com/en/manual/online-store/setting-up/preferences · https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-prepare-for-launch
Versand/Steuer/Rückgabe: https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/transit-time · https://help.shopify.com/en/manual/taxes/shopify-tax/pricing · https://help.shopify.com/en/manual/orders/self-serve-returns/return-rules · https://cjdropshipping.com/blogs/cj-news/CJdropshipping-for-Germany-Dropshipping-Sellers · https://printify.com/print-on-demand/europe
Lieferzeit-Recht: https://www.haendlerbund.de/de/news/aktuelles/wissenssnack/lieferzeitangaben-online-shop · https://www.it-recht-kanzlei.de/ungenaue-lieferzeiten-abmahnung.html
Conversion: https://baymard.com/lists/cart-abandonment-rate · https://baymard.com/research-articles/make-guest-checkout-prominent
