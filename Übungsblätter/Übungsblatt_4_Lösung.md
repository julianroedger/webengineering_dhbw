# Übungsblatt 4 – Lösung

## Teil A · Pflicht

### A1 Layout mit Flexbox und Grid

**Flexbox:**

- Navigation: `nav ul { display: flex; flex-wrap: wrap; gap: var(--abstand); }`. Wird es zu eng, rutschen die Links in die nächste Zeile.
- Button-Leiste im Suchformular: `.button-leiste { display: flex; flex-wrap: wrap; gap: var(--abstand); }`.
- Filter im Formular: `fieldset` ist Flex-Container, jedes Feld hat `flex: 1 1 12rem`. Schmal liegen sie untereinander, breit nebeneinander.

**Grid:** Pokémon-Liste (`pokedex.html`), Suchergebnisse (`suche.html`) und die Kacheln auf der Startseite nutzen die Klasse `.raster`:

```css
.raster {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--karte-min), 1fr)); /* 14rem */
  gap: var(--abstand);
}
```

Das kommt ohne Media Query aus. Der Browser setzt so viele Spalten, wie Karten mit mindestens 14rem nebeneinander passen, und verteilt den Rest gleichmäßig (`1fr`).

Damit bei 1280 px überhaupt mehrere Spalten Platz haben, ist `main` jetzt bis `72rem` breit. Fließtext und Formular bleiben mit `max-width: 65ch` lesbar.

| Breite | Ergebnis |
| --- | --- |
| 360 px | 1 Spalte, Nav-Links umbrechen, Filter untereinander |
| 768 px | 3 Spalten Karten, Filter nebeneinander |
| 1280 px | 4 Spalten (1120 px Inhalt / (14rem + gap)) |

### A2 Tailwind einbinden

Eingebunden über das Play CDN (Tailwind 4), nur auf `pokedex.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">
  @layer theme, base, components, utilities;
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/utilities.css" layer(utilities);
</style>
```

Ohne diesen Block lädt das CDN `@import "tailwindcss"` und damit **Preflight**. Das setzt die Abstände von Überschriften, Absätzen und Listen auf der ganzen Seite zurück, und der Rest der Seite sähe anders aus. Deshalb nur Theme und Utilities.

**Stolperfalle Kaskade:** Tailwind legt seine Klassen in `@layer utilities`. Ungelayertes CSS gewinnt immer gegen Layer, egal wie spezifisch. Ein `article { background: … }` in `style.css` hätte also die Tailwind-Karte überschrieben. Deshalb hängen die Kartenstyles jetzt an der Klasse `.karte` statt am Element `article`.

**Vergleich:** Im Abschnitt „Vergleich: eigenes CSS und Tailwind“ auf `pokedex.html` stand dieselbe Pikachu-Karte zweimal nebeneinander. Seit Teil B ist alles Tailwind, deshalb wurde der Abschnitt wieder entfernt. Die Zuordnung bleibt hier dokumentiert.

| Tailwind-Klasse | CSS-Eigenschaft | eigenes CSS (`.karte`) |
| --- | --- | --- |
| `relative` | `position: relative` | `position: relative` |
| `rounded-xl` | `border-radius: 0.75rem` (12px) | `border-radius: var(--radius)` |
| `bg-(--flaeche)` | `background-color: var(--flaeche)` | `background: var(--flaeche)` |
| `p-4` | `padding: 1rem` | `padding: var(--abstand)` |
| `absolute` | `position: absolute` | `position: absolute` |
| `top-4` / `right-4` | `top: 1rem` / `right: 1rem` | `top/right: var(--abstand)` |
| `bg-(--akzent)` | `background-color: var(--akzent)` | `background: var(--akzent)` |
| `text-(--bg)` | `color: var(--bg)` | `color: var(--bg)` |
| `px-2` / `py-[0.2rem]` | `padding-inline: 0.5rem` / `padding-block: 0.2rem` | `padding: 0.2rem 0.5rem` |
| `text-sm/normal` | `font-size: 0.875rem; line-height: 1.5` | `font-size: var(--schrift-klein)` (Zeilenhöhe 1.5 geerbt) |
| `font-[ui-monospace,monospace]` | `font-family: ui-monospace, monospace` | `font-family: ui-monospace, monospace` |

Achtung bei `text-sm`: Ohne `/normal` setzt Tailwind zusätzlich eine eigene `line-height` (1.25rem), dann wäre die Badge etwas flacher als im Original.

`bg-(--flaeche)` ist die Tailwind-4-Schreibweise für CSS-Variablen (in Tailwind 3 hieß das `bg-[var(--flaeche)]`). So nutzen beide Karten dieselben Farben inklusive Dark-Theme.

