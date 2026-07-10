import { player, playerStats } from '../entities/player.js';
import { addDustTrail } from '../lib/effects.js';
import { addObject } from './generators.js';
import { addRareObject_UI, healthPointsUI } from './ui.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const gameObjectList = {

    // COMMON OBJECTS

    cbanana: {
        objectType: 'commonObject',
        scoreValue: 5,
        comboMessage: '',
        objectEvent: () => {
            wait(.8, () => {
                addObject('superPiment');
                play('fallen-precious-object');
            });
        }
    },
    cpear: {
        objectType: 'commonObject',
        scoreValue: 5,
        comboMessage: '',
        objectEvent: () => {
            wait(.8, () => {
                addObject('samaraSpeed');
                play('fallen-precious-object');
            });
        }
    },
    sTomato1: {
        objectType: 'commonObject',
        scoreValue: 5,
        comboMessage: '',
        objectEvent: () => {
            wait(.8, () => {
                addObject('superTomatoArmor');
                play('fallen-precious-object');
            });
        }
    },


    // TEMPORARY BONUS
    heartIngame: {
        objectType: 'heartIngame',
        scoreValue: 0,
        objectEvent: () => {
            player.hp += 1;
        }
    },

    //DEFINITIVE BONUS
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
        comboMessage: 'YOU GOT THE TOMATO ARMOR !',
        objectEvent: () => {
          play('buff', { volume: .25});

          player.enterState('armorIdle');
            if (gameObjectList.superTomatoArmor.count < 1) {
                addRareObject_UI('superTomatoArmor');
                playerStats.speed = playerStats.speed - 100;
                gameObjectList.superTomatoArmor.count++; 
            }
        }
    },
    superPiment: {
        objectType: 'superPiment',
        scoreValue: 20,
        count: 0,
        comboMessage: 'YOU GOT THE SUPER PIMENT !',
        objectEvent: () => {
            playerStats.poopCount = 5;
            play('buff', { volume: .25});
            if (gameObjectList.superPiment.count < 1) {
                addRareObject_UI('superPiment');
                gameObjectList.superPiment.count++;
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
        comboMessage: 'YOU GOT THE SAMARA SPEED !',
        objectEvent: () => {
            play('buff', { volume: .25});
            if (gameObjectList.samaraSpeed.count < 1) {
                addRareObject_UI('samaraSpeed');
                addDustTrail(player);   
                gameObjectList.samaraSpeed.count++;
           }

            if (gameObjectList.samaraSpeed.count < 2) {
                playerStats.speed = playerStats.speed + 100;
                gameObjectList.samaraSpeed.count++; 
            }
        }
    },

    // VIRUS
    virus3Red: {
        objectType: 'virus',
        scoreValue: -10,
        comboMessage: 'COMBO VIRUS RED !',
        isActive: false,
        objectEvent: () => {

                if (gameObjectList.virus3Red.isActive) return;
                gameObjectList.virus3Red.isActive = true;
                const previousState = player.state;

                if (player.state == 'armorRun' || player.state == 'armorIdle') {
                    return;
                } else {
                    player.enterState('stressRun');
                    play('soundStress');
                }
                wait(1.5, () => {
                    player.enterState(previousState);
                    gameObjectList.virus3Red.isActive = false;
                });

        }
    },

};