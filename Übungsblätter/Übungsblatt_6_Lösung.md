# Übungsblatt 6 – Lösung

## Teil A · Pflicht

### A1 JavaScript einbinden

`app.js` ist auf allen vier Seiten im `head` eingebunden:

```html
<script type="module" src="app.js"></script>
```

Statt `defer` steht hier `type="module"`, weil Vite nur Module bündelt (ein klassisches `<script src="…" defer>` würde beim Build nicht nach `dist/assets/` übernommen). Module-Scripts werden automatisch wie `defer` behandelt: Sie laden parallel und laufen erst, wenn das HTML fertig geparst ist.

- Konsole beim Laden: `app.js läuft`
- `document.querySelector("#jahr")` findet das `span` im Footer (nicht `null`) und schreibt das aktuelle Jahr hinein.

### A2 Ein Formular ohne Reload

Das Suchformular aus Blatt 2 (`suche.html`, `#suchformular`) wird in `app.js` abgefangen:

- `submit`-Event mit `event.preventDefault()`: Die Seite lädt nicht neu, die Adresszeile bleibt unverändert (kein `?name=…` mehr).
- **Auslesen:** `new FormData(formular)` mit Name, Nummer, Typ und Generation.
- **Prüfen:** Mindestens ein Kriterium muss gesetzt sein, der Name braucht mindestens 3 Zeichen, die Nummer muss zwischen 1 und 151 liegen. Fehler erscheinen im `#status`-Absatz (`role="status"`, wird also auch vorgelesen).
- **Verarbeiten:** Beim ersten Absenden werden die ersten 151 Pokémon von der PokeAPI geladen (`/pokemon/{id}` für die Typen, `/pokemon-species/{id}` für deutschen Namen und Generation), danach wird nur noch lokal gefiltert. Der Name passt auf deutsche und englische Namen, auch auf Teile davon („glu“ findet Glumanda, Glutexo, Glurak).
- **Ausgabe:** Die Karten werden mit `createElement` und `textContent` gebaut, nirgends mit `innerHTML`.

Am HTML geändert: `required` am Namensfeld entfernt (sonst wäre eine Suche nur nach Nummer oder Typ nicht möglich, die Prüfung macht jetzt JavaScript), `max` der Nummer von 1025 auf 151, passend zu den Daten.

Zusatz: Der Aufruf `suche.html?name=pika` aus der `SearchAction` in den strukturierten Daten (Blatt 3) füllt das Feld und startet die Suche direkt.

### A3 Ein Zustand, eine Zeichenfunktion

Alles, was die Anzeige auf der Suchseite bestimmt, steht in einem Objekt:

```js
const state = {
  status: "",     // Text im Status-Absatz
  ergebnisse: [], // Treffer der letzten Suche
  merkliste: [],  // gemerkte Pokémon
};
```

`render()` baut daraus die komplette Anzeige: Status, Trefferliste, Merkliste, Zähler („2 Pokémon gemerkt.“) und ob „Merkliste leeren“ sichtbar ist. Jede Änderung läuft über `aendere({...})`: Zustand ändern, speichern, `render()`. Es gibt keine Stelle, die den DOM direkt ändert.

An demselben Zustand hängen:

- **Merkliste und Zähler:** beide aus `state.merkliste`
- **Trefferliste und Merkliste:** Ein Treffer zeigt „Merken“ oder „Entfernen“, je nachdem, ob er in `state.merkliste` steht. Entfernt man ihn in der Merkliste, wechselt auch der Knopf in den Treffern.

Die Klicks auf „Merken“/„Entfernen“ fängt je ein Listener pro Liste ab (Event Delegation über `data-aktion` und `data-id`), weil die Knöpfe bei jedem `render()` neu entstehen.

Geprüft: Merken, Entfernen (in der Merkliste und in den Treffern), Leeren und Zurücksetzen. Liste und Zähler passen nach jeder Aktion zusammen.

### A4 Fünf Fehler finden

TODO

### A5 KI-Log anfangen

Der Abschnitt „KI-Log“ steht in der README und wurde um Blatt 6 ergänzt.

