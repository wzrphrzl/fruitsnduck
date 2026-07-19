import { player, playerStats } from '../entities/player.js';
import { addDustTrail } from '../lib/effects.js';
import { addObject, addTree, addFlower } from './generators.js';
import { addUpgrade_UI, healthPoints_UI } from './ui.js';
import { setPos } from '../lib/helpers.js';
import { addGameTime } from './timer.js';

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
    // SUPER FRUIT
    sGrape1: {
        objectType: 'superFruitT1', scoreValue: 8,
        objectEvent: () => {
            addObject('superStar');
            wait(2, () => {play('fallen-precious-object')});
        }
    },
    sGrape2: {
        objectType: 'superFruitT2', scoreValue: 10,
    },
    sGrape3: {
        objectType: 'superFruitT3', scoreValue: 10,
    },
    sKumquat1: {
        objectType: 'superFruitT1', scoreValue: 9,
        objectEvent: () => {
            addObject('samaraSpeed');
            wait(2, () => {play('fallen-precious-object')});
        }
    },
    sKumquat2: {
        objectType: 'superFruitT2', scoreValue: 10,
    },
    sKumquat3: {
        objectType: 'superFruitT3', scoreValue: 10,
    },
    sPiment1: {
        objectType: 'superFruitT1', scoreValue: 12,
        objectEvent: () => {
            addObject('superPiment');
            wait(2, () => {play('fallen-precious-object')});
        }
    },
    sPiment2: {
        objectType: 'superFruitT2', scoreValue: 10,
    },
    sPiment3: {
        objectType: 'superFruitT3', scoreValue: 10,
    },
    sPlum1: {
        objectType: 'superFruitT1', scoreValue: 13,
        objectEvent: () => {
            addObject('superHeart');
        }
    },
    sPlum2: {
        objectType: 'superFruitT2', scoreValue: 10,
    },
    sPlum3: {
        objectType: 'superFruitT3', scoreValue: 10,
    },
    sTomato1: {
        objectType: 'superFruitT1', scoreValue: 14,
        objectEvent: () => {
            wait(.8, () => {
                addObject('superTomatoArmor');
                wait(2, () => {play('fallen-precious-object')});
            });
        }
    },
    sTomato2: {
        objectType: 'superFruitT2', scoreValue: 10,
    },
    sTomato3: {
        objectType: 'superFruitT3', scoreValue: 10,
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
            playerStats.superStar += 1;
            addUpgrade_UI('superStar');
        }
    },

    superHeart: {
        objectType: 'superHeart', scoreValue: 0,
        objectEvent: () => {
            play('pickedSuperHeart'); 
            player.maxHP += 1;
            healthPoints_UI(player.maxHP - 1);
        }
    },
    superTomatoArmor: {
        objectType: 'superTomatoArmor', scoreValue: 20,
        count: 0,
        objectEvent: () => {
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
            play('pickedSuperPiment');
            playerStats.mines += 5;
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