# Fruits'n'Duck

A fast-paced arcade game where you play as a duck collecting fruits while avoiding enemies! Shake fruit trees, create combos, and survive as long as possible.

## HOW TO PLAY

Controls:
- Arrow keys — move the duck in all directions.

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
- Combo system with visual feedback.
- Score tracking and end-of-game statistics.
- Multiple sprite animations, sound effects, and looping background music.

## TECHNOLOGIES

- [Kaplay.js](https://kaplayjs.com/) v3001.0.19 - Game framework.
- [Vite](https://vitejs.dev/) v7.2.7 - Build tool & dev server.
- ESLint - Code linting.
- JavaScript ES6 Modules - Clean code architecture.

## PROJECT STRUCTURE

```
fruitsnduck/
├── src/               # Source code
│   ├── main.js        # Main game scene
│   ├── appInit.js     # Kaplay initialization
│   ├── player.js      # Player logic
│   ├── enemy.js       # Enemy AI
│   ├── menu.js        # Menu scene
│   ├── endingScreen.js
│   ├── ui.js          # UI components
│   ├── generators.js  # Utility functions
│   └── gameObjects.js # Game objects config
├── public/
│   ├── img/           # Sprites & graphics
│   ├── sound/         # Audio files
│   └── font/          # Custom fonts
├── index.html         # Entry point
└── vite.config.js     # Vite configuration
```

## INSTALLATION & DEVELOPMENT

Prerequisites:
- Node.js v20 or higher (required by Vite 7).
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
Creates a `dist/game.zip` ready for deployment to itch.io, Newgrounds, or web hosting.

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

Version: 0.9.1  
Made with [Kaplay.js](https://kaplayjs.com/).
