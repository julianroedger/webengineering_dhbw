# Übungsblatt 5 – Lösung

## Teil A · Pflicht

### A1 Deployen

**Live:** https://julianroedger.github.io/webengineering_dhbw/ (steht auch in der README)

### A2 Die eigene Seite im Network-Tab

| Request | Status |
| --- | --- |
| HTML-Seite, `assets/app-….css`, `assets/app-….js` | 200 |
| Pokémon-Bilder von `raw.githubusercontent.com` | 200 |

Kein einziger Request mit 4xx oder 5xx.

### A3 Lokal und live vergleichen

(steht auch in der README)

1. **Caching:** Lokal ist jede Änderung sofort sichtbar, live erscheint nach einem Deploy manchmal noch die alte Version. Grund: Vite schickt `Cache-Control: no-cache`, GitHub Pages dagegen `Cache-Control: max-age=600`, der Browser darf die Dateien also 10 Minuten wiederverwenden. Abhilfe: hartes Neuladen (`Cmd/Strg + Shift + R`).
2. **Groß-/Kleinschreibung:** `POKEDEX.html` funktioniert lokal, live gibt es einen `404`. macOS unterscheidet nicht zwischen groß und klein, GitHub Pages schon.
3. **Andere Dateien:** Lokal lädt der Browser `style.css` (11,8 kB, nicht minifiziert), `app.js` und zusätzlich `@vite/client` (ca. 220 kB, für das automatische Neuladen). Live sind es nur die gebauten Dateien aus `/webengineering_dhbw/assets/` (CSS 9,5 kB, JS 0,8 kB, mit Hash im Namen). 

### A4 README ausbauen

- **Was die App kann:** drei Punkte was die Seite kann
- **Live-URL:** zeigt auf die Pages-Seite
- **Datenquelle:** PokeAPI mit Endpunkten, genutzten Feldern und Doku-Link
- **Lokal starten:** Anleitung ist mit drin
- **Screenshot:** `pokedex_screenshot.png` im Repo 

### A5 Keine Geheimnisse im Repo

- gefunden wurde nur normaler Text („API-Key“ in README und `ueber.html`, „Design-Tokens“ in `style.css`).
- `id-token: write` in `deploy.yml` ist eine Berechtigung, kein Token.
- Die PokeAPI braucht keinen Key.

In diesem öffentlichen Repo steht nichts, was nicht öffentlich sein darf.

## Teil B · Bonus

Die zwei Sätze, wann ein eigener Server nötig ist, stehen in der README.

## Teil C · Verständnisfragen

**1. Statuscodes 200, 404 und 500 – wer ist „schuld“?**
- **200 OK:** Alles hat geklappt, niemand ist schuld.
- **404 Not Found:** Unter dem Pfad gibt es nichts. Schuld ist der **Client** (4xx), meist also ein falscher Pfad, den wir selbst ins HTML geschrieben haben.
- **500 Internal Server Error:** Der Server-Code ist abgestürzt. Schuld ist der **Server** (5xx). Bei GitHub Pages kommt das praktisch nicht vor, weil dort nur Dateien ausgeliefert werden.

**2. Lokal läuft es, live nicht: drei Ursachen und wie man sie prüft**
- **Pfad beginnt mit `/`** und zeigt auf die Domain-Wurzel -> im Network-Tab den 404 anklicken und die Request-URL ansehen: Fehlt `/webengineering_dhbw/`?
- **Groß-/Kleinschreibung** (`Logo.png` ungleich `logo.png`) -> Dateinamen im Request mit `git ls-files` vergleichen.
- **Cache oder fehlgeschlagener Deploy** -> hartes Neuladen (`Cmd/Strg + Shift + R`), danach unter **Actions** prüfen, ob der Build grün ist.

**3. Datei, lokaler Server und Hosting?**
- **Datei** (`file:///…/index.html`): Der Browser öffnet die Datei direkt von der Festplatte. Es gibt kein HTTP, `fetch` funktioniert nicht, und nur man selbst sieht die Seite.
- **Lokaler Server** (`http://localhost:5173`): Ein Programm auf dem eigenen Rechner beantwortet echte HTTP-Anfragen. Erreichbar ist er nur vom eigenen Rechner.
- **Hosting** (`https://…github.io/…`): Ein Server im Internet liefert die Seite für alle aus, mit HTTPS, Caching, Unterordner und strenger Groß-/Kleinschreibung. Erst hier zeigt sich, ob die Seite wirklich läuft.