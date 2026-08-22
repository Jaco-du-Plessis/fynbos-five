# Fynbos Five

A one-shot mobile web game for a Stellenbosch Botanical Garden walk: catch five insect guilds, answer a short quiz, complete a working ecosystem.

Plain HTML/CSS/JS. No build step, no accounts, no server. Progress is saved in the phone’s `localStorage` so a refresh does not wipe the team. Use **Reset** on the home board for a second class run.

Coding agents: read [AGENTS.md](AGENTS.md) before changing anything.

## Play it locally

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/` on your computer, or `http://YOUR-LAN-IP:8000/` on a phone on the same Wi‑Fi.

Garden demo: open the live GitHub Pages link on campus Wi‑Fi/data **before** you rely on patchy garden signal.

## Edit the writing (brother)

All copy lives in [`content.js`](content.js). That file is commented. Change questions, facts, the first-catch message, and the finale there. Save, then refresh. You should not need to touch `app.js`.

## Swap insect art

1. Open [`assets/example.png`](assets/example.png). That is the template: about **512×512**, **transparent PNG**, insect centred.
2. Export your species images with these **exact filenames**:
   - `assets/bee.png` — Cape Honey Bee
   - `assets/ant.png` — Large Pugnacious Ant
   - `assets/mantis.png` — Flag Mantis
   - `assets/chafer.png` — Garden Fruit Chafer
   - `assets/butterfly.png` — Cape Mountain Beauty
3. Replace the placeholder files. Refresh. Grey team-board silhouettes are the same images, coloured in after a catch.

## How catching works

| Hash (append to the site URL) | Insect |
| --- | --- |
| `#catch/bee` | Cape Honey Bee (tutorial; also a button on the home board) |
| `#catch/ant` | Large Pugnacious Ant |
| `#catch/mantis` | Flag Mantis |
| `#catch/chafer` | Garden Fruit Chafer |
| `#catch/butterfly` | Cape Mountain Beauty |

Home screen is the five-guild team board. Scan a QR (or tap **Catch the Cape Honey Bee**). Swipe the seed-pod **up**. Wrong quiz answer: insect pops out, same question, throw again. Right answer: slot reveals. Tap a caught insect for guild facts.

Catch order is free so a wrong plant scan does not brick the walk.

## Print garden QRs

After the site is on GitHub Pages, open [`qrcodes.html`](qrcodes.html) on that live URL and print. Codes point at whatever address you used to open the print page, so do not print from `localhost`.

## GitHub Pages (when you are ready to share a link)

1. Create a GitHub repo named `fynbos-five` and push this folder.
2. Settings → Pages → Deploy from branch `main` / root (`/`).
3. Game URL (confirm your GitHub username):  
   `https://jacoduplessis.github.io/fynbos-five/`
4. Print QRs from `https://jacoduplessis.github.io/fynbos-five/qrcodes.html`

Asset paths are relative, so the app works in a project-pages subfolder.

## Out of scope

No live camera, in-app QR scanner, GPS, sound, or server-side save.
