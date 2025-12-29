import { player, playerStats } from './player.js';
import { addObject } from './generators.js';
import { addRareObject_UI } from './ui.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const gameObjectList = {
    banana: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO BANANES !',
        comboEvent: () => {
            addObject('superPiment');
        }
    },
    pear: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO POIRES !',
        comboEvent: () => {
            addObject('samaraSpeed');
        }
    },
    tomato: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO TOMATES !',
        comboEvent: () => {
            addObject('tomatoArmor');
        }
    },
    virusPurple: {
        objectType: 'defaultObject',
        scoreValue: -10,
        comboMessage: 'COMBO VIRUS PURPLE !',
        isActive: false,
        comboEvent: () => {  

                if (gameObjectList.virusPurple.isActive) return;
                gameObjectList.virusPurple.isActive = true;
                const previousState = player.state;

                if (player.state == 'armorRun' || player.state == 'armorIdle') {
                    return;
                } else {
                    player.enterState('stressRun');
                }
                wait(1.5, () => {
                    player.enterState(previousState);
                    gameObjectList.virusPurple.isActive = false;
                });

        }
    },
    virusBlue: {
        objectType: 'defaultObjectX',
        scoreValue: -15,
        comboEvent: () => { }
    },
    virusBrown: {
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
    blueberry: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    watermelon: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    orange: {
        claobjectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    piment: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    grape: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    strawberry: {
        objectType: 'bonusObject',
        scoreValue: 20,
        comboEvent: () => { }
    },
    tomatoArmor: {
        objectType: 'tomatoArmor',
        scoreValue: 20,
        count: 0,
        comboMessage: 'YOU GOT THE TOMATO ARMOR !',
        comboEvent: () => {
          play('buff');
          debug.log(gameObjectList.tomatoArmor.comboMessage);
            player.enterState('armorIdle');
            if (gameObjectList.tomatoArmor.count < 1) {
                addRareObject_UI('tomatoArmor');
                playerStats.speed = playerStats.speed - 125;
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
            play('buff');
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
            play('buff');
            if (gameObjectList.samaraSpeed.count < 1) {
                addRareObject_UI('samaraSpeed');
                gameObjectList.samaraSpeed.count++; 
           }

            if (gameObjectList.samaraSpeed.count < 2) {
                playerStats.speed = playerStats.speed + 100;
                gameObjectList.samaraSpeed.count++; 
            }
        }
    },
    superGrape: {
        objectType: 'superGrape',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE SUPER GRAPE !',
        comboEvent: () => {
        }
    },
};