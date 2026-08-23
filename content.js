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
 *   assets/bait-flower.png   yellow flower
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
        body: "Beneath the leaves and underfoot, a network of tiny workers is running the world around you. Insects are not just bugs — they are the engines of our local fynbos ecosystem.",
      },
      {
        kicker: "Your mission",
        title: "Assemble five guilds",
        body: "Your ecosystem starts empty. Walk the garden, scan a QR at each station, and choose the bait that will attract that insect. A short quiz adds it to your team. Can you find all five — pollinators, seed dispersers, pest control, recyclers, and specialists — and build a thriving community?",
      },
    ],
    next: "Next",
    start: "Start exploring",
  },

  // Button on the home board so the demo works even without the bee QR.
  catchBeeLabel: "Find the Cape Honey Bee",

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
  resetConfirm: "Start the playthrough over on this phone?",

  // Shown once after the first successful find (usually the bee tutorial).
  firstCatchMessage: {
    title: "One guild down",
    body: "A healthy ecosystem needs more than pollinators. Walk the garden and find an insect from each guild so every service is covered.",
    dismiss: "Find the next insect",
  },

  // Shown when all five are found.
  finale: {
    title: "A functioning ecosystem",
    body: "Pollinators, seed dispersers, predators, recyclers, and specialists each do a job the others cannot. Together they keep the fynbos working. (Replace this paragraph with the real closing copy.)",
    dismiss: "Back to the team",
  },

  // Bait choices shown on every find. `id` must match insect.bait.
  baits: [
    { id: "flower", label: "Yellow flower", image: "assets/bait-flower.png" },
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
          "Pollination — moving pollen between flowers",
          "Breaking down dead wood",
          "Dispersing large seeds underground",
          "Hunting other insects as top predators",
        ],
        correctIndex: 0,
      },
      facts:
        "Pollinators move pollen so plants can set seed and fruit. Cape honey bees are a local subspecies — replace this blurb with your ecology notes.",
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
          "They carry seeds and bury them (myrmecochory)",
          "They eat only nectar and ignore seeds",
          "They compost leaves into soil in one night",
        ],
        correctIndex: 1,
      },
      facts:
        "Seed dispersers move seeds away from the parent plant. Many fynbos plants offer ants a food body on the seed so the ant carts it home. Replace this with your notes.",
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
          "It hunts other insects — natural pest control",
          "It pollinates red tubular flowers",
        ],
        correctIndex: 2,
      },
      facts:
        "Predators keep herbivore numbers in check. A flag mantis is sit-and-wait pest control. Replace this with your notes.",
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
          "They only eat living leaves",
          "They chase birds away from nests",
          "They pollinate only at midday",
          "They break down fruit and waste, returning nutrients",
        ],
        correctIndex: 3,
      },
      facts:
        "Recyclers (decomposers) turn dead plant material and fruit into nutrients plants can use again. Replace this with your notes.",
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
          "They depend on particular plants or habitats",
          "They eat every insect in the garden",
          "They never visit flowers",
        ],
        correctIndex: 1,
      },
      facts:
        "Specialists are tied to particular plants (this butterfly loves red flowers such as watsonias). If those plants go, the insect goes. Replace this with your notes.",
    },
  ],
};
