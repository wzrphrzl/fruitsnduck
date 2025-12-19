# Fruits'n'Duck

A fast-paced arcade game where you play as a duck collecting fruits while avoiding enemies! Shake fruit trees, create combos, and survive as long as possible.

## HOW TO PLAY

Controls :
Arrow Keys - Move the duck in all directions.
Objective - Collect fruits by shaking trees, create 3-fruit combos, and avoid the enemy.

Gameplay :
- Collide with fruity trees to make them drop fruits.
- Collect 3 identical fruits in a row to trigger special combo effects.
- Pick up stars to spawn new trees.
- Each fruit collected makes the enemy faster and bigger.
- Collecting viruses reduces your score but can slow down or shrink the enemy.

Fruit System :
- 🍅 Tomato : +20 points.
- 🍐 Pear : +20 points.  
- 🍌 Banana : +20 points.
- 🦠 Virus (Purple) : -10 points, shrinks enemy.
- 🦠 Virus (Blue) : -15 points.
- 🦠 Virus (Brown) : -20 points, slows enemy.

Combo Effects :
- 3 identical fruits in a row trigger special bonuses (extra points, enemy debuffs).

## FEATURES

- Dynamic fruit spawning system.
- AI-powered enemy with pathfinding.
- Combo system with visual feedback.
- Score tracking and game statistics.
- Multiple sprite animations, sound effects and background music.

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

Prerequisites :
- Node.js (v16 or higher).
- npm or yarn.

Install dependencies :
```sh
npm install
```

Development server :
```sh
npm run dev
```
Opens dev server at http://localhost:8000 with hot reload.

Build for production :
```sh
npm run build
```
Builds optimized files into `www/` directory.

Create distribution package :
```sh
npm run zip
```
Creates a `dist/game.zip` ready for deployment to itch.io, Newgrounds, or web hosting.

Lint code :
```sh
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

# LICENSES

Code : [MIT License](LICENSE.md) - Free to use, modify, and distribute.
Graphic Assets : [CC BY-SA 4.0](ASSETS_LICENSE.md) - Attribution required, share-alike.

# AUTHOR

RG Beaumont.

---

Version : 0.9.1  
Made with [Kaplay.js](https://kaplayjs.com/).
