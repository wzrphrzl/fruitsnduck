import { objects } from './objects.js';
import { addObject, addPlant, addTree } from './generators.js';
import { setPos } from '../lib/helpers.js';
import { palette } from '../lib/colorpalette.js';
import { pickSuperFruit } from './progression.js';

// WILDCARD FRUITS : they take on the identity of the trio's other fruits, but only
// when those are all identical — a wildcard completes a pair, it never creates one.
const WILDCARDS = ['megaFruit'];

// REPLACE THE WILDCARDS OF A TRIO BY THE FRUIT THEY STAND FOR, so the rest of the
// combo logic (classification, perfect-combo event, loot tables) never has to know
// they exist. Returns the slots untouched when no substitution applies :
//   megaFruit + 2 identical fruits  → 3 of that fruit (nearPerfect / perfect)
//   megaFruit + 2 different fruits  → left as is → 3 different sprites → baseCombo
//   3 megaFruits                    → left as is → megaCombo (see classifyCombo)
export function resolveWildcards(slots) {
    const real = slots.filter(s => !WILDCARDS.includes(s));
    if (real.length === slots.length || real.length === 0) return slots;

    const allSame = real.every(s => s === real[0]);
    if (!allSame) return slots;

    return slots.map(s => (WILDCARDS.includes(s) ? real[0] : s));
}

// CLASSIFY A COMPLETED TRIO (3 non-null sprite names) INTO A COMBO CATEGORY.
// Expects wildcard-resolved slots (see resolveWildcards) :
//   baseCombo        : 3 different fruits
//   unPerfectCombo   : 2 identical fruits + 1 different
//   nearPerfectCombo : 3 identical common fruits
//   perfectCombo     : 3 identical super fruits (any tier)
//   megaCombo        : 3 wildcards — placeholder, no reward defined yet
export function classifyCombo(slots) {
    const allIdentical = slots.every(s => s === slots[0]);

    if (allIdentical) {
        if (WILDCARDS.includes(slots[0])) return 'megaCombo';
        return objects[slots[0]].objectType === 'commonFruit' ? 'nearPerfectCombo' : 'perfectCombo';
    }

    // NOT ALL IDENTICAL → a matching pair means "2 same + 1 different", otherwise all 3 differ
    const hasPair = slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2];
    return hasPair ? 'unPerfectCombo' : 'baseCombo';
}

// LOOT WEIGHT CALCULATOR
function lootWeightCalculator(actions) {
    const total = actions.reduce((somme, a) => somme + a.chance, 0);
    let tirage = Math.random() * total;

    for (const action of actions) {
        tirage -= action.chance;
        if (tirage < 0) {
            return action.run();
        }
    }
}