Ein Fehler, den die KI gemacht hatte: Bei der Suche hat die KI nur die Suche nach Name zugelassen, nicht nach Typ oder Generation, da der submit-Handler zu streng war.

## Teil B · Bonus

Die Merkliste übersteht einen Reload: Bei jeder Änderung wird sie in `localStorage` unter `pokedex-merkliste` gespeichert, beim Start gelesen.

```json
{ "version": 1, "pokemon": [{ "id": 4, "name": "Glumanda", "englisch": "charmander", "typen": ["feuer"], "generation": 1 }] }
```

**Was passiert, wenn dort etwas steht, das nicht mehr zum Code passt?** Ohne Prüfung würde `JSON.parse` bei kaputtem JSON eine Exception werfen, und ein altes Format (z. B. ein Array statt Objekt oder Typen auf Englisch) würde in `render()` abstürzen oder „undefined“ anzeigen. Damit wäre die ganze Seite kaputt, und zwar bei jedem Laden wieder, bis jemand den Speicher von Hand löscht.

Abgefangen wird das in `ladeMerkliste()`:

| Fall | Verhalten |
| --- | --- |
| Kein Eintrag | leere Merkliste |
| Kein gültiges JSON | `try/catch`, Eintrag wird gelöscht, leere Merkliste |
| Andere `version` oder kein `pokemon`-Array | Eintrag wird gelöscht, leere Merkliste |
| Einzelne Einträge passen nicht (fehlende Felder, ID außerhalb 1–151, unbekannter Typ wie `"fire"`) | nur diese Einträge werden verworfen, der Rest bleibt |
| Doppelte IDs | nur der erste bleibt |
| `localStorage` nicht verfügbar (z. B. privater Modus) | `try/catch`, die Seite funktioniert ohne Speichern |

In jedem Fall gibt es eine Warnung in der Konsole. Wenn sich das Format später ändert, wird `SPEICHER_VERSION` erhöht, und alte Daten werden sauber verworfen statt falsch gelesen.

## Teil C · Verständnisfragen

**1. Was ist der Unterschied zwischen `textContent` und `innerHTML`, und warum ist der zweite bei fremden Daten gefährlich?**

`textContent` setzt reinen Text: Alles wird genau so angezeigt, wie es im String steht, auch `<` und `>`. `innerHTML` lässt den Browser den String als HTML parsen und daraus Elemente bauen. Kommt der String von außen (Formulareingabe, URL-Parameter, API, `localStorage`), kann dort HTML stehen, das Code ausführt, z. B. `<img src=x onerror="…">`. Das ist Cross-Site-Scripting (XSS): Fremder Code läuft mit den Rechten unserer Seite, kann Daten auslesen oder die Seite verändern. Bei uns käme z. B. `suche.html?name=…` direkt aus einem Link, den jemand anderes gebaut hat.

**2. Was macht `event.preventDefault()` bei einem `submit`, und was passiert ohne?**

Es verhindert die Standardaktion des Browsers beim Absenden: das Formular an die `action`-URL schicken und die Antwort als neue Seite laden. Ohne `preventDefault()` würde der Browser `suche.html?name=glu&nummer=&typ=…` neu laden. Unser JavaScript würde zwar kurz anlaufen, aber durch den Reload wäre alles weg: Ergebnisse, Status und alle Variablen, und die Adresszeile ändert sich.

**3. Warum steht `defer` am Script-Tag? Was passiert ohne, wenn das Script im `head` steht?**

Ohne `defer` hält der Browser beim `<script>` im `head` an, lädt das Script, führt es aus und parst erst danach den Rest der Seite. Zu diesem Zeitpunkt gibt es den `body` noch nicht, `document.querySelector("#jahr")` liefert `null`, und z. B. `addEventListener` auf `null` wirft einen Fehler. Außerdem bleibt die Seite weiß, solange das Script lädt. Mit `defer` lädt das Script parallel zum HTML und läuft erst, wenn das ganze Dokument geparst ist (kurz vor `DOMContentLoaded`), alle Elemente sind dann da. Bei uns erledigt das `type="module"`, das sich automatisch wie `defer` verhält.
