/**
 * Configuration des objets du jeu
 * Centralise les données des sprites : scores, combos, effets
 */

export const GAME_OBJECTS = {
    banana: {
        score: 20,
        comboScore: 80,
        comboEffect: 'sound',
        comboMessage: 'Combo bananes !'
    },
    pear: {
        score: 20,
        comboScore: 150,
        comboEffect: 'sound',
        comboMessage: 'Combo poires !'
    },
    tomato: {
        score: 20,
        comboScore: 100,
        comboEffect: 'sound',
        comboMessage: 'Combo tomates !'
    },
    virusPurple: {
        score: -10,
        comboEffect: 'reduceEnemySize',
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
        comboEffect: 'slowEnemy',
        comboMessage: 'Combo virus brun !',
        effectValue: -10,
        effectMin: 10
    }
};

// Récupère la liste des noms de sprites
export const SPRITE_NAMES = Object.keys(GAME_OBJECTS);

/**
 * Crée les événements de combo basés sur la config
 */
export function createComboEvents(score, enemyStats) {
    return {
        tomato: () => {
            debug.log(GAME_OBJECTS.tomato.comboMessage);
            score.value += GAME_OBJECTS.tomato.comboScore;
            play('ring');
        },
        pear: () => {
            debug.log(GAME_OBJECTS.pear.comboMessage);
            score.value += GAME_OBJECTS.pear.comboScore;
            play('ring');
        },
        banana: () => {
            debug.log(GAME_OBJECTS.banana.comboMessage);
            score.value += GAME_OBJECTS.banana.comboScore;
            play('ring');
        },
        virusBrown: () => {
            const obj = GAME_OBJECTS.virusBrown;
            debug.log(obj.comboMessage);
            enemyStats.speed = Math.max(obj.effectMin, enemyStats.speed + obj.effectValue);
            debug.log('Ennemi ralenti !');
        },
        virusPurple: () => {
            const obj = GAME_OBJECTS.virusPurple;
            debug.log(obj.comboMessage);
            enemyStats.size = Math.max(obj.effectMin, enemyStats.size + obj.effectValue);
        },
        virusBlue: () => {
            debug.log(GAME_OBJECTS.virusBlue.comboMessage);
            // Effet spécifique pour virus bleu
        }
    };
}

/**
 * Crée la liste des sprites à partir de la config
 */
export function createGameSprites() {
    return SPRITE_NAMES.map(name => sprite(name));
}
