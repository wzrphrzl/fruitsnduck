
// GAME OBJECT CENTRALIZATION WITH THEIR ATTRIBUTES : scores, combos, effets

export const gameObjectList = {
    banana: {
        score: 20,
        comboScore: 150,
        comboMessage: 'Combo bananes !',
        onCombo: () => {
            debug.log('Combo bananes !');
        }
    },
    pear: {
        score: 20,
        comboMessage: 'Combo poires !',
        onCombo: () => {
            debug.log('Combo poires !');
        }
    },
    tomato: {
        score: 20,
        comboMessage: 'Combo tomates !',
        onCombo: () => {
            debug.log('Combo tomates !');
        }
    },
    virusPurple: {
        score: -10,
        comboMessage: 'Combo virus PURPLE !',
        onCombo: () => {
            debug.log('Combo virus PURPLE !');
        }
    },
    virusBlue: {
        score: -15,
        comboMessage: 'Combo virus BLUE !',
        onCombo: () => {
            debug.log('Combo virus BLUE !');
        }
    },
    virusBrown: {
        score: -20,
        comboMessage: 'Combo virus BROWN !',
        onCombo: () => {
            debug.log('Combo virus BROWN !');
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
export function createGameSprites() {
    return gameObjects.map(name => sprite(name));
}
