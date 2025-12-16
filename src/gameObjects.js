
// Centralise les données des sprites : scores, combos, effets

export const GAME_OBJECTS = {
    banana: {
        score: 20,
        comboScore: 80,
        comboEffect: 'none',
        comboMessage: 'Combo bananes !'
    },
    pear: {
        score: 20,
        comboScore: 150,
        comboEffect: 'none',
        comboMessage: 'Combo poires !'
    },
    tomato: {
        score: 20,
        comboScore: 100,
        comboEffect: 'none',
        comboMessage: 'Combo tomates !'
    },
    virusPurple: {
        score: -10,
        comboEffect: 'none',
        comboMessage: 'Combo virus violet !',
        effectValue: -0.2,
        effectMin: 0.5
    },
    virusBlue: {
        score: -15,
        comboEffect: 'none',
        comboMessage: 'Combo virus bleu !'
    },
    virusBrown: {
        score: -20,
        comboEffect: 'none',
        comboMessage: 'Combo virus brun !',
        effectValue: -10,
        effectMin: 10
    }
};

// Crée des fonctions par combo

export function createComboEvents(score, enemyStats) {
    return {
        tomato: () => {
            debug.log(GAME_OBJECTS.tomato.comboMessage);
        },
        pear: () => {
            debug.log(GAME_OBJECTS.pear.comboMessage);
        },
        banana: () => {
            debug.log(GAME_OBJECTS.banana.comboMessage);
        },
        virusBrown: () => {
            debug.log(obj.comboMessage);
            // score.value += GAME_OBJECTS.banana.comboScore;
            // enemyStats.speed = Math.max(obj.effectMin, enemyStats.speed + obj.effectValue);
            // enemyStats.size = Math.max(obj.effectMin, enemyStats.size + obj.effectValue);
            // debug.log('Ennemi ralenti !');
            // play('ring');
        },
        virusPurple: () => {
            debug.log(GAME_OBJECTS.virusPurple.comboMessage);
        },
        virusBlue: () => {
            debug.log(GAME_OBJECTS.virusBlue.comboMessage);
        }
    };
}

// RÉCUP TOUS LES SPRITES DANS UN OBJET
const SPRITE_NAMES = Object.keys(GAME_OBJECTS);

// CRÉE UN OBJET AVEC LE NOM DES SPRITES ET LEURS FONCTIONS QUI SONT ASSOCIÉES
export function createGameSprites() {
    return SPRITE_NAMES.map(name => sprite(name));
}
