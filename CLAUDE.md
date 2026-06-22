# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fruits'n'Duck** is a fast-paced arcade game built with [Kaplay.js](https://kaplayjs.com/), a modern 2D game engine. The game centers on a duck collecting fruits while avoiding an enemy, with a combo system that grants power-ups for collecting 3 identical fruits in sequence.

## Quick Start Commands

```bash
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:5173)
npm run build       # Build for production
npm run lint        # Check code with ESLint
npm run lint:fix    # Auto-fix ESLint issues
npm run zip         # Create a distribution zip file for itch.io/web hosting
npm run preview     # Preview production build locally
```

## Architecture & Key Files

Source files are organized by responsibility under `src/`:

```
src/
├── main.js        # Entry point: imports appInit + scenes, then go('menu')
├── appInit.js     # Kaplay init, asset loading (sprites/sounds/fonts), layers, global state
├── scenes/        # menu.js, game.js, end.js
├── entities/      # player.js, enemy.js
├── systems/       # objects.js, generators.js, ui.js, map.js
└── lib/           # helpers.js, audio.js  (pure, dependency-free utilities)
```

### Entry Points
- **index.html** — Game container; loads `src/main.js`
- **src/main.js** — Entry point. Imports `appInit.js`, registers all scenes, then `go('menu')`. Contains no gameplay logic itself.
- **src/appInit.js** — Kaplay initialization, fonts, audio, sprites, layers setup. Defines global game state (scoreStats). Single source of truth for asset loading.

### Scenes — `src/scenes/`
- **game.js** — Primary gameplay scene; handles player/enemy creation, tree/fruit mechanics, inventory system, and combo logic (extracted from the old main.js)
- **menu.js** — Title screen with an animated scrolling fruit pattern background
- **end.js** — End-of-game screen (formerly endingScreen.js)

### Entities — `src/entities/`
- **player.js** — Player character with state machine (defaultIdle, defaultRun, kwak, armor, orange modes, etc.), space-bar actions (quack/poop), and `addDustTrail()` (dust particle emitter, triggered by the Samara Speed combo)
- **enemy.js** — Enemy AI that homes in on the player and grows with score

### Systems — `src/systems/`
- **objects.js** — Centralized config for all collectible objects (fruits, viruses, power-ups) with their scores, combo messages, and special effects. Three combo types trigger power-ups:
  - Tomato trio → Tomato Armor (slower, defensive)
  - Pear trio → Samara Speed (faster, enables the dust trail)
  - Banana trio → Super Piment (5 poops for attack projectiles)
- **generators.js** — Spawners for world entities (trees, falling objects, acorn bonus, flowers)
- **ui.js** — Inventory display (3-slot box), rare item notifications, button builder
- **map.js** — Tiled grass map generation

### Utilities — `src/lib/`
- **helpers.js** — Random positioning (`setXs`/`setYs`), bump scale effects (`bump`/`bumpMini`), rectangle builder (`addRect`). No game dependencies.
- **audio.js** — Random sound selection (`kwak`, `fart`, `treePops`) via a shared `playRandom()` helper.

### Assets
- **public/img/** — Sprite sheets (player, enemy, fruits, viruses, trees, grass tiles, particle)
- **public/sound/** — Audio effects (footsteps, tree hits, combo, power-ups, enemy, defeat) and background music
- **public/font/** — Custom fonts (Nunito used for UI)

## Key Design Patterns

### Game Object System
All collectible items (fruits, viruses, power-ups) are defined in `objects.js` with:
- `objectType` — Defines behavior (defaultObject for combos, special types for armor/speed/pimento)
- `scoreValue` — Points awarded
- `comboEvent()` — Triggered when 3 identical fruits collected in sequence

### State Machine
Player uses a state machine (via Kaplay's `state()` component) with 12 states representing different animations and modes (idle, running, armor, special effects, etc.). States control which sprite animations play and which mechanics are available.

### Combo System
Three fruits of the same type collected consecutively → special power-up spawned. Tracked via `inventoryBoxArray` and `objectsInBoxesArray` in `scenes/game.js`.

## Development Tips

### Adding a New Fruit
1. Add sprite to `public/img/` (e.g., `mango.png`)
2. Load sprite in `appInit.js`: `loadSprite('mango', './img/mango.png')`
3. Add entry to `systems/objects.js` with combo event
4. Reference by sprite name in game logic

### Modifying Player Behavior
- States are defined in `entities/player.js` (`playerStateList`)
- Speed and mechanics controlled via `playerStats` (speed, poopCount)
- Animations play automatically when entering a state (sprite name matches state)

### Audio
- Load sounds in `appInit.js` with `loadSound()`
- Play with `play(soundName, { volume, loop, paused })`
- See `lib/audio.js` for random sound selection patterns (`kwak`, `fart`, `treePops`)

### Map & Positioning
- Game world is 1440×800 (defined in appInit.js)
- Random positioning helpers in `lib/helpers.js`: `setXs()`, `setYs()` place objects relative to player
- Walls defined in `scenes/game.js` define the play boundary

## Known Integrations

- **Figma** — Design system / color palette lives in the "FND-CLAUDE" Figma file (see project memory). Permissions configured in `.claude/settings.local.json` for asset sync and variable export. Note: there is currently no generated `palette.js` in the repo; colors are set inline via hex strings.
- **Vite** — Dev server with hot reload; configured in `vite.config.js`
- **ESLint** — Linting config in `eslint.config.js`

## File Conventions

- Source is grouped by responsibility: `scenes/`, `entities/`, `systems/`, `lib/` (with `main.js` and `appInit.js` at the `src/` root)
- Dependency direction: `lib/` (leaf, no deps) → `appInit.js` → `entities/`/`systems/` → `scenes/` → `main.js`
- Game scenes are registered with Kaplay's `scene()` function and imported by `main.js`
- All Kaplay globals imported via `'kaplay/global'` in appInit.js
- Sprites, sounds, fonts loaded in appInit.js (single source of truth)
