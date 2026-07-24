import { objects } from './objects.js';
import { addObject, addPlant } from './generators.js';
import { setPos } from '../lib/helpers.js';

// CLASSIFY A COMPLETED TRIO (3 non-null sprite names) INTO A COMBO CATEGORY:
//   baseCombo        : 3 different fruits
//   unPerfectCombo   : 2 identical fruits + 1 different
//   nearPerfectCombo : 3 identical common fruits
//   perfectCombo     : 3 identical super fruits (T1)
export function classifyCombo(slots) {
    const allIdentical = slots.every(s => s === slots[0]);

    if (allIdentical) {
        return objects[slots[0]].objectType === 'commonFruit' ? 'nearPerfectCombo' : 'perfectCombo';
    }

    // NOT ALL IDENTICAL → a matching pair means "2 same + 1 different", otherwise all 3 differ
    const hasPair = slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2];
    return hasPair ? 'unPerfectCombo' : 'baseCombo';
}

// WHAT EACH COMBO CATEGORY DROPS WHEN IT COMPLETES.
// ctx : { player } — used to spawn drops near the player.
const COMBO_REWARDS = {
    // 3 DIFFERENT FRUITS — 2 super fruits (T1), 2 thistles, a dandelion and a small tree
    baseCombo: ({ player }) => {
        addObject('superFruitT1');
        addObject('superFruitT1');
        for (let i = 0; i < 2; i++) {
            const spot = setPos(player, 100);
            addPlant('thistle', spot.x, spot.y);
        }
        const spot = setPos(player, 100);
        addPlant('dandelionChrono', spot.x, spot.y, 'dandelionChronoGrows');

        const treeSpot = setPos(player, 100);
        addPlant('treeSmall', treeSpot.x, treeSpot.y);
    },

    // 2 SAME + 1 DIFFERENT — same drop as baseCombo for now
    unPerfectCombo: ({ player }) => {
        addObject('superFruitT1');
        addObject('superFruitT1');
        for (let i = 0; i < 2; i++) {
            const spot = setPos(player, 100);
            addPlant('thistle', spot.x, spot.y);
        }
        play('thistleGrows');

        const spot = setPos(player, 100);
        addPlant('dandelionChrono', spot.x, spot.y, 'dandelionChronoGrows');
    },

    // 3 IDENTICAL COMMON FRUITS — a heart and a dandelion (time bonus)
    nearPerfectCombo: ({ player }) => {
        addObject('heartIngame');
        const spot = setPos(player, 100);
        addPlant('dandelionChrono', spot.x, spot.y, 'dandelionChronoGrows');
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

// EXPLOSION SPRITE POPPED IN THE INVENTORY BOXES WHEN A COMBO COMPLETES.
// Each sprite needs a 'default' anim with loop: false (see addExplosion).
const COMBO_EXPLOSIONS = {
    baseCombo: 'explosion1',
    unPerfectCombo: 'explosion1',
    nearPerfectCombo: 'explosion1',
    perfectCombo: 'explosion1',
};

// SPRITE NAME FOR A COMBO CATEGORY'S EXPLOSION.
export function comboExplosion(category) {
    return COMBO_EXPLOSIONS[category] ?? 'explosion1';
}

// LABEL SHOWN IN THE COMBO TILE FOR EACH CATEGORY (decoupled from the code name).
const COMBO_LABELS = {
    baseCombo: 'Salad',
    unPerfectCombo: 'Compote',
    nearPerfectCombo: 'Crumble',
    perfectCombo: 'Smoothie',
};

// DISPLAY LABEL FOR A COMBO CATEGORY (falls back to the raw category name).
export function comboLabel(category) {
    return COMBO_LABELS[category] ?? category;
}
