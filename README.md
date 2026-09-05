# Fruits'n'Duck

A fast-paced arcade mini-roguelite. You play Qurkee, a duck who has inherited his grandmother's
orchard. Grow trees, shake fruits loose, chain three-fruit combos, and outlast the viruses and the
Blackbird boss before the clock runs out.

Hand-drawn pixel art, kawaii art direction, built from scratch in JavaScript with
[Kaplay.js](https://kaplayjs.com/).

## HOW TO PLAY

Controls:
- Arrow keys (or WASD/ZQSD) — move the duck in all directions.
- Space bar — quack; spit the last collected fruit back out; drop a mine once the Super Piment
  power-up is active.

Core loop:
1. An acorn falls from the sky — pick it up and a tree grows nearby.
2. Bump into the tree to shake fruits loose onto the ground.
3. Collect fruits — the inventory holds **3**.
4. A full inventory fires a **fruit combo**, the payoff that drops new items into the world.
5. Better fruits and more enemies appear as your score climbs. Repeat until the timer hits zero.

You start with 3 hearts and 2 minutes on the clock. Losing all hearts or running out of time ends
the run.

### The strategic click

The moment the game clicks is when you deliberately **leave a fruit on the ground** to steer the
combo you want. Everything else — the item layout, the enemies, the UI hints — is designed to
provoke that decision early.

### Pressure on the player

- Choosing which fruits to pick up (and which to refuse).
- Obstacles on the way: empty trees block you, thistles hurt, and unwanted fruits become obstacles
  of their own.
- Enemies that arrive progressively.
- The countdown.

## FRUIT COMBOS

Filling the 3 inventory slots classifies the trio into one of three categories, each with its own
loot table, sound, explosion sprite, tile colors, and player-facing name:

| Category | Name shown | Trio |
| --- | --- | --- |
| `baseCombo` | Compote | 3 different fruits |
| `unPerfectCombo` | Crumble | 2 identical fruits + 1 different |
| `perfectCombo` | Smoothie | 3 of the exact same fruit |

A perfect combo runs that specific fruit's own event instead of a shared loot table — this is how
upgrades are unlocked.

(A fourth category, `nearPerfectCombo`, is a leftover in the code — it still fires on 3 identical
*common* fruits and is aliased onto Crumble. It will be folded away.)

## ITEMS

### Fruits

**5 common fruits** — banana, pear, lemon, cherry, watermelon (5 to 9 points each).

**5 super fruits** — grape, kumquat, piment, tomato, plum. Each exists in three tiers (T1/T2/T3)
and each unlocks one upgrade for the player.

### Upgrades

Perfecting three identical super fruits drops the matching upgrade:

| Super fruit | Upgrade | Effect |
| --- | --- | --- |
| Grape | Super Star | Fire-breathing |
| Plum | Super Heart | One extra permanent heart |
| Piment | Super Piment | Lets you drop mines |
| Tomato | Tomato Armor | Immunity to thistles |
| Kumquat | Samara Speed | Movement speed boost |

### Buffs

- **Heart** — restores a lost health point.
- **Dandelion** — adds time to the countdown.
- **Acorn** — grows a new tree near the player.

### Hazards

- **Thistle** — a mine: step on it and lose a health point (the Tomato Armor crushes it into a
  flower instead).
- **Virus** — collecting one costs points.

## ENEMIES

- **Viruses** — one more virus joins the chase every time your score crosses a 50-point step. Five
  different virus types, each ramping up as combos buff them.
- **Boss** — the jealous Blackbird. Homes in on the player and grows bigger with your score.

## VALENCE SYSTEM

Loot tables mirror the combo hierarchy: the better the combo, the better the table. RNG decides the
*variety* of the drop, never the valence itself — too much positive RNG is boring, too much negative
RNG is frustrating. The mandatory action (growing a tree) is never punished; the real danger scales
with the player's score instead.

## SCORING & PROGRESSION

- Every beneficial pickup raises the score; every hazard lowers it.
- The end screen reports the final score, the number of fruit combos, and the survival time.
- **Short term** — survive the countdown and post the highest score.
- **Mid term** — across runs, collect every upgrade and max out the player's stats.
- **Long term** — with every upgrade maxed out, the game's true ending unlocks.

## FEATURES

- Grandma's intro cutscene with a typewriter dialogue system, swappable illustrations, overlay tags
  and a skip button.
- Animated title screen with a scrolling fruit pattern background.
- 15-state player animation machine (idle, run, quack, spit, stress, orange, armor, rage, spit
  fire…).
- Combo system with per-category colors, explosions, labels and loot tables.
- A boss that homes in on you and grows with your score, plus escalating virus waves.
- Dust particle trail once the Samara Speed boost is collected.
- Countdown that speeds the music up in the last 15 seconds.
- Score tracking and end-of-game statistics.

## ROADMAP

Designed but not implemented yet:

- **Tiers T2/T3** — upgrading each power-up three times over.
- **Currency & shop** — converting a run's fruit combos into currency, spent on the defeat screen.
- **Fruitpedia** — the in-game encyclopedia (fruit values, combo recipes) sold as shop entries.
- **True ending** — the cutscene triggered once every upgrade is maxed.
- **Acorn spawning** — currently a random on-screen drop every 20 seconds; it should ask something
  of the player instead (an action to perform, or acorns falling from shaken trees).
- **Alternative buffs** — dash with cooldown, retaliation damage, one revive per run, fruit magnet,
  mines leaving a fire pool. (Passive stats are avoided: no memorable moment, no new gameplay.)

## TECHNOLOGIES

- [Kaplay.js](https://kaplayjs.com/) v4000 (alpha) — game framework.
- [Vite](https://vitejs.dev/) v8 — build tool & dev server.
- ESLint v10 — code linting.
- JavaScript ES6 modules — architecture organized by responsibility.

## PROJECT STRUCTURE

```
fruitsnduck/
├── src/
│   ├── main.js        # Entry point: imports appInit + scenes, then go(...)
│   ├── appInit.js     # Kaplay init, asset loading, layers, fonts, global state
│   ├── scenes/
│   │   ├── intro.js   # Studio / engine splash screens
│   │   ├── menu.js    # Title screen (animated fruit pattern background)
│   │   ├── cutscene.js# Grandma's intro dialogue (typewriter + illustrations)
│   │   ├── game.js    # Main gameplay scene
│   │   └── end.js     # Defeat screen (scene name: 'lose')
│   ├── entities/
│   │   ├── player.js  # Player state machine, actions, playerStats
│   │   ├── boss.js    # Boss AI (homes in, grows with score)
│   │   └── virus.js   # Viruses + shared ramp-up stats
│   ├── systems/
│   │   ├── objects.js     # Every collectible: type, score value, event
│   │   ├── fruitcombo.js  # Pickup collision → inventory → combo resolution
│   │   ├── inventory.js   # The 3 fruit slots
│   │   ├── loots.js       # Combo classification, loot tables, labels, colors
│   │   ├── generators.js  # Spawners (objects, trees, plants, flowers, explosions)
│   │   ├── timer.js       # Countdown + formatTime()
│   │   ├── ui.js          # Barrel re-exporting every UI widget
│   │   └── ui/            # hud, scoreTiles, comboTile, fruitBoxes, health, upgrades
│   └── lib/
│       ├── helpers.js      # Positioning, rect and button builders
│       ├── effects.js      # bump, dust trail, wavy/rainbow text effects
│       ├── audio.js        # Random sound selection
│       ├── map.js          # Tiled grass map generation
│       └── colorpalette.js # Auto-generated from the Figma variables
├── public/
│   ├── img/           # Sprites & graphics
│   ├── cutscene/      # Cutscene illustrations
│   ├── sound/         # Audio files
│   └── font/          # Custom fonts
├── index.html         # HTML entry (loads src/main.js)
└── vite.config.js     # Vite configuration
```

## INSTALLATION & DEVELOPMENT

Prerequisites:
- Node.js v20.19+ or v22.12+ (required by Vite 8).
- npm.

Install dependencies:
```sh
npm install
```

Development server:
```sh
npm run dev
```
Opens a dev server at http://localhost:5173 with hot reload.

Build for production:
```sh
npm run build
```
Builds optimized files into the `dist/` directory.

Create a distribution package:
```sh
npm run zip
```
Creates a `dist/fnd-x.zip` ready for deployment to itch.io, Newgrounds, or web hosting.

Lint code:
```sh
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

Regenerate the color palette:
```sh
npm run palette     # Rebuilds src/lib/colorpalette.js from the Figma export
```

## LICENSES

- Code: [MIT License](LICENSE.md) — free to use, modify, and distribute.
- Graphic assets: [CC BY-SA 4.0](ASSETS_LICENSE.md) — attribution required, share-alike.

## AUTHOR

RG Beaumont.

---

Version: 0.9.5  
Made with [Kaplay.js](https://kaplayjs.com/).
