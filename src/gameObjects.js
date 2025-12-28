import { player, playerStats } from './player.js';
import { addObject } from './generators.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets
export const gameObjectList = {
    banana: {
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO BANANES !',
        comboEvent: () => {
            addObject('superPiment');
            debug.log(gameObjectList.banana.comboMessage);
        }
    },
    pear: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO POIRES !',
        comboEvent: () => {
            player.enterState('orangeIdle');
            debug.log(gameObjectList.pear.comboMessage);
        }
    },
    tomato: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO TOMATES !',
        comboEvent: () => {
            addObject('tomatoArmor');
            debug.log(gameObjectList.tomato.comboMessage);
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
        comboMessage: 'COMBO VIRUS BLUE !',
        comboEvent: () => {
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },
    virusBrown: {
        objectType: 'defaultObjectX',
        scoreValue: -20,
        comboScore: 150,
        comboMessage: 'COMBO VIRUS BROWN !',
        comboEvent: () => {
            debug.log(gameObjectList.virusBrown.comboMessage);
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
        comboMessage: 'COMBO LEMON !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.lemon.comboMessage);
        }
    },
    blueberry: {
        objectType: 'bonusObject',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE BLUEBERRY !',
        comboEvent: () => {
            debug.log(gameObjectList.blueberry.comboMessage);
        }
    },
    watermelon: {
        objectType: 'bonusObject',
        scoreValue: 5,
        comboMessage: 'COMBO WATERMELON !',
        comboEvent: () => {
            debug.log(gameObjectList.watermelon.comboMessage);
        }
    },
    orange: {
        claobjectType: 'bonusObject',
        scoreValue: 5,
        comboMessage: 'COMBO ORANGE !',
        comboEvent: () => {
            debug.log(gameObjectList.orange.comboMessage);
        }
    },
    piment: {
        objectType: 'bonusObject',
        scoreValue: 5,
        comboMessage: 'COMBO PIMENT !',
        comboEvent: () => {
            debug.log(gameObjectList.piment.comboMessage);
        }
    },
    grape: {
        objectType: 'bonusObject',
        scoreValue: 5,
        comboMessage: 'COMBO GRAPE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.grape.comboMessage);
        }
    },
    strawberry: {
        objectType: 'bonusObject',
        scoreValue: 5,
        comboMessage: 'COMBO STRAWBERRY !',
        comboEvent: () => {
            debug.log(gameObjectList.strawberry.comboMessage);
        }
    },
    tomatoArmor: {
        objectType: 'tomatoArmor',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE TOMATO ARMOR !',
        comboEvent: () => {
            debug.log(gameObjectList.tomatoArmor.comboMessage);
            player.enterState('armorIdle');
        }
    },
    superPiment: {
        objectType: 'superPiment',
        scoreValue: 0,
        comboMessage: 'YOU GOT THE SUPER PIMENT !',
        comboEvent: () => {
            playerStats.poopCount = 3;

            if (player.state == 'defaultRun' || player.state == 'defaultIdle' || player.state == 'stressRun' || player.state == 'stressIdle') {
                player.enterState('orangeIdle');
            }

            debug.log(gameObjectList.superPiment.comboMessage);
        }
    },
    samaraSpeed: {
        objectType: 'samaraSpeed',
        scoreValue: 0,
        comboMessage: 'YOU GOT THE SAMARA SPEED !',
        comboEvent: () => {
            debug.log(gameObjectList.samaraSpeed.comboMessage);
        }
    },
    superGrape: {
        objectType: 'superGrape',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE SUPER GRAPE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.superGrape.comboMessage);
        }
    },
};