import { player, playerStats } from '../entities/player.js';
import { addDustTrail } from '../lib/effects.js';
import { addObject } from './generators.js';
import { addRareObject_UI } from './ui.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const gameObjectList = {

    tomatoArmor: {
        objectType: 'tomatoArmor',
        scoreValue: 20,
        count: 0,
        comboMessage: 'YOU GOT THE TOMATO ARMOR !',
        comboEvent: () => {
          play('buff', { volume: .25});

          player.enterState('armorIdle');
            if (gameObjectList.tomatoArmor.count < 1) {
                addRareObject_UI('tomatoArmor');
                playerStats.speed = playerStats.speed - 100;
                gameObjectList.tomatoArmor.count++; 
            }
        }
    },
    superPiment: {
        objectType: 'superPiment',
        scoreValue: 20,
        count: 0,
        comboMessage: 'YOU GOT THE SUPER PIMENT !',
        comboEvent: () => {
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
        comboEvent: () => {
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
    sGrape1: {
        objectType: 'sGrape1',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE SUPER GRAPE !',
        comboEvent: () => {
        }
    },
    banana: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO BANANES !',
        comboEvent: () => {
            wait(.8, () => {
                addObject('superPiment');
                play('fallen-precious-object');
            });    
        }
    },
    pear: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO POIRES !',
        comboEvent: () => {
            wait(.8, () => {    
                addObject('samaraSpeed');
                play('fallen-precious-object');
            });
        }
    },
    sTomato1: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO TOMATES !',
        comboEvent: () => {
            wait(.8, () => {
                addObject('tomatoArmor');
                play('fallen-precious-object');
            });
        }
    },
    virus3Red: {
        objectType: 'defaultObject',
        scoreValue: -10,
        comboMessage: 'COMBO VIRUS RED !',
        isActive: false,
        comboEvent: () => {

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
    virus4Blue: {
        objectType: 'defaultObjectX',
        scoreValue: -15,
        comboEvent: () => { }
    },
    virus5Brown: {
        objectType: 'defaultObjectX',
        scoreValue: -20,
        comboScore: 150,
        comboMessage: 'COMBO VIRUS BROWN !',
        comboEvent: () => {
            // player.enterState('armorIdle');
            // score.value += gameObjectList.banana.comboScore;
            // enemyStats.speed = Math.max(obj.effectMin, enemyStats.speed + obj.effectValue);
            // enemyStats.size = Math.max(obj.effectMin, enemyStats.size + obj.effectValue);
            // debug.log('Ennemi ralenti !');
            // play('ring');
        }
    },
    lemon: {
        objectType: 'bonusObject',
        scoreValue: 5,
        comboEvent: () => { }
    },
    watermelon: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    sPiment1: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    sGrape2: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    strawberry: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },

    heartIngame: {
        objectType: 'heartIngame',
        scoreValue: 0,
        comboEvent: () => { 

        }
    },
    superHeart: {
        objectType: 'superHeart',
        scoreValue: 0,
        comboEvent: () => {

        }
    },

};