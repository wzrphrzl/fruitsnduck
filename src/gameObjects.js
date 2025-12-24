import { player } from './player.js';

// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets

export const gameObjectList = {
    banana: {
        class: 'defaultObject',
        scoreValue: 5,
        comboScore: 150,
        comboMessage: 'Combo bananes !',
        comboEvent: () => {
            player.enterState('orangeIdle');
            debug.log(gameObjectList.banana.comboMessage);
        }
    },
    pear: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo poires !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.pear.comboMessage);
        }
    },
    tomato: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo tomates !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    lemon: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo lemon !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    watermelon: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo lemon !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    orange: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo lemon !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    piment: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo lemon !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    grape: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo lemon !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    strawberry: {
        class: 'defaultObject',
        scoreValue: 5,
        comboMessage: 'Combo strawberry !',
        comboEvent: () => {
            debug.log(gameObjectList.strawberry.comboMessage);
        }
    },
    virusPurple: {
        class: 'defaultObject',
        scoreValue: -10,
        comboMessage: 'Combo virus PURPLE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusPurple.comboMessage);
        }
    },
    virusBlue: {
        class: 'defaultObject',
        scoreValue: -15,
        comboMessage: 'Combo virus BLUE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },
    virusBrown: {
        class: 'defaultObject',
        scoreValue: -20,
        comboMessage: 'Combo virus BROWN !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBrown.comboMessage);
            // score.value += gameObjectList.banana.comboScore;
            // enemyStats.speed = Math.max(obj.effectMin, enemyStats.speed + obj.effectValue);
            // enemyStats.size = Math.max(obj.effectMin, enemyStats.size + obj.effectValue);
            // debug.log('Ennemi ralenti !');
            // play('ring');
        }
    },
    tomatoArmor: {
        class: 'rareObject',
        scoreValue: -15,
        comboMessage: 'You got the TOMATO ARMOR !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },
    superPiment: {
        class: 'rareObject',
        scoreValue: -15,
        comboMessage: 'You got the SUPER PIMENT !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },

    superGrape: {
        class: 'rareObject',
        scoreValue: -15,
        comboMessage: 'Combo virus BLUE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },
    blueberry: {
        class: 'rareObject',
        scoreValue: -15,
        comboMessage: 'Combo virus BLUE !',
        comboEvent: () => {
            player.enterState('armorIdle');
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },


};

// CREATES AN ARRAY WITH THE NAMES OF ALL GAME OBJECTS
const gameObjects = Object.keys(gameObjectList);

// CRÉE UN OBJET AVEC LE NOM DES SPRITES ET LEURS FONCTIONS QUI SONT ASSOCIÉES
export function addObjectSprites() {
    return gameObjects.map(gameObjectName => sprite(gameObjectName));
}
