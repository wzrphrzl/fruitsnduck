import { player, playerStats } from '../entities/player.js';
import { addDustTrail } from '../lib/effects.js';
import { addObject } from './generators.js';
import { addUpgrade_UI, healthPointsUI } from './ui.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const objectList = {

    // COMMON FRUITS
    cbanana: {
        objectType: 'commonFruit',
        scoreValue: 5,
    },
    cpear: {
        objectType: 'commonFruit',
        scoreValue: 6,
    },
    clemon: {
        objectType: 'commonFruit',
        scoreValue: 7,
    },
    cstrawberry: {
        objectType: 'commonFruit',
        scoreValue: 8,
    },
    cwatermelon: {
        objectType: 'commonFruit',
        scoreValue: 9,
    },
    // SUPER FRUIT
    sGrape1: {
        objectType: 'superFruitT1',
        scoreValue: 8,
        objectEvent: () => {
            addObject('superStar');
            wait(2, () => {play('fallen-precious-object')});
      }
    },
    sGrape2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
    },
    sGrape3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
    },
    sKumquat1: {
        objectType: 'superFruitT1',
        scoreValue: 9,
        objectEvent: () => {
            addObject('samaraSpeed');
            wait(2, () => {play('fallen-precious-object')});
        }
    },
    sKumquat2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
    },
    sKumquat3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
    },
    sPiment1: {
        objectType: 'superFruitT1',
        scoreValue: 12,
        objectEvent: () => {
                addObject('superPiment');
                wait(2, () => {play('fallen-precious-object')});
        }
    },
    sPiment2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
    },
    sPiment3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
    },
    sPlum1: {
        objectType: 'superFruitT1',
        scoreValue: 13,
        objectEvent: () => {
            addObject('superHeart');
        }
    },
    sPlum2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
    },
    sPlum3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
    },
    sTomato1: {
        objectType: 'superFruitT1',
        scoreValue: 14,
        objectEvent: () => {
            wait(.8, () => {
                addObject('superTomatoArmor');
                wait(2, () => {play('fallen-precious-object')});
            });
        }
    },
    sTomato2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
    },
    sTomato3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
    },

    // TEMPORARY BONUS
    heartIngame: {
        objectType: 'heartIngame',
        scoreValue: 0,
        objectEvent: () => {
            player.hp += 1;
        }
    },

    // DEFINITIVE BONUS
    superStar: {
        objectType: 'superStar',
        scoreValue: 0,
        objectEvent: () => {
            playerStats.superStar += 1;
            addUpgrade_UI('superStar');
        }
    },

    superHeart: {
        objectType: 'superHeart',
        scoreValue: 0,
        objectEvent: () => {
            player.maxHP += 1;
            healthPointsUI(player.maxHP - 1);
        }
    },
    superTomatoArmor: {
        objectType: 'superTomatoArmor',
        scoreValue: 20,
        count: 0,
        objectEvent: () => {
          play('buff', { volume: .25});

          playerStats.armor = 1;
          player.enterState('armorIdle');
          addUpgrade_UI('superTomatoArmor');
            if (objectList.superTomatoArmor.count < 1) {
                playerStats.speedKaplay = playerStats.speedKaplay - 110;
                objectList.superTomatoArmor.count++;
            }
        }
    },   
    superPiment: {
        objectType: 'superPiment',
        scoreValue: 20,
        count: 0,
        objectEvent: () => {
            playerStats.mines += 5;
            play('buff', { volume: .25});
            addUpgrade_UI('superPiment');
            if (player.state == 'defaultRun' || player.state == 'defaultIdle' || player.state == 'stressRun' || player.state == 'stressIdle') {
                player.enterState('orangeIdle');
            }
        }
    },
    samaraSpeed: {
        objectType: 'samaraSpeed',
        scoreValue: 20,
        count: 0,
        objectEvent: () => {
            play('buff', { volume: .25});
            playerStats.speed += 1;
            addUpgrade_UI('samaraSpeed');
            if (objectList.samaraSpeed.count < 1) {
                addDustTrail(player);
                objectList.samaraSpeed.count++;
           }

            if (objectList.samaraSpeed.count < 2) {
                playerStats.speedKaplay = playerStats.speedKaplay + 100;
                objectList.samaraSpeed.count++; 
            }
        }
    },

    // VIRUS
    virus3Red: {
        objectType: 'virus',
        scoreValue: -10,
        isActive: false,
        objectEvent: () => {

                if (objectList.virus3Red.isActive) return;
                objectList.virus3Red.isActive = true;
                const previousState = player.state;

                if (player.state == 'armorRun' || player.state == 'armorIdle') {
                    return;
                } else {
                    player.enterState('stressRun');
                    play('soundStress');
                }
                wait(1.5, () => {
                    player.enterState(previousState);
                    objectList.virus3Red.isActive = false;
                });

        }
    },

};