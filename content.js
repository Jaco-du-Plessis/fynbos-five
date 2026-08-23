/**
 * Fynbos Five — all the writing lives here.
 *
 * HOW TO EDIT
 * -----------
 * 1. Change any string below. Save the file. Refresh the phone browser.
 * 2. Do not edit app.js unless you are changing how the game works.
 *
 * HOW TO SWAP INSECT ART
 * ----------------------
 * Look at assets/example.png — that is the size and style to aim for:
 *   • Transparent PNG (no white box behind the insect)
 *   • About 512×512 pixels (bigger is fine)
 *   • Insect centred, facing the camera
 *
 * Drop your files into the assets/ folder using these exact names:
 *   assets/bee.png            — shown after the insect is found (colour)
 *   assets/bee-locked.png     — team board before it is found (still auto-greyed)
 *   assets/ant.png / ant-locked.png
 *   assets/mantis.png / mantis-locked.png
 *   assets/chafer.png / chafer-locked.png
 *   assets/butterfly.png / butterfly-locked.png
 *
 * Bait placeholders (same PNG rules) — replace when you have real art:
 *   assets/bait-flower.png   common flower
 *   assets/bait-seed.png     fatty seed
 *   assets/bait-fly.png      trapped housefly (Musca domestica)
 *   assets/bait-fruit.png    overripe fruit
 *   assets/bait-orchid.png   red orchid
 *
 * The team board uses `lockedImage` until that insect is found, then `image`.
 * Locked art is still run through the grey CSS filter. Swap the -locked
 * files when you have dedicated silhouette/grey artwork.
 *
 * Tapping a locked tile shows `qrHint` — where to find that QR in the garden.
 * Replace the placeholder sentences with the real plant / path notes.
 *
 * QUIZ
 * ----
 * options[0] is A, [1] is B, [2] is C, [3] is D.
 * correctIndex is which option is right (0 = A, 1 = B, 2 = C, 3 = D).
 * Wrong answer → restart the bait step for this insect.
 * The same question is used on retry (that is intentional).
 *
 * BAIT
 * ----
 * Each insect has a `bait` id that must match one of the `baits` entries.
 * Player chooses a bait, then taps Place bait. Wrong bait → nothing happens,
 * and the bait step restarts. Right bait → insect is attracted, then the quiz.
 */
