// app.js – wird auf allen Seiten geladen (Übungsblatt 6)
// Seitenspezifischer Code prüft vorher, ob seine Elemente auf der Seite existieren.

console.log("app.js läuft");

// A1: querySelector findet ein Element (nicht null)
const jahr = document.querySelector("#jahr");
if (jahr) jahr.textContent = new Date().getFullYear();

/* ------------------------------------------------------------------ */
/* Daten: die ersten 151 Pokémon von der PokeAPI                        */
/* ------------------------------------------------------------------ */

const API = "https://pokeapi.co/api/v2";
const ANZAHL = 151;
const BILD_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// englischer API-Name -> [Schlüssel wie im <select>, deutsche Anzeige]
const TYPEN = {
  normal: ["normal", "Normal"],
  fire: ["feuer", "Feuer"],
  water: ["wasser", "Wasser"],
  grass: ["pflanze", "Pflanze"],
  electric: ["elektro", "Elektro"],
  ice: ["eis", "Eis"],
  fighting: ["kampf", "Kampf"],
  poison: ["gift", "Gift"],
  ground: ["boden", "Boden"],
  flying: ["flug", "Flug"],
  psychic: ["psycho", "Psycho"],
  bug: ["kaefer", "Käfer"],
  rock: ["gestein", "Gestein"],
  ghost: ["geist", "Geist"],
  dragon: ["drache", "Drache"],
  dark: ["unlicht", "Unlicht"],
  steel: ["stahl", "Stahl"],
  fairy: ["fee", "Fee"],
};
// Schlüssel -> deutsche Anzeige, z. B. "kaefer" -> "Käfer"
const TYP_NAME = Object.fromEntries(Object.values(TYPEN));

const ROEMISCH = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

async function holeJson(url) {
  const antwort = await fetch(url);
  if (!antwort.ok) throw new Error(`${url} antwortet mit ${antwort.status}`);
  return antwort.json();
}

// Ein Pokémon aus /pokemon/{id} (Typen) und /pokemon-species/{id} (deutscher Name, Generation)
async function ladeEinPokemon(id) {
  const [pokemon, art] = await Promise.all([
    holeJson(`${API}/pokemon/${id}`),
    holeJson(`${API}/pokemon-species/${id}`),
  ]);
  const deutsch = art.names.find((n) => n.language.name === "de");
  return {
    id,
    name: deutsch ? deutsch.name : pokemon.name,
    englisch: pokemon.name,
    typen: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => TYPEN[t.type.name]?.[0])
      .filter(Boolean),
    generation: ROEMISCH.indexOf(art.generation.name.split("-")[1].toUpperCase()),
  };
}

// Alle 151 nur einmal pro Seitenaufruf laden; weitere Suchen nutzen dasselbe Promise
let allePokemon = null;
function ladeAllePokemon() {
  if (!allePokemon) {
    const ids = Array.from({ length: ANZAHL }, (_, i) => i + 1);
    allePokemon = Promise.all(ids.map(ladeEinPokemon)).catch((fehler) => {
      allePokemon = null; // beim nächsten Versuch neu laden
      throw fehler;
    });
  }
  return allePokemon;
}

/* ------------------------------------------------------------------ */
/* Karte bauen – nur createElement + textContent, kein innerHTML         */
/* ------------------------------------------------------------------ */

function element(tag, text, klassen) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (klassen) el.className = klassen;
  return el;
}

function baueKarte(pokemon, knopf) {
  const li = document.createElement("li");
  const karte = element("article", undefined, "karte");

  const figur = document.createElement("figure");
  const bild = document.createElement("img");
  bild.src = `${BILD_URL}${pokemon.id}.png`;
  bild.alt = `Bild von ${pokemon.name}`;
  bild.width = 96;
  bild.height = 96;
  bild.loading = "lazy";
  figur.append(bild, element("figcaption", `#${String(pokemon.id).padStart(3, "0")}`));

  const daten = document.createElement("dl");
  daten.append(
    element("dt", "Typ"),
    element("dd", pokemon.typen.map((t) => TYP_NAME[t]).join(", ")),
    element("dt", "Generation"),
    element("dd", ROEMISCH[pokemon.generation]),
  );

  karte.append(element("h3", pokemon.name), figur, daten);
  if (knopf) karte.append(knopf);
  li.append(karte);
  return li;
}

