import { renderFruitBoxes } from './ui/fruitBoxes.js';

// PLAYER INVENTORY : the 3 fruit slots the duck carries.
// The state lives here (rather than inside fruitCombo) so both the combo system
// and the player's spit action can reach it without a circular import.

const SLOT_COUNT = 3;

let inventorySlots = new Array(SLOT_COUNT).fill(null);   // sprite names currently held
let fruitSprites   = new Array(SLOT_COUNT).fill(null);   // the sprite objects drawn in the boxes
let inventoryBoxes;                               // the 3 UI boxes, provided by createUI()

// DISPLAY LOCK : after a combo completes, the boxes keep showing the finished trio for a
// moment while the state has already reset — so the player can start the next combo right
// away. While frozen, state changes are silent; the display catches up when it unfreezes.
let displayFrozen = false;
let holdTimer;

// DRAWS `slots` INTO THE BOXES (bumpIndex = the slot to pop, -1 for none)
function render(slots, bumpIndex = -1) {
    fruitSprites = renderFruitBoxes(inventoryBoxes, slots, fruitSprites, bumpIndex);
}

// CALLED ONCE PER GAME SCENE : binds the UI boxes and wipes any state left by a previous run
export function initInventory(boxes) {
    inventoryBoxes = boxes;
    inventorySlots = new Array(SLOT_COUNT).fill(null);
    fruitSprites   = new Array(SLOT_COUNT).fill(null);
    holdTimer?.cancel();
    holdTimer = null;
    displayFrozen = false;
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
    if (!displayFrozen) render(inventorySlots, index);
    return index;
}

// REMOVES THE MOST RECENTLY ADDED FRUIT — returns its sprite name, or null when empty
export function popLastFruit() {
    const index = inventorySlots.findLastIndex(f => f !== null);
    if (index === -1) return null;

    const spriteName = inventorySlots[index];
    inventorySlots[index] = null;
    if (!displayFrozen) render(inventorySlots);
    return spriteName;
}

// A TRIO IS COMPLETE : the state resets immediately (the next combo can start right away)
// while the boxes keep showing the finished trio for `holdTime` seconds.
// `onDisplayClear` runs just before the trio is wiped — hook for a VFX on the boxes.
export function completeCombo(holdTime = 1, onDisplayClear) {
    const completed = [...inventorySlots];
    inventorySlots = new Array(SLOT_COUNT).fill(null);

    render(completed);          // FREEZE THE FINISHED TRIO ON SCREEN
    displayFrozen = true;

    // A NEW TRIO MAY COMPLETE WHILE THIS ONE IS STILL SHOWN : drop the pending catch-up
    holdTimer?.cancel();
    holdTimer = wait(holdTime, () => {
        holdTimer = null;
        displayFrozen = false;
        onDisplayClear?.();       // VFX FIRES WHILE THE TRIO IS STILL ON SCREEN
        render(inventorySlots);   // CATCH UP WITH WHATEVER WAS COLLECTED MEANWHILE
    });
}
