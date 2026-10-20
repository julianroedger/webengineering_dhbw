# Übungsblatt 3 – Lösung

## Teil A · Pflicht

### A1 Ein Stylesheet für alles

- `style.css` ist auf allen vier Seiten mit `<link rel="stylesheet" href="style.css">` eingebunden.
- Ganz oben steht `* { box-sizing: border-box; }`, damit `padding` und `border` in die Breite eingerechnet werden.
- Alle Farben, Abstände, Radien und Schriftgrößen sind Variablen in `:root`:

| Variable | Wert | Wofür |
| --- | --- | --- |
| `--bg` | `#ffffff` | Hintergrund |
| `--text` | `#1f1f1f` | Text, Linie unter dem Header |
| `--text-leise` | `#5f6368` | Footer, Hinweise, Formularrahmen |
| `--flaeche` | `#f4f5f7` | Karten, Navigation, Formular |
| `--akzent` | `#c8102e` | Links, Hover, Fokus, Badge, Buttons |
| `--abstand` / `--radius` | `1rem` / `12px` | Abstände, Ecken |
| `--schrift-klein/normal/gross` | `0.875rem` / `1rem` / `2rem` | die drei Schriftgrößen |

Eine Akzentfarbe (Pokédex-Rot), drei Schriftgrößen (`h2`/`h3` nur fett). Test: `--akzent` auf `green` → alles Rote wird grün.

### A2 Navigation gestalten

- `nav ul` ist ein Flex-Container mit `gap` und `flex-wrap: wrap`, die Links haben `padding`.
- `:hover`: Hintergrund `--akzent`, Text `--bg`.
- `:focus-visible`: `outline: 3px solid var(--akzent)` mit `outline-offset`. Das gilt für alle fokussierbaren Elemente, der Rahmen wird nie entfernt.
- `html { scroll-padding-top: 8rem; }`: Beim Tabben verschwindet das fokussierte Element nicht hinter dem Sticky Header.
- Die aktuelle Seite (`aria-current="page"`) ist fett und unterstrichen.

### A3 Box-Modell in eurem Layout

- `article`s und das Formular sind Karten mit `padding`, `border-radius` und `--flaeche` als Hintergrund. Die Abstände kommen von `margin-bottom` (Karten) und `gap` (Nav, Filter).
- `main { max-width: 65ch; margin-inline: auto; }`
- Bei 360 px: `img { max-width: 100%; }`, `flex-wrap: wrap` und Formularfelder mit `width: 100%` → kein horizontales Scrollen.

### A4 Sticky Header und ein Badge

```css
header { position: sticky; top: 0; z-index: 10; background: var(--bg); }
```

Ohne Hintergrund würde der Inhalt beim Scrollen durchscheinen.

**Badge:** Die Pokédex-Nummer (`figcaption`) sitzt oben rechts in der Karte. Das `article` hat `position: relative`, die `figcaption` hat `position: absolute; top/right: var(--abstand)`.

### A5 Eine Kollision nachweisen

(steht auch in der README)

```css
nav a { text-decoration: none; }                            /* (0,0,2) */
nav a[aria-current="page"] { text-decoration: underline; }  /* (0,1,2) */
```

Der Attribut-Selektor gewinnt, weil er wie eine Klasse zählt: 1 gegen 0 in der mittleren Spalte. Die Reihenfolge spielt keine Rolle. In den DevTools ist `text-decoration: none` durchgestrichen.

Hier entscheidet wirklich die Reihenfolge: `input, select { background: … }` und `select { background-image: … }` haben beide (0,0,1). `select` steht weiter unten und gewinnt, deshalb ist der Dropdown-Pfeil sichtbar.

## Teil B · Bonus

Im Dark Mode werden nur die Farbvariablen neu gesetzt:

```css
@media (prefers-color-scheme: dark) {
  :root { --bg: #1b1d24; --text: #f2f2f2; --text-leise: #a8adb7; --flaeche: #262a33; --akzent: #ff5c6c; }
}
```

Das Rot ist heller, damit es auf Dunkel lesbar bleibt. Prüfen: DevTools → `Cmd + Shift + P` → „Emulate CSS prefers-color-scheme: dark“.

## Teil C · Verständnisfragen

**1. `nav a { color: grey }` vs. `.aktiv { color: blue }`?**
`.aktiv` gewinnt (blau). Die Spezifität ist (0,1,0) gegen (0,0,2), eine Klasse schlägt beliebig viele Elemente. Die Reihenfolge zählt nur bei gleicher Spezifität.

**2. Warum `rem` statt `px`?**
`rem` richtet sich nach der Schriftgröße, die im Browser eingestellt ist (Standard 16px). Wer wegen einer Sehschwäche z. B. 24px einstellt, bekommt mit `rem` die ganze Seite größer. Mit `px` wird die Einstellung ignoriert. Der Seiten-Zoom funktioniert bei beiden.

**3. `z-index: 999` wirkt nicht?**
- Das Element ist nicht positioniert (`position: static`). `z-index` wirkt nur mit `relative/absolute/fixed/sticky` oder bei Flex-/Grid-Kindern.
- Oder es sitzt in einem anderen Stapelkontext. Ein Elternteil mit z. B. `z-index`, `opacity < 1` oder `transform` begrenzt das Kind, egal wie hoch dessen Wert ist.
