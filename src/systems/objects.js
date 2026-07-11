import { player, playerStats } from '../entities/player.js';
import { addDustTrail } from '../lib/effects.js';
import { addObject } from './generators.js';
import { addRareObject_UI, healthPointsUI } from './ui.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const objectList = {

    // COMMON FRUITS
    cbanana: {
        objectType: 'commonFruit',
        scoreValue: 5,
        objectEvent: () => {
            wait(.8, () => {

            });
        }
    },
    cpear: {
        objectType: 'commonFruit',
        scoreValue: 6,
        objectEvent: () => {
        }
    },
    clemon: {
        objectType: 'commonFruit',
        scoreValue: 7,
        objectEvent: () => {
        }
    },
    cstrawberry: {
        objectType: 'commonFruit',
        scoreValue: 8,
        objectEvent: () => {
        }
    },
    cwatermelon: {
        objectType: 'commonFruit',
        scoreValue: 9,
        objectEvent: () => {
        }
    },
    // SUPER FRUIT
    sGrape1: {
        objectType: 'superFruitT1',
        scoreValue: 10,
        objectEvent: () => {
            addObject('superStar');
        }
    },
    sGrape2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sGrape3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sKumquat1: {
        objectType: 'superFruitT1',
        scoreValue: 10,
        objectEvent: () => {
            addObject('samaraSpeed');
        }
    },
    sKumquat2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sKumquat3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sPiment1: {
        objectType: 'superFruitT1',
        scoreValue: 10,
        objectEvent: () => {
                addObject('superPiment');
                wait(2, () => {play('fallen-precious-object')});
        }
    },
    sPiment2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sPiment3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sPlum1: {
        objectType: 'superFruitT1',
        scoreValue: 10,
        objectEvent: () => {
            addObject('superHeart');
        }
    },
    sPlum2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sPlum3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sTomato1: {
        objectType: 'superFruitT1',
        scoreValue: 5,
        objectEvent: () => {
            wait(.8, () => {
                addObject('superTomatoArmor');
                play('fallen-precious-object');
            });
        }
    },
    sTomato2: {
        objectType: 'superFruitT2',
        scoreValue: 10,
        objectEvent: () => {}
    },
    sTomato3: {
        objectType: 'superFruitT3',
        scoreValue: 10,
        objectEvent: () => {}
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

          player.enterState('armorIdle');
            if (objectList.superTomatoArmor.count < 1) {
                addRareObject_UI('superTomatoArmor');
                playerStats.speed = playerStats.speed - 110;
                objectList.superTomatoArmor.count++; 
            }
        }
    },   
    superPiment: {
        objectType: 'superPiment',
        scoreValue: 20,
        count: 0,
        objectEvent: () => {
            playerStats.poopCount = 5;
            play('buff', { volume: .25});
            if (objectList.superPiment.count < 1) {
                addRareObject_UI('superPiment');
                objectList.superPiment.count++;
            }
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
            if (objectList.samaraSpeed.count < 1) {
                addRareObject_UI('samaraSpeed');
                addDustTrail(player);   
                objectList.samaraSpeed.count++;
           }

            if (objectList.samaraSpeed.count < 2) {
                playerStats.speed = playerStats.speed + 100;
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