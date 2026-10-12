# Übungsblatt 2 – Lösung

## Teil A · Pflicht

### A1 Seiten und Navigation 

Wir haben vier Seiten gebaut:

| Seite | Inhalt |
| --- | --- |
| `index.html` | Startseite: Begrüßung, was man hier machen kann, Datenquelle, ... |
| `suche.html` | Suchformular mit Filtern und Bereich für die Ergebnisse |
| `pokedex.html` | Alle Pokémon, aufsteigend nach Nummer aufeglistet |
| `ueber.html` | Infos zum Projekt |

Jede Seite hat:

- das Grundgerüst mit `lang="de"`, `charset="utf-8"`, `viewport` und `title`
- `header` mit `nav`, ein `main` und ein `footer`
- genau eine `h1`, darunter `section`s mit `h2` und, wo nötig, `article`s mit `h3`
- dieselbe Navigation als Liste (`ul` > `li` > `a`), sodass man von jeder Seite zu jeder anderen kommt. Die aktuelle Seite ist mit `aria-current="page"` markiert.

### A2 Ein Formular, das sich selbst prüft 

Das Suchformular auf `suche.html`, nach dem Muster aus dem Baustein `t2-formular`:

| Feld | `type` | `name` | Einschränkung |
| --- | --- | --- | --- |
| Name | `search` | `name` | `required` + `minlength="3"` |
| Nummer | `number` | `nummer` | `min="1"` + `max="1025"` |
| E-Mail | `email` | `mail` | Browser prüft das E-Mail-Format |
| Typ | `select` | `typ` | – |
| Generation | `select` | `generation` | – |

- Jedes Feld hat ein `label`, dessen `for` auf die `id` des Feldes zeigt. Deshalb setzt ein Klick auf „E-Mail“ den Cursor ins Feld.
- Abgeschickt wird mit `<button type="submit">Suchen</button>`. Mit `action="suche.html" method="get"` landen die Werte in der URL, z. B. `suche.html?name=Pikachu&nummer=25`.

Bsp.: Leerer Name → Absenden scheitert. „Pi“ → der Browser meckert über die Mindestlänge. „Pikachu“ → das Absenden klappt.

### A3 Barrierefreiheits-Durchgang 

- **Lighthouse**: **100 Punkte für alle Seiten.** Die Seiten sind aktuell aber noch nicht sehr ansprechend und besitzen nur ein Grundgerüst.
- **Tastatur:** Mit `Tab` und `Shift+Tab` erreicht man alle Links und Formularfelder, `Enter` folgt Links und schickt das Formular ab. 

### A4 Der `head` und die Maschinen 

Jede Seite hat einen eigenen `title` (Muster „Seite – Pokédex“) und eine eigene `meta name="description"`:

| Seite | `title` |
| --- | --- |
| `index.html` | Pokédex – Pokémon entdecken und suchen |
| `suche.html` | Suche – Pokédex |
| `pokedex.html` | Alle Pokémon nach Nummer – Pokédex |
| `ueber.html` | Über das Projekt – Pokédex |

Im Wurzelverzeichnis liegen:

- `robots.txt` mit `User-agent: *`, `Allow: /` und einem Verweis auf die Sitemap
- `sitemap.xml` mit allen vier Seiten

Die vollständigen Adressen in beiden Dateien gehen von GitHub Pages aus (`https://julianroedger.github.io/webengineering_dhbw/`). 

## Teil B · Bonus

- **`llms.txt`** im Wurzelverzeichnis: kurze Beschreibung des Projekts mit allen Seiten und der Datenquelle (PokeAPI).
- **JSON-LD** im `head` von `index.html`: ein schema.org-Block vom Typ `WebSite` mit Name, URL, Beschreibung, Sprache, einer `SearchAction`, die auf `suche.html?name=…` zeigt und einer `ViewAction` auf `pokedex.html`.
- **Rich Results Test:** `index.html` in den Test eingefügt. Der Screenshot ist in der README.

## Teil C · Verständnisfragen

### 1. Warum ist `<button>` besser als `<div onclick="...">`?

Ein `<button>` bringt Verhalten und Bedeutung von Haus aus mit, ein `<div>` ist nur ein leerer Kasten:

- **Tastaturbedienung:** Ein `<button>` ist automatisch per `Tab` erreichbar und lässt sich mit `Enter` und Leertaste auslösen. Ein `<div>` wird beim Tabben übersprungen. 
- **Screenreader:** Ein `<button>` wird als „Schaltfläche“ angesagt, Nutzer wissen also, dass man darauf klicken kann. Ein `<div>` wird nur als Text vorgelesen.

Außerdem kann ein `<button type="submit">` ein Formular abschicken und löst dabei die eingebaute Validierung aus (`required`, `minlength` …), ganz ohne JavaScript.

### 2. Wofür ist das `name`-Attribut in einem Formular da – und was passiert, wenn es fehlt?

`name` legt fest, unter welchem Schlüssel der Wert eines Feldes beim Absenden übertragen wird. Bei `method="get"` steht das direkt in der URL:

```
suche.html?name=Pikachu&nummer=25&typ=elektro
```

Fehlt `name`, wird das Feld beim Absenden einfach weggelassen. Der Browser zeigt es an und prüft es auch, aber der Wert kommt nie an. Das passiert ohne Fehlermeldung, deshalb fällt es leicht nicht auf.

### 3. Ihr habt zwei `h1` auf einer Seite. Wen stört das, und warum?

Die `h1` ist die Hauptüberschrift und sagt, worum es auf der Seite geht. Zwei davon machen unklar, welches Thema das eigentliche ist.

- **Screenreader-Nutzer:** Sie springen oft über die Überschriften durch eine Seite, z. B. mit der Taste `1` direkt zur `h1`. Bei zwei `h1` fehlt der eindeutige Einstieg.
- **Suchmaschinen:** Sie nutzen die `h1`, um das Hauptthema der Seite zu bestimmen. Zwei konkurrierende `h1` machen es unklar, was das wichtigste Thema auf der Seite ist.
- **Andere Entwickler:** Wer den Code oder die Gliederung in den DevTools liest, erkennt nicht mehr auf einen Blick, wie die Seite aufgebaut ist.
