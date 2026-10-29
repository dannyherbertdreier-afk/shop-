# 12 · Integrationsplan Printify und CJdropshipping

Stand: 29.10.2026 · **Keine Produkte importieren, bis der CEO es ausdrücklich freigibt.**
Claude hat keinen Zugang zu Shopify, Printify oder CJ → alle Klicks macht der CEO.

Quellenlage: Herstellerseiten und Shopify App Store, abgerufen 29.10.2026. Das Printify-Hilfecenter
war per Bot-Schutz gesperrt (nicht umgangen) → einige Punkte **UNBESTÄTIGT**.

---

## 12.1 Printify (Print on Demand)

| Punkt | Stand |
|---|---|
| **Wann verbinden** | erst wenn der CEO das erste POD-Produkt freigibt und der Shopify-Plan feststeht |
| **Wie** | laut Printify „one click through the Shopify App Store“; genaue Schritte UNBESTÄTIGT (Hilfecenter gesperrt) |
| **Kosten** | App Free; Premium 39 USD/Monat bzw. 299,88 USD/Jahr → **Free reicht für den Start** |
| **Berechtigungen** (App Store) | Kundendaten (Name, E-Mail, Telefon, Adresse, IP, Standort); Produkte, Inventar, Bestellungen (60 Tage), Theme, Script-Tags, Seiten, Rechtstexte, Navigation lesen/ändern |
| **Was synchronisiert** | Produkte → Shopify (automatisch); Bestellungen → Printify (automatisch); Versandkosten laut Marketingseite automatisch; beim Neu-Veröffentlichen wählbar, ob Farben/Größen/Preise aktualisiert werden. Tracking-Rückgabe an Shopify und Bestandssync: **UNBESTÄTIGT** |
| **Bestellfreigabe** | Standard: automatisch nach 24 Stunden, manuelle Freigabe möglich |

**Wichtige Einstellungen später:**
1. **Bestellfreigabe auf manuell** stellen, bis die ersten Bestellungen sauber laufen
   (Schutz vor Fehlbestellungen). Später auf automatisch umstellen.
2. **Druckpartner in der EU** wählen. Printify nennt Partner u. a. in Deutschland, Tschechien,
   Polen, Lettland. In der Versandliste stehen z. B. Textildruck Europa (DE), MWW On Demand (u. a. DE),
   OPT OnDemand (CZ), Print Pigeons (LV). Welche davon Hundeprodukte drucken: **UNBESTÄTIGT**.
3. **Achtung:** Printify leitet Bestellungen bei Ausverkauf an einen anderen Druckpartner um → kann
   Lieferzeit und Herkunft ändern.
4. **Versand in Shopify prüfen:** Laut Shopify Help Center bekommen App-Lagerorte nicht
   automatisch Versandtarife. Ob Printify ein eigenes Profil anlegt: UNBESTÄTIGT → nach Verbindung
   in Settings → Shipping nachsehen.
5. **Branding:** Nackenetikett ab 0,55 USD, Beilagekarte ab 0,15 USD; Beilagen nur bei bestimmten
   Partnern, kein Branding bei Express-Versand.

---

## 12.2 CJdropshipping

| Punkt | Stand |
|---|---|
| **Wann verbinden** | erst wenn der CEO das erste Dropshipping-Produkt freigibt |
| **Wie** | Variante 1: Shopify App Store → App „CJdropshipping: Much Faster“ installieren → Berechtigungen bestätigen → im CJ-Konto „Connect/Authorize“. Variante 2: im CJ-Konto unter Authorization → Shopify → „Add Stores“ |
| **Kosten** | Installation kostenlos; Produkt- und Servicegebühren in USD, Höhe nicht genannt |
| **Berechtigungen** | auf der App-Store-Seite **nicht sichtbar** → bei Installation genau lesen |
| **Was synchronisiert** | Bestand: automatisch; Bestellungen: automatisch (aber **nicht** solche von vor der Verbindung); Tracking: automatisch an Shopify (Bestand muss von CJ oder Shopify verwaltet werden); Preise: **widersprüchlich** (Integrationsseite: „perfectly synced“, Anleitung: Preise selbst anpassen) → selbst pflegen |
| **Bezahlung** | CJ bucht laut CJ **nicht automatisch ab**; jede Bestellung muss bezahlt werden (Guthaben oder „automatic payment“, Details UNBESTÄTIGT) |

**Wichtige Einstellungen später:**
1. **Lager:** CJ nennt Lager in Deutschland, Frankreich, Italien. Pro Produkt EU-Lager wählen,
   wie genau: UNBESTÄTIGT. Ohne EU-Lager gilt K.o.-Kriterium A2 (`02`).
2. **Bezahlung:** Zunächst **keine** automatische Zahlung → jede Bestellung bewusst freigeben.
3. **Preise:** Eigene Verkaufspreise in Shopify festlegen und bei CJ-Preisänderungen manuell prüfen
   (Gewinnrechner).
4. **Branding:** Logos, Beilagen, eigene Kartons laut CJ möglich, eigene Verpackung nur in größeren
   Mengen → erst bei Volumen.
5. **Bewertungen beachten:** Einzelne 1-Stern-Bewertungen im App Store nennen Nachgebühren und
   Erstattungsstreit → erste Bestellungen eng kontrollieren.

---

## 12.3 Gemeinsame Regeln
- Jeder Import mit Tags `quelle-printify` / `quelle-cj` + Kategorie-Tag (`11.1`).
- Produkttexte nach Vorlage `01` umschreiben, Lieferantentexte nicht übernehmen.
- Vor Freischaltung: GPSR-Angaben, Testbestellung, eigene Fotos (`13`, `02`).
- Rechte der Apps (Theme, Rechtstexte) im Blick: nach Installation prüfen, ob die App etwas am
  Theme oder an Rechtstexten verändert hat.

## Quellen (abgerufen 29.10.2026)
- https://printify.com/sell-on-shopify-print-on-demand/ · https://apps.shopify.com/printify
- https://printify.com/print-on-demand/europe · https://printify.com/shipping-rates/
- https://printify.com/custom-branding/ · https://printify.com/blog/order-processing-and-fulfillment/
- https://printify.com/guide/how-to-manage-products-and-orders/
- https://apps.shopify.com/cucheng · https://cjdropshipping.com/integrations/shopify
- https://cjdropshipping.com/blogs/cj-news/How-to-Connect-Shopify-Store-to-CJdropshipping
- https://cjdropshipping.com/blogs/cj-news/CJdropshipping-for-Shopify-Stores-Guide
- https://blog.cjdropshipping.cn/detail/how-to-connect-shopify-shops-to-app-cjdropshipping-com
- https://cjdropshipping.com/blogs/supplier-&-sourcing-guides/Best-German-Dropshipping-Supplier
- https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/troubleshooting
