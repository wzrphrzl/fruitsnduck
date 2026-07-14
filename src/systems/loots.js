import { objectList } from './objects.js';
import { addObject, addDandelionChrono, addThistle } from './generators.js';
import { setFreePos } from '../lib/helpers.js';

// CLASSIFY A COMPLETED TRIO (3 non-null sprite names) INTO A COMBO CATEGORY:
//   perfectCombo   : 3 identical super fruits (T1)
//   baseCombo      : 3 identical common fruits
//   imperfectCombo : anything else (2 same + 1 different, or 3 different)
export function classifyCombo(slots) {
    const allIdentical = slots.every(s => s === slots[0]);

    if (allIdentical) {
        return objectList[slots[0]].objectType === 'commonFruit' ? 'baseCombo' : 'perfectCombo';
    }
    return 'imperfectCombo';
}

// WHAT EACH COMBO CATEGORY DROPS WHEN IT COMPLETES.
// ctx : { player } — used to spawn drops near the player.
const COMBO_REWARDS = {
    // 3 IDENTICAL SUPER FRUITS (T1) — handled per-fruit in fruitcombo.js
    perfectCombo: () => {},

    // 3 IDENTICAL COMMON FRUITS — a heart and a dandelion (time bonus)
    baseCombo: ({ player }) => {
        addObject('heartIngame');
        const spot = setFreePos(player, 100);
        addDandelionChrono(spot.x, spot.y);
    },

    // 2 SAME + 1 DIFFERENT, OR 3 DIFFERENT — 2 super fruits (T1), 6 thistles and a dandelion
    imperfectCombo: ({ player }) => {
        addObject('superFruitT1');
        addObject('superFruitT1');
        for (let i = 0; i < 6; i++) {
            const spot = setFreePos(player, 100);
            addThistle(spot.x, spot.y);
        }
        const spot = setFreePos(player, 100);
        addDandelionChrono(spot.x, spot.y);
    },
};

// RUN A COMBO CATEGORY'S REWARD (no-op if the category has none).
export function resolveCombo(category, ctx) {
    const reward = COMBO_REWARDS[category];
    if (reward) reward(ctx);
}
