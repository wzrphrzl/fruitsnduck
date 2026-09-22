import { objects } from './objects.js';

// SUPER FRUIT PROGRESSION — lasts one game (reset by fruitCombo at game start).
// Each super fruit family spawns at its current tier ; picking up the family's
// super object (superStar, samaraSpeed...) moves it up one tier, capped at MAX_TIER.
const MAX_TIER = 3;
const FAMILIES = ['grape', 'kumquat', 'piment', 'plum', 'tomato'];

let tiers = {};

export function resetProgression() {
    tiers = Object.fromEntries(FAMILIES.map((family) => [family, 1]));
}
resetProgression();

export function advanceTier(family) {
    tiers[family] = Math.min(tiers[family] + 1, MAX_TIER);
}

// A RANDOM SUPER FRUIT KEY (e.g. 'sGrape2') : random family, at that family's current tier.
// Pass it to addObject() instead of a hard-coded 'superFruitT1'.
export function pickSuperFruit() {
    const family = choose(FAMILIES);
    return Object.keys(objects).find((key) =>
        objects[key].family === family && objects[key].tier === tiers[family],
    );
}
