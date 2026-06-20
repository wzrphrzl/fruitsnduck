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

### Entry Points
- **index.html** — Game container; Vite entry point
- **src/appInit.js** — Kaplay initialization, fonts, audio, sprites, layers setup. Defines global game state (scoreStats).

### Core Game Scenes
- **src/main.js** — Primary game scene; handles player/enemy creation, tree/fruit mechanics, inventory system, and combo logic
- **src/menu.js** — Menu scene
- **src/endingScreen.js** — End-of-game screen

### Character & Entity Logic
- **src/player.js** — Player character with state machine (defaultIdle, defaultRun, kwak, armor, orange modes, etc.) and special actions (kwak/poop via space bar)
- **src/enemy.js** — Enemy AI that homes in on player and grows with score
- **src/generators.js** — Utility functions for spawning game elements (trees, objects, effects), random positioning, animations (bump effects, kwak/fart sounds)

### Game Systems
- **src/objects.js** — Centralized config for all collectible objects (fruits, viruses, power-ups) with their scores, combo messages, and special effects. Three combo types trigger power-ups:
  - Tomato trio → Tomato Armor (slower, defensive)
  - Pear trio → Samara Speed (faster)
  - Banana trio → Super Piment (5 poops for attack projectiles)
- **src/ui.js** — Inventory display (3-slot box), rare item notifications
- **src/map.js** — Tiled grass map generation
- **src/palette.js** — Design token colors (16 hues × 8 shades). **Generated from Figma (FND-CLAUDE file)**; do not edit manually.

### Assets
- **public/img/** — Sprite sheets (player, enemy, fruits, viruses, trees, grass tiles)
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
Three fruits of the same type collected consecutively → special power-up spawned. Tracked via `inventoryBoxArray` and `objectsInBoxesArray` in main.js.

## Color Palette & Design System

The color palette (`src/palette.js`) is generated from Figma variables in the "FND-CLAUDE" file. Do not hand-edit this file.

To regenerate:
1. Update colors in Figma (FND-CLAUDE)
2. Use `/figma-code-connect` skill to export variables
3. Regenerate `palette.js` (process TBD — check project memory for Figma integration details)

Access colors via:
```javascript
import { palette, flatPalette } from './palette.js';
palette.red.base         // "#EC354F"
flatPalette["red-base"]  // "#EC354F"
```

## Development Tips

### Adding a New Fruit
1. Add sprite to `public/img/` (e.g., `mango.png`)
2. Load sprite in `appInit.js`: `loadSprite('mango', './img/mango.png')`
3. Add entry to `objects.js` with combo event
4. Reference by sprite name in game logic

### Modifying Player Behavior
- States are defined in `player.js` (`playerStateList`)
- Speed and mechanics controlled via `playerStats` (speed, poopCount)
- Animations play automatically when entering a state (sprite name matches state)

### Audio
- Load sounds in `appInit.js` with `loadSound()`
- Play with `play(soundName, { volume, loop, paused })`
- See generators.js for random sound selection patterns (kwak, fart, footsteps)

### Map & Positioning
- Game world is 1440×800 (defined in appInit.js)
- Random positioning helpers in generators.js: `setXs()`, `setYs()` place objects relative to player
- Walls defined in main.js define play boundary

## Known Integrations

- **Figma** — Design system with color palette (FND-CLAUDE file). Permissions configured in `.claude/settings.local.json` for asset sync and variable export.
- **Vite** — Dev server with hot reload; configured in `vite.config.js`
- **ESLint** — Linting config in `eslint.config.js`

## File Conventions

- Game scenes are registered with Kaplay's `scene()` function
- All Kaplay globals imported via `'kaplay/global'` in appInit.js
- Sprites, sounds, fonts loaded in appInit.js (single source of truth)
- Utility functions documented with JSDoc in generators.js
