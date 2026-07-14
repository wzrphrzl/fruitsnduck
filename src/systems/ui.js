// UI barrel — re-exports every widget's public API so consumers can keep
// importing from './ui.js'. Each widget lives in ./ui/<widget>.js with its own
// private state and a reset() called by createUI (in ./ui/hud.js).
export { createUI } from './ui/hud.js';
export { showScoreTile } from './ui/scoreTiles.js';
export { showComboTile } from './ui/comboTile.js';
export { renderFruitBoxes } from './ui/fruitBoxes.js';
export { healthPointsUI } from './ui/health.js';
export { addUpgrade_UI } from './ui/upgrades.js';
