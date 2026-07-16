import { renderFruitBoxes } from './ui/fruitBoxes.js';

// PLAYER INVENTORY : the 3 fruit slots the duck carries.
// The state lives here (rather than inside fruitCombo) so both the combo system
// and the player's spit action can reach it without a circular import.

const SLOT_COUNT = 3;

let inventorySlots = new Array(SLOT_COUNT).fill(null);   // sprite names currently held
let fruitSprites   = new Array(SLOT_COUNT).fill(null);   // the sprite objects drawn in the boxes
let inventoryBoxes = null;                               // the 3 UI boxes, provided by createUI()

// CALLED ONCE PER GAME SCENE : binds the UI boxes and wipes any state left by a previous run
export function initInventory(boxes) {
    inventoryBoxes = boxes;
    inventorySlots = new Array(SLOT_COUNT).fill(null);
    fruitSprites   = new Array(SLOT_COUNT).fill(null);
}

export function getInventorySlots() {
    return [...inventorySlots];
}

export function isInventoryFull() {
    return inventorySlots.every(f => f !== null);
}

// ADDS A FRUIT TO THE NEXT FREE SLOT — returns its slot index, or -1 when there is no room
export function addFruit(spriteName) {
    const index = inventorySlots.findIndex(f => f === null);
    if (index === -1) return -1;

    inventorySlots[index] = spriteName;
    fruitSprites = renderFruitBoxes(inventoryBoxes, inventorySlots, fruitSprites, index);
    return index;
}

// REMOVES THE MOST RECENTLY ADDED FRUIT — returns its sprite name, or null when empty
export function popLastFruit() {
    const index = inventorySlots.findLastIndex(f => f !== null);
    if (index === -1) return null;

    const spriteName = inventorySlots[index];
    inventorySlots[index] = null;
    fruitSprites = renderFruitBoxes(inventoryBoxes, inventorySlots, fruitSprites, -1);
    return spriteName;
}

// EMPTIES THE INVENTORY (STATE + UI)
export function clearInventory() {
    inventorySlots = new Array(SLOT_COUNT).fill(null);
    fruitSprites = renderFruitBoxes(inventoryBoxes, inventorySlots, fruitSprites, -1);
}
