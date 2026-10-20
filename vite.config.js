import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Mehrseitige App: jede HTML-Seite ist ein eigener Einstiegspunkt
export default defineConfig({
  // relative Pfade, damit dist/ auch unter /webengineering_dhbw/ (GitHub Pages) funktioniert
  base: "./",
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        start: "index.html",
        suche: "suche.html",
        pokedex: "pokedex.html",
        ueber: "ueber.html",
      },
    },
  },
});