window.CONTENT = {
  title: "Fynbos Five",
  tagline: "Find five insect guilds to complete a working fynbos ecosystem. Tap the insects for a hint or more information.",

  // Shown once the first time this phone opens the game (Reset also shows it again).
  intro: {
    slides: [
      {
        kicker: "Stellenbosch Botanical Garden",
        title: "A hidden workforce",
        body: "Beneath the leaves and underfoot, a network of tiny workers is running the world around you. Insects are not just bugs - they are the workers that keep our ecosystem functioning.",
      },
      {
        kicker: "Your mission",
        title: "Assemble five guilds",
        body: "Your ecosystem starts empty. Explore the garden, search for the QR codes, and choose the bait that will attract that insect. Can you find all five - pollinators, seed dispersers, pest control, recyclers, and specialists - and build a thriving community?",
      },
    ],
    next: "Next",
    start: "Start exploring",
  },

  // Button on the home board so the demo works even without the bee QR.
  catchBeeLabel: "Find the first insect",

  // Title for the popup when someone taps a locked tile.
  // The body of that popup is each insect's `qrHint` (where to scan).
  lockedTitle: "Still out there",

  captureHint: "Choose the right bait, then place it.",
  placeBaitLabel: "Place bait",
  wrongBait: "Nothing happens.",

  // Shown on the quiz after they tap A/B/C/D, before the next step.
  correctAnswer: "Found!",
  wrongAnswer: "Not quite — try again.",

  alreadyCaught: "Already in your ecosystem.",

  resetLabel: "Reset",
  resetCancel: "Cancel",
  resetConfirm: "Start the playthrough over on this device?",

  // Shown once after the first successful find (usually the bee tutorial).
  firstCatchMessage: {
    title: "One guild down!",
    body: "A healthy ecosystem needs more than just pollinators. Look for the other guilds in the garden and find an insect from each to complete your ecosystem. Tap the missing insects if you need a hint.",
    dismiss: "Find the next insect",
  },

  // Shown when all five are found.
  finale: {
    title: "A functioning ecosystem",
    body: "Pollinators, seed dispersers, predators, recyclers, and specialists each do a job the others cannot. Working together, they ensure that the ecosystem remains balanced and healthy. Without insects, the world around you would be unrecognisable - all species need to be protected, because every species a role to play.",
    dismiss: "Back to the team",
  },

  // Bait choices shown on every find. `id` must match insect.bait.
  baits: [
    { id: "flower", label: "Common flower", image: "assets/bait-flower.png" },
    { id: "seed", label: "Fatty seed", image: "assets/bait-seed.png" },
    {
      id: "fly",
      label: "Trapped fly",
      scientificName: "Musca domestica",
      image: "assets/bait-fly.png",
    },
    { id: "fruit", label: "Overripe fruit", image: "assets/bait-fruit.png" },
    { id: "orchid", label: "Red orchid", image: "assets/bait-orchid.png" },
  ],

  // Order here is the order of slots on the team board.
  insects: [
    {
      id: "bee",
      commonName: "Cape Honey Bee",
      scientificName: "Apis mellifera capensis",
      guild: "Pollinators",
      image: "assets/bee.png",
      lockedImage: "assets/bee-locked.png",
      bait: "flower",
      qrHint:
        "Start of the walk — I'll hand out this QR (or scan the first station). Replace with the real garden spot.",
      quiz: {
        question: "What ecosystem service do Cape honey bees provide?",
        options: [
          "They help pollinate many plant species",
          "They break down rotting wood and leaf litter",
          "They transport plant seeds to new locations",
          "They hunt other insects to keep populations in check",
        ],
        correctIndex: 0,
      },
      facts:
        "About 9 out of 10 wild flowering plants need insects to pollinate them. Cape honey bees are our local subspecies of honey bee, but many of our pollinators are unique to South Africa, the Western Cape, or even just Stellenbosch.",
    },
    {
      id: "ant",
      commonName: "Large Pugnacious Ant",
      scientificName: "Anoplolepis custodiens",
      guild: "Seed dispersers",
      image: "assets/ant.png",
      lockedImage: "assets/ant-locked.png",
      bait: "seed",
      qrHint:
        "Scan the QR at the seed-disperser station. Replace with the plant / path description.",
      quiz: {
        question: "How do pugnacious ants help plants?",
        options: [
          "They pollinate protea flowers at night",
          "They carry seeds and bury them",
          "They eat only nectar and ignore seeds",
          "They compost leaves into soil in one night",
        ],
        correctIndex: 1,
      },
      facts:
        "Seed dispersers play an important role in transporting seeds to new locations. Many fynbos plants work in collaboration with ants to have their seeds buried and protected from fires, by offering them a food body on the seed.",
    },
    {
      id: "mantis",
      commonName: "Flag Mantis",
      scientificName: "Polyspilota aeruginosa",
      guild: "Pest control",
      image: "assets/mantis.png",
      lockedImage: "assets/mantis-locked.png",
      bait: "fly",
      qrHint:
        "Scan the QR at the pest-control station. Replace with the plant / path description.",
      quiz: {
        question: "What role does a mantis play in the guilds?",
        options: [
          "It only drinks nectar",
          "It recycles dung into soil",
          "It hunts other insects",
          "It pollinates specialised flowers",
        ],
        correctIndex: 2,
      },
      facts:
        "Predators keep other insect populations in check. Without them, some insect species would grow unchecked and damage the ecosystem. Predators and parasites prevent common onsect species from becoming pests.",
    },
    {
      id: "chafer",
      commonName: "Garden Fruit Chafer",
      scientificName: "Pachnoda sinuata",
      guild: "Recyclers",
      image: "assets/chafer.png",
      lockedImage: "assets/chafer-locked.png",
      bait: "fruit",
      qrHint:
        "Scan the QR at the recycler station. Replace with the plant / path description.",
      quiz: {
        question: "Why do recyclers like chafers matter?",
        options: [
          "They eat and kill invasive plants",
          "They chase birds away from nests",
          "They pollinate plants when other insects are unable to",
          "They break down organic material, returning vital nutrients to the soil",
        ],
        correctIndex: 3,
      },
      facts:
        "Recyclers (decomposers) turn dead plant material and fruit into nutrients plants can use again. The Cape Floristic Region has extremely low soil nutrient levels, meaning growth rates are often limited by how fast decomposers can return nutrients to the soil.",
    },
    {
      id: "butterfly",
      commonName: "Cape Mountain Beauty",
      scientificName: "Aeropetes tulbaghia",
      guild: "Specialists",
      image: "assets/butterfly.png",
      lockedImage: "assets/butterfly-locked.png",
      bait: "orchid",
      qrHint:
        "Scan the QR at the specialist / red-flower station. Replace with the plant / path description.",
      quiz: {
        question: "What makes a specialist guild different?",
        options: [
          "They only live in water",
          "They use special endemic species that aren't found anywhere else",
          "They specialise in eating invasive plants to keep their populations in control",
          "They rarely visit flowers, avoiding competition with other guilds",
        ],
        correctIndex: 1,
      },
      facts:
        "Specialists are the alternative to generalist species. The unique behaviour of specialists allow for unique plants like endemic orchids to avoid harsh competition with other generalist plants. Many of South Africa's unique endemics are reliant on a single species of specialists to complete it's life cycle.",
    },
  ],
};