function baueKnopf(text, aktion, id, klasse) {
  const knopf = element("button", text, `btn ${klasse}`);
  knopf.type = "button";
  knopf.dataset.aktion = aktion;
  knopf.dataset.id = id;
  return knopf;
}

/* ------------------------------------------------------------------ */
/* Suche + Merkliste (suche.html)                                       */
/* ------------------------------------------------------------------ */

const formular = document.querySelector("#suchformular");
if (formular) starteSuche(formular);

function starteSuche(formular) {
  const SPEICHER_SCHLUESSEL = "pokedex-merkliste";
  const SPEICHER_VERSION = 1;

  const statusAnzeige = document.querySelector("#status");
  const ergebnisListe = document.querySelector("#ergebnisse");
  const merkListe = document.querySelector("#merkliste");
  const merkZaehler = document.querySelector("#merk-zaehler");
  const leerenKnopf = document.querySelector("#merkliste-leeren");

  // A3: EIN Objekt mit allem, was die Anzeige bestimmt
  const state = {
    status: "",
    ergebnisse: [], // Treffer der letzten Suche
    merkliste: ladeMerkliste(), // gemerkte Pokémon (Teil B: aus localStorage)
  };

  // A3: EINE Funktion baut daraus die komplette Anzeige
  function render() {
    statusAnzeige.textContent = state.status;

    const gemerkt = new Set(state.merkliste.map((p) => p.id));
    ergebnisListe.replaceChildren(
      ...state.ergebnisse.map((p) =>
        gemerkt.has(p.id)
          ? baueKarte(p, baueKnopf("Entfernen", "entfernen", p.id, "btn-sekundaer"))
          : baueKarte(p, baueKnopf("Merken", "merken", p.id, "btn-primaer")),
      ),
    );

    merkListe.replaceChildren(
      ...state.merkliste.map((p) => baueKarte(p, baueKnopf("Entfernen", "entfernen", p.id, "btn-sekundaer"))),
    );

    const anzahl = state.merkliste.length;
    merkZaehler.textContent =
      anzahl === 0 ? "Noch keine Pokémon gemerkt." : `${anzahl} Pokémon gemerkt.`;
    leerenKnopf.hidden = anzahl === 0;
  }

  // Jede Änderung: Zustand ändern, speichern, neu zeichnen
  function aendere(neu) {
    Object.assign(state, neu);
    speichereMerkliste(state.merkliste);
    render();
  }

  /* ---------- A2: Formular ohne Reload ---------- */

  formular.addEventListener("submit", async (event) => {
    event.preventDefault(); // kein Neuladen, Adresszeile bleibt gleich

    // Eingabe auslesen
    const daten = new FormData(formular);
    const name = String(daten.get("name")).trim().toLowerCase();
    const nummerText = String(daten.get("nummer")).trim();
    const typ = String(daten.get("typ"));
    const generation = String(daten.get("generation"));

    // Eingabe prüfen
    if (!name && !nummerText && !typ && !generation) {
      aendere({ status: "Bitte gib einen Namen oder eine Nummer ein oder wähle einen Filter.", ergebnisse: [] });
      return;
    }
    if (name && name.length < 3) {
      aendere({ status: "Der Name braucht mindestens 3 Zeichen.", ergebnisse: [] });
      return;
    }
    const nummer = Number(nummerText);
    if (nummerText && (!Number.isInteger(nummer) || nummer < 1 || nummer > ANZAHL)) {
      aendere({ status: `Die Nummer muss zwischen 1 und ${ANZAHL} liegen.`, ergebnisse: [] });
      return;
    }

    // Verarbeiten
    aendere({ status: "Lade Pokémon …", ergebnisse: [] });
    let alle;
    try {
      alle = await ladeAllePokemon();
    } catch (fehler) {
      console.error(fehler);
      aendere({ status: "Die Pokémon-Daten konnten nicht geladen werden. Bitte später erneut versuchen." });
      return;
    }

    const treffer = alle.filter(
      (p) =>
        (!name || p.name.toLowerCase().includes(name) || p.englisch.includes(name)) &&
        (!nummerText || p.id === nummer) &&
        (!typ || p.typen.includes(typ)) &&
        (!generation || p.generation === Number(generation)),
    );

    // Ergebnis in den DOM (über render, dort nur textContent)
    aendere({
      status: treffer.length === 0 ? "Keine Treffer." : `${treffer.length} Treffer.`,
      ergebnisse: treffer,
    });
  });

  // „Zurücksetzen“ leert auch die Ergebnisse (die Merkliste bleibt)
  formular.addEventListener("reset", () => aendere({ status: "", ergebnisse: [] }));

  /* ---------- A3: Merken / Entfernen ---------- */

  // Ein Listener pro Liste statt einer pro Knopf (Event Delegation)
  function klick(event) {
    const knopf = event.target.closest("button[data-aktion]");
    if (!knopf) return;
    const id = Number(knopf.dataset.id);

    if (knopf.dataset.aktion === "merken") {
      const pokemon = state.ergebnisse.find((p) => p.id === id);
      if (pokemon && !state.merkliste.some((p) => p.id === id)) {
        aendere({ merkliste: [...state.merkliste, pokemon].sort((a, b) => a.id - b.id) });
      }
    } else if (knopf.dataset.aktion === "entfernen") {
      aendere({ merkliste: state.merkliste.filter((p) => p.id !== id) });
    }
  }
  ergebnisListe.addEventListener("click", klick);
  merkListe.addEventListener("click", klick);

  leerenKnopf.addEventListener("click", () => aendere({ merkliste: [] }));

  /* ---------- Teil B: Merkliste in localStorage ---------- */

  function speichereMerkliste(merkliste) {
    try {
      localStorage.setItem(
        SPEICHER_SCHLUESSEL,
        JSON.stringify({
          version: SPEICHER_VERSION,
          pokemon: merkliste.map(({ id, name, englisch, typen, generation }) => ({ id, name, englisch, typen, generation })),
        }),
      );
    } catch (fehler) {
      // z. B. privater Modus oder Speicher voll: die Seite funktioniert trotzdem, nur ohne Merken
      console.warn("Merkliste konnte nicht gespeichert werden:", fehler);
    }
  }

  // Liest die Merkliste und prüft jeden Eintrag. Alles, was nicht (mehr) zu unserem Code passt
  // – kaputtes JSON, alte Version, falsche Felder, unbekannte Typen –, wird verworfen statt die Seite zu brechen.
  function ladeMerkliste() {
    let gespeichert;
    try {
      gespeichert = JSON.parse(localStorage.getItem(SPEICHER_SCHLUESSEL));
    } catch (fehler) {
      console.warn("Gespeicherte Merkliste ist kein gültiges JSON und wird verworfen:", fehler);
      entferneSpeicher();
      return [];
    }
    if (gespeichert === null) return []; // noch nie gespeichert

    if (gespeichert?.version !== SPEICHER_VERSION || !Array.isArray(gespeichert.pokemon)) {
      console.warn("Gespeicherte Merkliste hat ein altes oder unbekanntes Format und wird verworfen:", gespeichert);
      entferneSpeicher();
      return [];
    }

    const gueltig = gespeichert.pokemon.filter(istGueltigesPokemon);
    if (gueltig.length !== gespeichert.pokemon.length) {
      console.warn(`${gespeichert.pokemon.length - gueltig.length} ungültige Einträge in der Merkliste verworfen.`);
    }
    // doppelte IDs entfernen
    return gueltig.filter((p, i) => gueltig.findIndex((q) => q.id === p.id) === i);
  }

  function istGueltigesPokemon(p) {
    return (
      typeof p === "object" &&
      p !== null &&
      Number.isInteger(p.id) &&
      p.id >= 1 &&
      p.id <= ANZAHL &&
      typeof p.name === "string" &&
      p.name.length > 0 &&
      typeof p.englisch === "string" &&
      Array.isArray(p.typen) &&
      p.typen.length > 0 &&
      p.typen.every((t) => t in TYP_NAME) &&
      Number.isInteger(p.generation) &&
      p.generation >= 1 &&
      p.generation < ROEMISCH.length
    );
  }

  function entferneSpeicher() {
    try {
      localStorage.removeItem(SPEICHER_SCHLUESSEL);
    } catch {
      // Speicher nicht verfügbar: nichts zu tun
    }
  }

  // Erste Anzeige mit der gespeicherten Merkliste
  render();

  // Aufruf über die SearchAction aus den strukturierten Daten: suche.html?name=…
  const nameAusUrl = new URLSearchParams(location.search).get("name");
  if (nameAusUrl) {
    formular.elements.name.value = nameAusUrl;
    formular.requestSubmit();
  }
}
