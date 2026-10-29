# 7 · Alte öffentliche Demo abschalten (iPhone)

Die alte Demo liegt auf GitHub Pages: https://dannyherbertdreier-afk.github.io/shop-/
Die Abschaltung kannst nur du als Inhaber machen. Ich habe an den Einstellungen nichts geändert.

## Schritte im Safari (nicht in der GitHub-App)

1. Safari öffnen und eintippen:
   `github.com/dannyherbertdreier-afk/shop-/settings/pages`
   (falls nötig: anmelden)
2. Falls die Seite klein oder unübersichtlich ist: links in der Adresszeile auf **„aA“** tippen →
   **„Desktop-Website anfordern“**.
3. Oben im Bereich **„GitHub Pages“** steht **„Your site is live at …“**.
4. Rechts daneben auf das **Drei-Punkte-Symbol (⋯)** tippen.
5. **„Unpublish site“** wählen und bestätigen.
6. Prüfen: Nach 1–2 Minuten `dannyherbertdreier-afk.github.io/shop-` öffnen. Es sollte eine
   Fehlerseite (404) kommen.

## Wichtig: damit die Demo nicht von selbst zurückkommt

Laut GitHub entfernt „Unpublish“ nur die aktuelle Veröffentlichung. **Jeder neue erfolgreiche Lauf
des Veröffentlichungs-Workflows erzeugt sie wieder.** Bei diesem Repository passiert das
automatisch, sobald etwas in `main` übernommen wird, z. B. durch den Merge eines Pull Requests.

So bleibt sie dauerhaft aus (Entscheidung beim CEO, ich ändere nichts ohne Freigabe):
- **Option A:** Keine Merges nach `main`, solange die Demo nicht online sein soll.
- **Option B:** In `Settings → Pages → Build and deployment → Source` die Quelle ändern bzw.
  den Workflow im Reiter **Actions** deaktivieren („Disable workflow“). Diese Bezeichnungen habe ich
  nicht live in deinem Konto gesehen, sie können leicht abweichen.

Repository, Code und alle Branches bleiben beim Abschalten erhalten.

Quelle: GitHub Docs – Unpublishing a GitHub Pages site:
https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site
