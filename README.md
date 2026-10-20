# Pokédex

Wir erstellen einen Pokédex mit einer öffentlichen API.

**Live:** https://github.com/julianroedger/webengineering_dhbw.git
**Team:** Julian Rödger, Alex Dortmann

## Ausgeschiedene Ideen

||Idee|Ausgeschieden, weil:|
|---|---|---|
|Rezept-Finder (TheMealDB)|Gerichte aufführen; Filterbar nach Zutaten, Kategorien oder Küchen.|Kochen ist für uns beide uninteresant, zudem ist diese Idee recht unkreativ.|
|Länder-Explorer (REST Countries)|Alle Länder, sortierbar nach Einwohnern, Fläche und Kontinent.|Langweilig und von wenig nutzen für den User.|
|Film-Watchlist (TMDB)|Filme suchen und eine eigene Merkliste anlegen.|Benötigt einen API-Key und Speicherlogik für die Merkliste -> viel höhere Komplexität.|
|Abfahrtsmonitor KA (KVV/EFA)|Abfahrten an Karlsruher Haltestellen, filterbar nach Linie.|Komplizierte (Wegen Live-Daten), schlecht dokumentierte API.|


## Was die App kann

- Anzeige der ersten 151 Pokémon
- Suche und Filter nach bspw. Typ, Attacken, Name

## Datenquelle

https://pokeapi.co

Welche API, welche Felder, wie oft aktualisiert? Link zur Doku.

## Lokal starten

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build nach dist/
npm run preview  # dist/ lokal ansehen
```

Das Styling kommt aus dem Tailwind-Build, die Seiten brauchen also `npm run dev` bzw. den Build (Live Server allein reicht nicht mehr).

**Deployment:** Bei jedem Push auf `main` baut GitHub Actions (`.github/workflows/deploy.yml`) die Seite und veröffentlicht `dist/` auf GitHub Pages. Einmalig nötig: Settings → Pages → Source „GitHub Actions“.

## Technik

Womit gebaut und warum. Eine Zeile pro Entscheidung reicht, aber es soll eine Entscheidung sein, keine Aufzählung von Buzzwords.

## Rich Result Test 

![Rich Result Test](rich_result_test.png)

## CSS-Kollision (Übungsblatt 3, A5)

- **Regeln:** `nav a { text-decoration: none }` und `nav a[aria-current="page"] { text-decoration: underline }` treffen beide den Link der aktuellen Seite.
- **Gewinner:** `nav a[aria-current="page"]`, der Link ist unterstrichen. In den DevTools ist `text-decoration: none` durchgestrichen.
- **Warum:** Spezifität (0,1,2) gegen (0,0,2). Der Attribut-Selektor zählt wie eine Klasse, die Reihenfolge im Stylesheet spielt keine Rolle.

## Komponenten (Übungsblatt 4, A3)

| Komponente | Wo sie vorkommt | Einheitlich über |
| --- | --- | --- |
| **Navbar** (`.nav-link`) | im Header aller vier Seiten | `px-4 py-2`, `rounded-xl`, `border-2`, Hover gefüllt in `akzent` |
| **Karte** (`.karte`) | Pokémon-Karten in `pokedex.html` und den Ergebnissen von `suche.html`, Kacheln auf `index.html`, Suchformular | `bg-flaeche`, `p-4`, `rounded-xl` |
| **Button** (`.btn` + `.btn-primaer` / `.btn-sekundaer`) | Suchen/Zurücksetzen in `suche.html` | gleiche Maße wie die Nav-Links (`px-4 py-2`, `rounded-xl`, `border-2`); primär gefüllt, sekundär transparent und beim Hover gefüllt wie die Nav-Links |

Seit Teil B sind die Komponenten in `style.css` unter `@layer components` per `@apply` aus Tailwind-Utilities gebaut.

## Tailwind-Build (Übungsblatt 4, B)

Tailwind läuft über `@tailwindcss/vite` statt über das Play CDN. `style.css` ist der Einstieg (`@import "tailwindcss"`, eigene Tokens in `@theme`).

| | Größe | gzip |
| --- | --- | --- |
| **`dist/assets/app-*.css` mit Tailwind-Build** | **9,53 kB** | **2,72 kB** |
| vorher: eigenes CSS ohne Tailwind | 3,27 kB | 1,14 kB |
| vorher: Play-CDN-Skript (`@tailwindcss/browser@4`, wird im Browser ausgeführt) | 282 kB | 74 kB |

Davon sind rund 3,7 kB Preflight (Tailwinds Reset), 1,7 kB eigene Grundregeln, 2,0 kB die Komponenten und nur 1,3 kB die eigentlichen Utilities (27 Klassen).

**Warum so klein, obwohl Tailwind tausende Klassen kennt:** Tailwind enthält keine fertige CSS-Datei mit allen Klassen. Beim Build durchsucht es die Quelldateien (bei uns per `@source` nur `*.html` und `app.js`) und erzeugt nur die Klassen, die dort tatsächlich vorkommen. Ungenutzte Theme-Variablen werden weggelassen, die Farbpalette ist mit `--color-*: initial` auf unsere fünf Farben beschränkt, und Vite minifiziert das Ergebnis. Das Play CDN muss dagegen den ganzen Compiler mitliefern und die Klassen bei jedem Seitenaufruf im Browser erzeugen.

## KI-Log

Ehrlich ausfüllen, das zählt zur Bewertung.

| Werkzeug | Wofür benutzt |
| --- | --- |
| Claude (Chat) | Ideenfindung |
| Claude | Überblick und Korrekturvorschläge der HTML-Semantik |

**Ein Fall, in dem KI geholfen hat:** Was habt ihr gefragt, was kam zurück, was habt ihr geändert?

**Ein Fall, in dem KI falsch lag:** Woran habt ihr es gemerkt, wie habt ihr es gelöst?
