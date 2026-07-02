# CuentaFigus — World Cup 2026 Sticker Album Tracker

A lightweight, offline-friendly web app to track which stickers you own for the Panini World Cup 2026 album (México, Estados Unidos, Canadá). No build step, no dependencies — plain HTML, CSS and JavaScript, with progress saved locally in the browser (`localStorage`).

## Album structure

- **48 countries**, ordered by their official group (A → L), 20 stickers each.
  - Sticker **#1** is the country's badge/crest.
  - Sticker **#13** is the team photo.
  - Both are visually marked as "special" stickers.
- **FWC + Especiales** section: sticker **00** (Panini logo) plus **FWC 1–19** (special tournament stickers).
- **Total: 980 stickers** (48 × 20 + 20).

## Sticker grid layout

Inside each country accordion, the 20 numbers are arranged in two 4-column blocks to mirror the physical album page:

```
         1  2
   3  4  5  6
   7  8  9  10

11 12    13
14 15 16 17
   18 19 20
```

(1 sits above 5, 2 above 5's neighbor 6 — matching the printed sticker sheet.)

## Interactions

- **Tap** a sticker number: cycles it forward — empty → obtained → repeated (×1) → repeated (×2) → …
- **Press and hold** (~450ms) a sticker: moves it back one state (repeated → obtained → empty), down to a minimum of empty. A subtle fill animation shows while holding.
- Each accordion header shows a live `obtained/20` (or `obtained/20` for the FWC section) progress count.
- The header bar shows global totals: stickers obtained out of 980, and how many repeats you have available to trade.
- **Reset album** button clears all saved progress (with a confirmation prompt).

## Data & persistence

- All state lives in the browser's `localStorage` under the key `figuritas-mundial-2026`.
- State is stored as `{ "<stickerId>": <count> }` — only non-zero counts are kept, so an empty album is an empty object.
- Sticker IDs: `"<countryCode>-<number>"` for country stickers (e.g. `"MX-1"`), `"FWC-<number>"` for special stickers, and `"00"` for the Panini logo.
- Nothing is sent to a server — progress is local to the device/browser it's used in.

## Import / export

- **Importar álbum**: paste a "Me faltan" or "Repetidas" message (from this app or a compatible one) into the modal. A "Me faltan" message resets the album and marks everything not listed as obtained (confirmation required, since it's destructive). A "Repetidas" message only bumps stickers you already own to "repeated" — it never marks new stickers as obtained, so importing it into an empty album does nothing.
- **Exportar faltantes / Exportar repes**: generate a shareable text message in the same format/country codes as the compatible app, so it can be pasted into either app or sent to friends to trade.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell: header with stats, accordion container, footer actions, import/export modal. |
| `style.css` | Dark-theme styling, accordion, sticker grid, state colors and modal. |
| `app.js` | Country data (in group order), grid layout maps, state logic, rendering, event handling, import/export parsing, service worker registration. |
| `icon.svg` | App icon (trophy mark) source, used to generate the PWA icons. |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Generated PWA/home-screen icons. |
| `manifest.json` | Web app manifest (installable PWA metadata). |
| `sw.js` | Service worker: caches the app shell so it works offline after the first load. |

## Running locally

No build tools required — just serve the folder statically, e.g.:

```bash
python -m http.server 5174
```

Then open `http://localhost:5174` in a browser. Note: the service worker only registers over HTTPS or `localhost` (a plain `file://` open won't install it, though the app still works without it).

## Deploying to GitHub Pages

Push this folder to a GitHub repo and enable Pages (Settings → Pages → Deploy from branch). All paths are relative, so it works fine from a project subpath like `usuario.github.io/repo-name/`. Keep in mind progress is saved in `localStorage` scoped to that exact URL — renaming the repo (or moving to a custom domain) means users start from an empty album on the new URL.

## Status / next steps

- Core tracking app is complete and functional.
- Installable PWA (manifest + service worker + home-screen icons): done.
