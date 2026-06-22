# Fruits'n'Duck

A fast-paced arcade game where you play as a duck collecting fruits while avoiding enemies! Shake fruit trees, create combos, and survive as long as possible.

## HOW TO PLAY

Controls:
- Arrow keys (or WASD/ZQSD) — move the duck in all directions.
- Space bar — quack, and poop projectiles when a power-up is active.

Objective: collect fruits by shaking trees, build 3-fruit combos, and stay ahead of the enemy.

Gameplay:
- Collide with fruity trees to make them drop fruits.
- Collect 3 identical fruits in a row to trigger a combo bonus.
- Pick up acorns to spawn new trees.
- Each item collected makes the enemy faster and bigger.
- Collecting viruses lowers your score.

Fruit System:
- 🍅 Tomato: +5 points — 3 in a row grant the Tomato Armor.
- 🍐 Pear: +5 points — 3 in a row grant the Samara Speed boost.
- 🍌 Banana: +5 points — 3 in a row grant the Super Piment.
- 🍒 Bonus fruits (lemon, blueberry, watermelon…): +20 points.
- 🦠 Virus (Purple): -10 points.
- 🦠 Virus (Blue): -15 points.
- 🦠 Virus (Brown): -20 points.

## FEATURES

- Dynamic fruit spawning system.
- A relentless enemy that homes in on you and grows with your score.
- Combo system with visual feedback and power-ups (Tomato Armor, Samara Speed, Super Piment).
- Animated title screen with a scrolling fruit pattern background.
- Dust particle trail at the duck's feet once the Samara Speed boost is collected.
- Score tracking and end-of-game statistics.
- Multiple sprite animations, sound effects, and looping background music.

## TECHNOLOGIES

- [Kaplay.js](https://kaplayjs.com/) v4000 (alpha) - Game framework.
- [Vite](https://vitejs.dev/) v8 - Build tool & dev server.
- ESLint v10 - Code linting.
- JavaScript ES6 Modules - Clean code architecture organized by responsibility.

## PROJECT STRUCTURE

```
fruitsnduck/
├── src/                  # Source code
│   ├── main.js           # Entry point (init + scene registration + go('menu'))
│   ├── appInit.js        # Kaplay init, asset loading, layers, global state
│   ├── scenes/           # Game scenes
│   │   ├── menu.js       # Title screen (animated background)
│   │   ├── game.js       # Main gameplay scene
│   │   └── end.js        # End-of-game screen
│   ├── entities/         # Characters
│   │   ├── player.js     # Player logic & state machine
│   │   └── enemy.js      # Enemy AI
│   ├── systems/          # Game systems & builders
│   │   ├── objects.js    # Collectible objects config (scores, combos)
│   │   ├── generators.js # Entity spawners (trees, objects, flowers)
│   │   ├── ui.js         # UI components & buttons
│   │   └── map.js        # Tiled grass map generation
│   └── lib/              # Reusable, domain-agnostic utilities
│       ├── helpers.js    # Random positions, bump effects, rect builder
│       └── audio.js      # Sound randomizers (quack, fart, tree pops)
├── public/
│   ├── img/              # Sprites & graphics
│   ├── sound/            # Audio files
│   └── font/             # Custom fonts
├── index.html            # HTML entry (loads src/main.js)
└── vite.config.js        # Vite configuration
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

## LICENSES

- Code: [MIT License](LICENSE.md) — free to use, modify, and distribute.
- Graphic assets: [CC BY-SA 4.0](ASSETS_LICENSE.md) — attribution required, share-alike.

## AUTHOR

RG Beaumont.

---

Version: 0.9.5  
Made with [Kaplay.js](https://kaplayjs.com/).