**Vite und das Play CDN:** Vite verarbeitet jeden Inline-`<style>`-Block selbst und bricht an `@import "tailwindcss/theme.css"` ab, weil die Datei lokal nicht existiert. Ein kleines Plugin in `vite.config.js` nimmt den `text/tailwindcss`-Block vor der Verarbeitung heraus (`transformIndexHtml`, `order: "pre"`) und setzt ihn danach unverändert wieder ein (`order: "post"`).

### A3 Drei Komponenten

Steht auch in der README.

| Komponente | Wo | Vereinheitlicht |
| --- | --- | --- |
| Navbar | Header aller vier Seiten | Innenabstand `--innen-abstand`, `--radius`, 2px Rahmen (transparent), Hover gefüllt in `--akzent` |
| Karte (`.karte`) | Pokémon-Karten, Suchergebnisse, Startseiten-Kacheln, Suchformular | `--flaeche`, `--abstand`, `--radius` |
| Button | Suchen/Zurücksetzen | gleiche Maße wie Nav-Links (`--innen-abstand`, `--radius`, `--rahmen`) |

Vorher hatten Nav-Links `0.5rem 1rem` Innenabstand, Buttons `0.5rem 1.25rem`. Jetzt nutzen Links, Buttons und Formularfelder alle `--innen-abstand: 0.5rem 1rem` und dieselbe Rahmenbreite `--rahmen: 2px`. Nav-Links haben einen transparenten Rahmen, damit sie genauso hoch sind wie Buttons.

Es gibt zwei Button-Varianten, weil sie Unterschiedliches tun:

- **primär** (Suchen): gefüllt, beim Hover leicht transparent
- **sekundär** (Zurücksetzen, Nav-Links): transparent, beim Hover gefüllt in `--akzent`

### A4 npm und ein Build

`npm create vite@latest` legt ein neues Projekt mit Template-Dateien an. Weil das Projekt schon existiert, wurde das Gleiche von Hand im Root eingerichtet:

```bash
npm init -y
npm install -D vite
```

`package.json` (gekürzt):

```json
{
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "devDependencies": { "vite": "^8.3.4" }
}
```

`vite.config.js` listet alle vier HTML-Seiten als Einstiegspunkte (`build.rollupOptions.input`). Ohne diese Liste baut Vite nur `index.html`. `base: "./"` sorgt für relative Pfade, damit `dist/` auch unter `/webengineering_dhbw/` auf GitHub Pages läuft.

`app.js` wird jetzt mit `<script type="module" src="app.js">` eingebunden. Ein klassisches Script ohne `type="module"` bündelt Vite nicht, es würde in `dist/` fehlen. `type="module"` lädt automatisch wie `defer`.

**`npm run build`:**

```
dist/ueber.html               1.92 kB
dist/index.html               2.97 kB
dist/suche.html               4.71 kB
dist/pokedex.html             6.16 kB
dist/assets/app-DIcCxdf9.css  3.27 kB
dist/assets/app-BANigKpm.js   0.78 kB
```

**Was in `dist/` liegt:**

- die vier HTML-Seiten, deren Verweise auf `style.css`/`app.js` durch die gebauten Dateien ersetzt wurden
- `assets/` mit dem gebündelten und minifizierten CSS und JS. Der Hash im Dateinamen (`app-DIcCxdf9.css`) ändert sich mit dem Inhalt, so lädt der Browser nach einer Änderung nie eine alte Version aus dem Cache.

`robots.txt`, `sitemap.xml` und `llms.txt` sind nicht dabei. Vite kopiert nur, was eingebunden ist oder in `public/` liegt. Nach Teil A lagen sie noch im Root. In Teil B sind sie nach `public/` umgezogen und landen seitdem in `dist/`.

**Git:** `node_modules/` und `dist/` stehen in `.gitignore`. `package-lock.json` wird mit eingecheckt. `git status` zeigt nur `package.json`, `package-lock.json` und `vite.config.js` als neue Dateien, kein `node_modules`.

## Teil B · Bonus

Das Projekt nutzt jetzt vollständig Vite mit dem Tailwind-Build. Das Play CDN und das Durchreich-Plugin für den `text/tailwindcss`-Block sind entfernt.

### Pakete

Vor der Installation geprüft (wie im KI-Hinweis des Blatts verlangt):

| Paket | npm-Seite | Downloads/Woche | letzte Version |
| --- | --- | --- | --- |
| `tailwindcss` | https://www.npmjs.com/package/tailwindcss | ca. 85 Mio. | 4.3.3 (19.10.2026) |
| `@tailwindcss/vite` | https://www.npmjs.com/package/@tailwindcss/vite | ca. 30 Mio. | 4.3.3 (19.10.2026) |

