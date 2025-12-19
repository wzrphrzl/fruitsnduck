
// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets

export const gameObjectList = {
    banana: {
        score: 20,
        comboScore: 150,
        comboMessage: 'Combo bananes !'
    },
    pear: {
        score: 20,
        comboMessage: 'Combo poires !'
    },
    tomato: {
        score: 20,
        comboMessage: 'Combo tomates !'
    },
    virusPurple: {
        score: -10,
        comboMessage: 'Combo virus PURPLE !',
    },
    virusBlue: {
        score: -15,
        comboMessage: 'Combo virus BLUE !'
    },
    virusBrown: {
        score: -20,
        comboMessage: 'Combo virus BROWN !',
    }

};

// ADD A SPECIFIC EVENT FOR EACH COMBO
export function createComboEvents() {
    return {
        tomato: () => {
            debug.log(gameObjectList.tomato.comboMessage);
        },
        pear: () => {
            debug.log(gameObjectList.pear.comboMessage);
        },
        banana: () => {
            debug.log(gameObjectList.banana.comboMessage);
        },
        virusBrown: () => {
            debug.log(gameObjectList.virusBrown.comboMessage);
            // score.value += gameObjectList.banana.comboScore;
            // enemyStats.speed = Math.max(obj.effectMin, enemyStats.speed + obj.effectValue);
            // enemyStats.size = Math.max(obj.effectMin, enemyStats.size + obj.effectValue);
            // debug.log('Ennemi ralenti !');
            // play('ring');
        },
        virusPurple: () => {
            debug.log(gameObjectList.virusPurple.comboMessage);
        },
        virusBlue: () => {
            debug.log(gameObjectList.virusBlue.comboMessage);
        }
    };
}

// CREATES AN ARRAY WITH THE NAMES OF ALL GAME OBJECTS
const gameObjects = Object.keys(gameObjectList);

// CRÉE UN OBJET AVEC LE NOM DES SPRITES ET LEURS FONCTIONS QUI SONT ASSOCIÉES
export function createGameSprites() {
    return gameObjects.map(name => sprite(name));
}
