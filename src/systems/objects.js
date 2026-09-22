import { player, playerStats } from '../entities/player.js';
import { addDustTrail } from '../lib/effects.js';
import { addObject, addTree, addFlower } from './generators.js';
import { addUpgrade_UI, healthPoints_UI } from './ui.js';
import { setPos } from '../lib/helpers.js';
import { addGameTime } from './timer.js';
import { advanceTier } from './progression.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const objects = {

    // COMMON FRUITS
    cbanana: {
        objectType: 'commonFruit', scoreValue: 5,
    },
    cpear: {
        objectType: 'commonFruit', scoreValue: 6,
    },
    clemon: {
        objectType: 'commonFruit', scoreValue: 7,
    },
    ccherry: {
        objectType: 'commonFruit', scoreValue: 8,
    },
    cwatermelon: {
        objectType: 'commonFruit', scoreValue: 9,
    },
    // SUPER FRUIT — `family` + `tier` drive the spawn progression (see progression.js).
    // A perfectCombo runs the family's event whatever the tier (SUPER_FRUIT_EVENTS below).
    sGrape1: { objectType: 'superFruitT1', family: 'grape', tier: 1, scoreValue: 8, objectEvent: () => SUPER_FRUIT_EVENTS.grape() },
    sGrape2: { objectType: 'superFruitT2', family: 'grape', tier: 2, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.grape() },
    sGrape3: { objectType: 'superFruitT3', family: 'grape', tier: 3, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.grape() },

    sKumquat1: { objectType: 'superFruitT1', family: 'kumquat', tier: 1, scoreValue: 9, objectEvent: () => SUPER_FRUIT_EVENTS.kumquat() },
    sKumquat2: { objectType: 'superFruitT2', family: 'kumquat', tier: 2, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.kumquat() },
    sKumquat3: { objectType: 'superFruitT3', family: 'kumquat', tier: 3, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.kumquat() },

    sPiment1: { objectType: 'superFruitT1', family: 'piment', tier: 1, scoreValue: 12, objectEvent: () => SUPER_FRUIT_EVENTS.piment() },
    sPiment2: { objectType: 'superFruitT2', family: 'piment', tier: 2, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.piment() },
    sPiment3: { objectType: 'superFruitT3', family: 'piment', tier: 3, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.piment() },

    sPlum1: { objectType: 'superFruitT1', family: 'plum', tier: 1, scoreValue: 13, objectEvent: () => SUPER_FRUIT_EVENTS.plum() },
    sPlum2: { objectType: 'superFruitT2', family: 'plum', tier: 2, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.plum() },
    sPlum3: { objectType: 'superFruitT3', family: 'plum', tier: 3, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.plum() },

    sTomato1: { objectType: 'superFruitT1', family: 'tomato', tier: 1, scoreValue: 14, objectEvent: () => SUPER_FRUIT_EVENTS.tomato() },
    sTomato2: { objectType: 'superFruitT2', family: 'tomato', tier: 2, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.tomato() },
    sTomato3: { objectType: 'superFruitT3', family: 'tomato', tier: 3, scoreValue: 10, objectEvent: () => SUPER_FRUIT_EVENTS.tomato() },

    megaFruit: {
        objectType: 'megaFruit', scoreValue: 50,
        objectEvent: () => {
            play('pickedHeartInGame');
        }
    },

    // TEMPORARY BONUS
    heartIngame: {
        objectType: 'heartIngame', scoreValue: 0,
        objectEvent: () => {
            play('pickedHeartInGame');
            player.hp += 1;
        }
    },

    // DEFINITIVE BONUS
    superStar: {
        objectType: 'superStar', scoreValue: 0,
        objectEvent: () => {
            advanceTier('grape');
            playerStats.superStar += 1;
            addUpgrade_UI('superStar');
        }
    },

    superHeart: {
        objectType: 'superHeart', scoreValue: 0,
        objectEvent: () => {
            advanceTier('plum');
            play('pickedSuperHeart');
            player.maxHP += 1;
            healthPoints_UI(player.maxHP - 1);
        }
    },
    superTomatoArmor: {
        objectType: 'superTomatoArmor', scoreValue: 20,
        count: 0,
        objectEvent: () => {
            advanceTier('tomato');
            play('pickedSuperTomatoArmor');
            playerStats.armor = 1;
            player.enterState('armorIdle');
            addUpgrade_UI('superTomatoArmor');
            if (objects.superTomatoArmor.count < 1) {
                playerStats.speedKaplay = playerStats.speedKaplay - 110;
                objects.superTomatoArmor.count++;
            }
        }
    },
    superPiment: {
        objectType: 'superPiment', scoreValue: 20,
        count: 0,
        objectEvent: () => {
            advanceTier('piment');
            play('pickedSuperPiment');
            playerStats.mines += 8;
            addUpgrade_UI('superPiment');
            if (player.state == 'defaultRun' || player.state == 'defaultIdle' || player.state == 'stressRun' || player.state == 'stressIdle') {
                player.enterState('orangeIdle');
            }
        }
    },
    samaraSpeed: {
        objectType: 'samaraSpeed', scoreValue: 20,
        count: 0,
        objectEvent: () => {
            advanceTier('kumquat');
            play('pickedSamaraSpeed');
            playerStats.speed += 1;
            addUpgrade_UI('samaraSpeed');
            if (objects.samaraSpeed.count < 1) {
                addDustTrail(player);
                objects.samaraSpeed.count++;
            }

            if (objects.samaraSpeed.count < 2) {
                playerStats.speedKaplay = playerStats.speedKaplay + 100;
                objects.samaraSpeed.count++;
            }
        }
    },

    // VIRUS
    virus3Red: {
        objectType: 'virus', scoreValue: -10,
        isActive: false,
        objectEvent: () => virusStress(objects.virus3Red),
    },

    // ACORN 
    acorn: {
        objectType: 'acorn', scoreValue: 0,
        objectEvent: () => {
            play('pickedAcorn');
            const spot = setPos(player, 140);
            addTree(spot.x, spot.y);
        }
    },

    // PLANTS 
    dandelionChrono: {
        objectType: 'dandelionChrono', scoreValue: 0,
        objectEvent: () => {
            play('pickedDandelionChrono');
            addGameTime(20);
        }
    },
    thistle: {
        objectType: 'thistle', scoreValue: 0,
        objectEvent: (source) => {
            // ARMOR : crush the thistle into a flower (at the thistle) instead of taking damage
            if (player.state.startsWith('armor')) {
                addFlower(source.pos.x, source.pos.y);
                return;
            }
            play('soundStress');
            player.hp -= 1;
        }
    },

};


// PERFECT COMBO OF A SUPER FRUIT FAMILY (any tier) : drops that family's super object
const SUPER_FRUIT_EVENTS = {
    grape: () => {
        addObject('superStar');
        wait(2, () => { play('fallen-precious-object') });
    },
    kumquat: () => {
        addObject('samaraSpeed');
        wait(2, () => { play('fallen-precious-object') });
    },
    piment: () => {
        addObject('superPiment');
        wait(2, () => { play('fallen-precious-object') });
    },
    plum: () => {
        addObject('superHeart');
    },
    tomato: () => {
        wait(.8, () => {
            addObject('superTomatoArmor');
            wait(2, () => { play('fallen-precious-object') });
        });
    },
};

//
//  ADDITIONAL FUNCTIONS
//
function virusStress(virus) {
    if (virus.isActive) return;
    // ARMOR MAKES THE PLAYER IMMUNE
    if (player.state.startsWith('armor')) return;

    virus.isActive = true;
    const previousState = player.state;
    player.enterState('stressRun');
    play('soundStress');
    wait(1.5, () => {
        player.enterState(previousState);
        virus.isActive = false;
    });
}