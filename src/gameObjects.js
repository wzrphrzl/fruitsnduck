
// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets

export const gameObjectList = {
    banana: {
        score: 20,
        comboScore: 150,
        comboMessage: 'Combo bananes !',
        comboEvent: () => {
            debug.log(gameObjectList.banana.comboMessage);
        }
    },
    pear: {
        score: 20,
        comboMessage: 'Combo poires !',
        comboEvent: () => {
            debug.log(gameObjectList.pear.comboMessage);
        }
    },
    tomato: {
        score: 20,
        comboMessage: 'Combo tomates !',
        comboEvent: () => {
            debug.log(gameObjectList.tomato.comboMessage);
        }
    },
    virusPurple: {
        score: -10,
        comboMessage: 'Combo virus PURPLE !',
        comboEvent: () => {
            debug.log(gameObjectList.virusPurple.comboMessage);
        }
    },
    virusBlue: {
        score: -15,
        comboMessage: 'Combo virus BLUE !',
        comboEvent: () => {
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    },
    virusBrown: {
        score: -20,
        comboMessage: 'Combo virus BROWN !',
        comboEvent: () => {
            debug.log(gameObjectList.virusBrown.comboMessage);
            // score.value += gameObjectList.banana.comboScore;
            // enemyStats.speed = Math.max(obj.effectMin, enemyStats.speed + obj.effectValue);
            // enemyStats.size = Math.max(obj.effectMin, enemyStats.size + obj.effectValue);
            // debug.log('Ennemi ralenti !');
            // play('ring');
        }
    }

};

// CREATES AN ARRAY WITH THE NAMES OF ALL GAME OBJECTS
const gameObjects = Object.keys(gameObjectList);

// CRÉE UN OBJET AVEC LE NOM DES SPRITES ET LEURS FONCTIONS QUI SONT ASSOCIÉES
export function addObjectSprites() {
    return gameObjects.map(gameObjectName => sprite(gameObjectName));
}
