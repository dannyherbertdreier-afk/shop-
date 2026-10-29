# 8 · Audit der vorhandenen Vorbereitung

Stand: 29.10.2026 · geprüft: Branch `claude/shop-vorbereitung`, Ordner `vorbereitung/`

## Projektstand laut CEO (29.10.2026)
- Printify-Konto: **vorhanden** (laut CEO, von Claude nicht einsehbar)
- CJdropshipping-Konto: **vorhanden** (laut CEO, von Claude nicht einsehbar)
- Shopify-Konto: **möglicherweise noch nicht vorhanden**
- Konkrete Produkte: werden **noch nicht** bearbeitet
- Arbeitsname: **Knuddelwuff**, rechtlich nicht freigegeben (Ähnlichkeit zu „Knuffelwuff“)
- GitHub-Pages-Workflow: **deaktiviert** (von Claude am 29.10.2026 über GitHub geprüft: `disabled_manually`)

## Zugriffe, die Claude tatsächlich hat
| System | Zugriff | Folge |
|---|---|---|
| GitHub-Repository | Lesen, Branches, Commits, PRs (kein Ein-/Ausschalten von Workflows) | Unterlagen pflegen ✔ |
| Shopify | **keiner** | Einstellungen nur planen, nicht ausführen |
| Printify | **keiner** | Integration nur planen |
| CJdropshipping | **keiner** | Integration nur planen |
| Web-Recherche | ja (öffentliche Seiten, keine Logins) | Preise/Funktionen nur soweit öffentlich |

## Bewertung der vorhandenen Dateien
| Datei | Zustand | Lücke / Handlungsbedarf | Erledigt in |
|---|---|---|---|
| `01-design-paket.md` | gut: Farben, Schriften, Texte, FAQ, Produkttext-Vorlage | nutzt noch `[MARKENNAME]`; Navigation, Kategorien, Produkt- und Warenkorbseite fehlten | `11` |
| `02-produkt-pruefliste.md` | gut, sofort nutzbar | – (Produkte ruhen) | – |
| `gewinnrechner.xlsx` | funktioniert (223 Formeln, 0 Fehler) | Shopify-Preis 33 € als UNBESTÄTIGT markiert | `09` (Preisprüfung) |
| `04-print-on-demand-motive.md` + Motive | 5 Entwürfe fertig | CEO-Auswahl offen | – |
| `05-firmendaten-checkliste.md` | gut | keine Shopify-Zuordnung (wo trägt man was ein) | `13` |
| `06-produkt-shortlist.md` | Recherche-Stand | ruht laut CEO | – |
| `07-github-pages-abschalten.md` | Aufgabe erledigt | Status nachgetragen | `README` |
| `README.md` | Übersicht | neue Dateien ergänzt | `README` |

## Fehlende Bausteine (jetzt ergänzt)
| Neu | Inhalt |
|---|---|
| `09-shopify-einrichtung.md` | Architektur + Reihenfolge aller Einstellungen mit JETZT / SPÄTER / CEO MUSS ENTSCHEIDEN / NOCH NICHT ANFASSEN |
| `10-app-strategie.md` | Apps A/B/C mit Preis, Berechtigungen, Risiko |
| `11-startseite-navigation-kategorien.md` | Kollektionen, Menüs, Startseite, Produktseite, Warenkorb, Texte |
| `12-integration-printify-cj.md` | Verbindungsplan ohne Produktimport |
| `13-recht-checkliste.md` | Deutschland-Pflichten, Shopify-Zuordnung |
| `14-conversion.md` | Conversion-Empfehlungen mit wirtschaftlichem Zweck |
| `15-seo-und-traffic.md` | SEO- und Kanalplan, ohne Budget |
| `16-arbeitsplan-und-ceo-aufgaben.md` | Reihenfolge, Zuständigkeiten, CEO-Liste |
