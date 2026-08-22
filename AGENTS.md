# AGENTS.md

Instructions for coding agents working in this repo. Humans: see [README.md](README.md).

## What this is

**Fynbos Five** — a one-shot mobile web game for a Stellenbosch Botanical Garden walk (university outreach video, ENT464). Catch five insect guilds with a swipe seed-pod + quiz. No backend.

Keep it tiny. This is a 5–10 minute class demo, not a product.

## Stack (do not change unless asked)

- Plain `index.html` + `styles.css` + `app.js` + `content.js`
- No build, no bundler, no npm, no React/Vue/Svelte, no TypeScript
- Relative asset paths only (GitHub Pages project site: `/fynbos-five/`)
- Vanilla scripts (not ES modules) so `file://` and Pages both work

## Files

| File | Owner | Role |
| --- | --- | --- |
| `content.js` | Brother (copy) | All writing, quiz, image paths. Heavily commented. |
| `app.js` | Game logic | Hash routes, swipe, localStorage, animations |
| `index.html` | Markup | Team board + capture overlay + quiz + facts + finale |
| `styles.css` | Presentation | Mobile portrait, outdoor contrast, fynbos palette |
| `qrcodes.html` | Print sheet | QR images from this page’s origin + `#catch/{id}` |
| `assets/*.png` | Art | `example.png` is the template; species files use **exact** names below |
| `README.md` | Humans | How to play, edit copy, host, print QRs |

Do **not** put copy strings in `app.js` if they belong in `content.js`.

## Insect IDs (keep in sync)

IDs are the hash, the `content.js` `id`, and the PNG filename:

| id | File | Hash |
| --- | --- | --- |
| `bee` | `assets/bee.png` | `#catch/bee` |
| `ant` | `assets/ant.png` | `#catch/ant` |
| `mantis` | `assets/mantis.png` | `#catch/mantis` |
| `chafer` | `assets/chafer.png` | `#catch/chafer` |
| `butterfly` | `assets/butterfly.png` | `#catch/butterfly` |

Catch order is free. Home is the five-guild board. Bee also has a CTA so the demo works without a QR.

## Behaviour to preserve

- Progress: `localStorage` key `fynbos-five-progress`. Include a Reset control.
- Seed-pod (not a Pokéball — no Nintendo look). Swipe **up** to throw.
- After a throw, the pod stays in the **centre of the screen**, then shakes. During the quiz it sits in the upper third so the question sheet fits without scrolling. Wrong quiz → insect pops out, **same** question, throw again.
- Catch/quiz screens must not scroll. Fit the quiz (including miss feedback) in the small viewport (`100svh`). Compact options rather than adding overflow.
- Pause after catch animation before the quiz (`QUIZ_AFTER_THROW_MS`). Show green/red on the chosen answer before continuing (`ANSWER_FEEDBACK_MS` / longer `WRONG_ANSWER_FEEDBACK_MS` so the miss copy can be read). Do not reveal the correct option on a miss.
- No live camera, in-app QR scanner, GPS, accounts, sound, or server save.

## Commands

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` and hashes like `http://localhost:8000/#catch/bee`.

Syntax check after JS edits: `node --check app.js && node --check content.js`

There is no test suite. Verify in the browser on a narrow viewport (phone).

## Boundaries

- Do not add frameworks, a build step, or a backend.
- Do not rename insect `id`s without updating hashes, PNGs, and `qrcodes.html`.
- Do not print/commit QR codes that point at `localhost`.
- Do not commit unless the user asks. Do not force-push.
- Prefer CSS/pointer events over libraries for animation.

## Copy vs code

If the user (or brother) is changing questions, facts, or labels → edit `content.js` only.  
If they are changing catch/quiz/board behaviour → `app.js` / `index.html` / `styles.css`.
