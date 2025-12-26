import { player } from './player.js';
import { addObject } from './generators.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets

export const gameObjectList = {
    banana: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboScore: 150,
        comboMessage: 'COMBO BANANES !',
        comboEvent: () => {
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
        objectType: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'COMBO TOMATES !',
        comboEvent: () => {
            addObject('tomatoArmor');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    lemon: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO LEMON !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.lemon.comboMessage);
        }
    },
    watermelon: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO WATERMELON !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.watermelon.comboMessage);
        }
    },
    orange: {
        claobjectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO ORANGE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.orange.comboMessage);
        }
    },
    piment: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO PIMENT !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.piment.comboMessage);
        }
    },
    grape: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO GRAPE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.grape.comboMessage);
        }
    },
    strawberry: {
        objectType: 'defaultObjectX',
        scoreValue: 5,
        comboMessage: 'COMBO STRAWBERRY !',
        comboEvent: () => {
            debug.log(gameObjectList.strawberry.comboMessage);
        }
    },
    virusPurple: {
        objectType: 'defaultObjectX',
        scoreValue: -10,
        comboMessage: 'COMBO VIRUS PURPLE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusPurple.comboMessage);
        }
    },
    virusBlue: {
        objectType: 'defaultObjectX',
        scoreValue: -15,
        comboMessage: 'COMBO VIRUS BLUE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },
    virusBrown: {
        objectType: 'defaultObjectX',
        scoreValue: -20,
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
    tomatoArmor: {
        objectType: 'tomatoArmor',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE TOMATO ARMOR !',
        comboEvent: () => {
            debug.log(gameObjectList.tomatoArmor.comboMessage);
            player.enterState('armorIdle');        }
    },
    superPiment: {
        objectType: 'superPiment',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE SUPER PIMENT !',
        comboEvent: () => {
            debug.log(gameObjectList.superPiment.comboMessage);
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
    blueberry: {
        objectType: 'blueberry',
        scoreValue: -15,
        comboMessage: 'YOU GOT THE BLUEBERRY !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.blueberry.comboMessage);
        }
    },

};