Beide stammen aus dem offiziellen Repo `tailwindlabs/tailwindcss`. `@tailwindcss/vite` unterstützt Vite 5 bis 8.

```bash
npm install -D tailwindcss @tailwindcss/vite
```

### Setup (Tailwind 4)

Tailwind 4 kommt ohne `tailwind.config.js` und PostCSS-Config aus. Es reicht das Vite-Plugin plus ein CSS-Import.

```js
// vite.config.js
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({ plugins: [tailwindcss()], /* … */ });
```

```css
/* style.css */
@import "tailwindcss" source(none);
@source "./*.html";
@source "./app.js";

@theme {
  --color-*: initial;
  --color-akzent: #c8102e;
  /* … */
}
```

- **`@theme`** ersetzt die alten `:root`-Variablen. Aus `--color-flaeche` wird automatisch `bg-flaeche`, `text-flaeche` usw., aus `--text-klein` wird `text-klein`. Abstände und Radius nutzen die Standardskala: `p-4` = 1rem, `px-4 py-2` = 0.5rem 1rem, `rounded-xl` = 12px, `border-2` = 2px.
- **Dark-Theme:** In `@layer base` werden die `--color-…`-Variablen unter `prefers-color-scheme: dark` überschrieben. Alle Utilities nutzen `var(--color-…)` und schalten dadurch automatisch um.
- **Preflight** ist jetzt aktiv (Standard-Setup). Damit die Seite gleich aussieht, stellen Base-Regeln die vorherigen Browser-Standardabstände wieder her, z. B. `h1 { @apply my-[0.67em] … }`, `p { @apply my-4 }`, `figure { @apply mx-10 my-4 }`, `img { @apply inline align-baseline }`.
- **Komponenten** (A3) liegen in `@layer components` und bestehen aus Utilities, z. B. `.btn { @apply cursor-pointer rounded-xl border-2 border-akzent px-4 py-2 font-bold; }`. Alles Einmalige steht direkt als Utility im HTML, z. B. `<header class="sticky top-0 z-10 border-b-4 border-schrift bg-hintergrund">`.
- **`.raster`** nutzt `grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]`, das Grid aus A1 als Arbitrary Value.

### Deployment

Mit dem Build braucht die Seite den Build-Schritt. GitHub Pages liefert deshalb nicht mehr den Root aus, sondern `dist/`:

- `.github/workflows/deploy.yml` baut bei jedem Push auf `main` (`npm ci`, `npm run build`) und deployt `dist/` mit `actions/upload-pages-artifact` und `actions/deploy-pages`.
- `robots.txt`, `sitemap.xml` und `llms.txt` liegen jetzt in `public/`. Vite kopiert diesen Ordner unverändert nach `dist/`, die URLs bleiben gleich.

### Die erzeugte CSS-Datei

```
dist/assets/app-D2WIFpQq.css  9.53 kB │ gzip: 2.72 kB
```

| Teil der Datei | Größe |
| --- | --- |
| Preflight (Reset) | ca. 3,7 kB |
| eigene Base-Regeln (Dark-Theme, Abstände, Select-Pfeil) | ca. 1,7 kB |
| Komponenten (`.nav-link`, `.btn`, `.karte`, …) | ca. 2,0 kB |
| Utilities (27 Klassen) | ca. 1,3 kB |
| Theme-Variablen und `@property`-Definitionen | ca. 0,7 kB |

Zum Vergleich: Das Play-CDN-Skript ist 282 kB groß (gzip 74 kB) und erzeugt die Klassen bei jedem Seitenaufruf im Browser.

**Warum sie so klein bleibt:**

1. **Nur benutzte Klassen:** Tailwind erzeugt nichts auf Vorrat. Der Build scannt die per `@source` angegebenen Dateien nach Klassennamen und erzeugt nur deren CSS. Steht `bg-red-500` nirgends im HTML, gibt es auch kein CSS dafür.
2. **Nur benutzte Theme-Variablen:** Von den hunderten Standard-Variablen (Farben, Abstände, Schriften) landen nur die genutzten in `:root`. Durch `--color-*: initial` existieren gar nur unsere fünf Farben.
3. **Minifizierung:** Vite entfernt Leerzeichen und Kommentare und kürzt Werte (`#ffffff` wird zu `#fff`).

Deshalb dürfen Klassennamen auch nie zusammengesetzt werden (z. B. `"bg-" + farbe` in `app.js`): Der Scanner findet nur vollständige Klassennamen im Quelltext.