// WHAT EACH COMBO CATEGORY DROPS WHEN IT COMPLETES.
// ctx : { player } — used to spawn drops near the player.
const COMBO_REWARDS = {
    // 3 DIFFERENT FRUITS — 2 super fruits (T1), 2 thistles, a dandelion and a small tree
    baseCombo: ({ player }) => {

        lootWeightCalculator([
            {
                chance: 1, run: () => {
                    for (let i = 0; i < 3; i++) {
                        addObject('commonFruit');
                    }
                }
            },
            {
                chance: 2, run: () => {
                    const spot = setPos(player, 100);
                    addPlant('dandelionChrono', spot.x, spot.y, 'dandelionChronoGrows');
                }
            },
        ]);

        for (let i = 0; i < 1; i++) {
            const spot = setPos(player, 100);
            addPlant('thistle', spot.x, spot.y);
        }

        const treeSpot = setPos(player, 100);
        addPlant('treeSmall', treeSpot.x, treeSpot.y);

    },

    // 2 SAME + 1 DIFFERENT — same drop as baseCombo for now
    unPerfectCombo: ({ player }) => {

        lootWeightCalculator([
            {
                chance: 3, run: () => {
                    for (let i = 0; i < 2; i++) {
                        addObject(pickSuperFruit());
                    }
                }
            },
            {
                chance: 1, run: () => {
                    addObject('heartIngame');
                }
            },
        ]);

        for (let i = 0; i < 2; i++) {
            const spot = setPos(player, 100);
            addPlant('thistle', spot.x, spot.y);
        }

        const treeSpot = setPos(player, 100);
        addPlant('treeSmall', treeSpot.x, treeSpot.y);
    },

    // 3 IDENTICAL COMMON FRUITS — a heart and a dandelion (time bonus)
    nearPerfectCombo: ({ player }) => {

        lootWeightCalculator([
            {
                chance: 2, run: () => {
                    addObject('megaFruit');
                }
            },
            {
                chance: 1, run: () => {
                    addObject('heartIngame');
                }
            },
        ]);

        for (let i = 0; i < 2; i++) {
            const spot = setPos(player, 100);
            addPlant('thistle', spot.x, spot.y);
        }

        const treeSpot = setPos(player, 100);
        addPlant('treeSmall', treeSpot.x, treeSpot.y);

    },

    // 3 IDENTICAL SUPER FRUITS (T1) — handled per-fruit in fruitcombo.js
    perfectCombo: () => {




        for (let i = 0; i < 2; i++) {
            const spot = setPos(player, 100);
            addPlant('thistle', spot.x, spot.y);
        }

        const treeSpot = setPos(player, 100);
        addPlant('treeSmall', treeSpot.x, treeSpot.y);

    },

    // 3 MEGA FRUITS — a whole orchard : 4 trees growing one after the other
    megaCombo: ({ player }) => {
        for (let i = 0; i < 4; i++) {
            // The spot is picked at spawn time, so each tree avoids the previous ones
            wait(i * 0.25, () => {
                const spot = setPos(player, 140);
                addTree(spot.x, spot.y);
            });
        }
    },
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
    nearPerfectCombo: 'perfectCombo',
    perfectCombo: 'perfectCombo',
    megaCombo: 'perfectCombo',
};

// PLAY A COMBO CATEGORY'S SOUND (no-op if the category has none).
export function playComboSound(category) {
    const sound = COMBO_SOUNDS[category];
    if (sound) play(sound);
}

// EXPLOSION SPRITE POPPED IN THE INVENTORY BOXES WHEN A COMBO COMPLETES.
// Each sprite needs a 'default' anim with loop: false (see addExplosion).
const COMBO_EXPLOSIONS = {
    baseCombo: 'explosion2',
    unPerfectCombo: 'explosion3',
    nearPerfectCombo: 'explosion4',
    perfectCombo: 'explosion4',
    megaCombo: 'explosion4',
};

// SPRITE NAME FOR A COMBO CATEGORY'S EXPLOSION.
export function comboExplosion(category) {
    return COMBO_EXPLOSIONS[category] ?? 'explosion1';
}

// LABEL SHOWN IN THE COMBO TILE FOR EACH CATEGORY (decoupled from the code name).
const COMBO_LABELS = {
    baseCombo: 'Compote',
    unPerfectCombo: 'Crumble',
    nearPerfectCombo: 'Crumble',
    perfectCombo: 'Smoothie',
    megaCombo: 'Mega',
};

// DISPLAY LABEL FOR A COMBO CATEGORY (falls back to the raw category name).
export function comboLabel(category) {
    return COMBO_LABELS[category] ?? category;
}

// COMBO TILE COLORS PER CATEGORY : `bg` fills the box, `accent` paints both the
// outline and the label text.
const COMBO_COLORS = {
    baseCombo: { bg: palette.slate.darkest, accent: palette.magenta.lighter },
    unPerfectCombo: { bg: palette.brown.darkest, accent: palette.yellowOrange.darker },
    nearPerfectCombo: { bg: palette.blue.darkest, accent: palette.yellowOrange.bright },
    perfectCombo: { bg: palette.magenta.darkest, accent: palette.yellowOrange.bright },
    megaCombo: { bg: palette.magenta.darkest, accent: palette.yellowOrange.bright },
};

// COLORS FOR A COMBO CATEGORY (falls back to the baseCombo pair).
export function comboColors(category) {
    return COMBO_COLORS[category] ?? COMBO_COLORS.baseCombo;
}
