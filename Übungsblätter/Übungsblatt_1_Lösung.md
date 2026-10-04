# Übungsblatt 1 – Lösung

## Teil C · Verständnisfragen

### 1. `file:///Users/.../index.html` vs. `http://localhost:5500`

`file://` bedeutet: Der Browser liest die Datei direkt von der Festplatte, ohne Server und ohne HTTP. `http://localhost:5500` bedeutet: Ein lokaler Webserver (Live Server) liefert die Datei über HTTP aus, wie bei einer echten Website.

Unterschiede in der Praxis:

- Bei `file://` blockieren Browser oft `fetch()` und ES-Module, weil die Seite keinen richtigen Origin hat (CORS).
- Absolute Pfade wie `/style.css` zeigen bei `file://` auf das Wurzelverzeichnis der Festplatte.
- Live Server lädt die Seite beim Speichern automatisch neu.

Für den Pokédex mit `fetch` ist daher ein lokaler Server praktisch Pflicht.

### 2. Wozu dient `lang="de"` im `<html>`-Tag?

Das Attribut gibt an, in welcher Sprache die Seite geschrieben ist. Zwei Stellen, an denen das einen Unterschied macht:

- **Screenreader** wählen die passende Aussprache und lesen den Text deutsch vor.
- **Silbentrennung** (`hyphens: auto`) funktioniert nur mit angegebener Sprache.

Außerdem nutzen Rechtschreibprüfung, Übersetzungsangebote des Browsers und Suchmaschinen die Angabe.

### 3. `git commit` vs. `git push`

`git commit` speichert einen Stand in der **lokalen** Historie. `git push` überträgt die Commits, die im entfernten Repo (GitHub) noch fehlen.

Wenn man nur committet, liegen die Commits nur auf dem eigenen Rechner:

- Das Teammitglied und der Dozent sehen sie nicht auf GitHub.
- Bei einem Defekt des Rechners sind sie verloren.
