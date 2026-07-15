import { objectList } from './objects.js';
import { addObject, addDandelionChrono, addThistle } from './generators.js';
import { setFreePos } from '../lib/helpers.js';

// CLASSIFY A COMPLETED TRIO (3 non-null sprite names) INTO A COMBO CATEGORY:
//   baseCombo        : 3 different fruits
//   unPerfectCombo   : 2 identical fruits + 1 different
//   nearPerfectCombo : 3 identical common fruits
//   perfectCombo     : 3 identical super fruits (T1)
export function classifyCombo(slots) {
    const allIdentical = slots.every(s => s === slots[0]);

    if (allIdentical) {
        return objectList[slots[0]].objectType === 'commonFruit' ? 'nearPerfectCombo' : 'perfectCombo';
    }

    // NOT ALL IDENTICAL → a matching pair means "2 same + 1 different", otherwise all 3 differ
    const hasPair = slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2];
    return hasPair ? 'unPerfectCombo' : 'baseCombo';
}

// WHAT EACH COMBO CATEGORY DROPS WHEN IT COMPLETES.
// ctx : { player } — used to spawn drops near the player.
const COMBO_REWARDS = {
    // 3 DIFFERENT FRUITS — 2 super fruits (T1), 6 thistles and a dandelion
    baseCombo: ({ player }) => {
        addObject('superFruitT1');
        addObject('superFruitT1');
        for (let i = 0; i < 2; i++) {
            const spot = setFreePos(player, 100);
            addThistle(spot.x, spot.y);
        }
        const spot = setFreePos(player, 100);
        addDandelionChrono(spot.x, spot.y);
    },

    // 2 SAME + 1 DIFFERENT — same drop as baseCombo for now
    unPerfectCombo: ({ player }) => {
        addObject('superFruitT1');
        addObject('superFruitT1');
        for (let i = 0; i < 2; i++) {
            const spot = setFreePos(player, 100);
            addThistle(spot.x, spot.y);
        }
        play('thistleGrows');

        const spot = setFreePos(player, 100);
        addDandelionChrono(spot.x, spot.y);
    },

    // 3 IDENTICAL COMMON FRUITS — a heart and a dandelion (time bonus)
    nearPerfectCombo: ({ player }) => {
        addObject('heartIngame');
        const spot = setFreePos(player, 100);
        addDandelionChrono(spot.x, spot.y);
    },

    // 3 IDENTICAL SUPER FRUITS (T1) — handled per-fruit in fruitcombo.js
    perfectCombo: () => {},
};

// RUN A COMBO CATEGORY'S REWARD (no-op if the category has none).
export function resolveCombo(category, ctx) {
    const reward = COMBO_REWARDS[category];
    if (reward) reward(ctx);
}

// SOUND PLAYED WHEN A COMBO COMPLETES (nearPerfectCombo reuses the unPerfectCombo clip).
const COMBO_SOUNDS = {
    baseCombo: 'baseCombo',
    unPerfectCombo: 'unPerfectCombo',
    nearPerfectCombo: 'unPerfectCombo',
    perfectCombo: 'perfectCombo',
};

// PLAY A COMBO CATEGORY'S SOUND (no-op if the category has none).
export function playComboSound(category) {
    const sound = COMBO_SOUNDS[category];
    if (sound) play(sound);
}
