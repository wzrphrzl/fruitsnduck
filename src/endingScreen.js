import { gameState, addButton } from './appInit.js';

/****************/
/*    ENDING    */
/****************/

scene('lose', () => {
    function scorePersonnalisé(param1, param2) {
        add([
            sprite(param1),
            pos(width() / 5, height() / 2 - 80),
            scale(1.5),
            anchor('center'),
        ]);
        add([
            text(param2, {
                font: 'jersey',
                size: 56,
            }),
            pos(width() / 2, height() / 2 - 160),
            anchor('center'),
        ]);
    }

    if (gameState.scoreEnregistré > 0) {
        scorePersonnalisé('duck', 'Fin °1 : Bien joué !');
    } else if (gameState.scoreEnregistré <= 0) {
        scorePersonnalisé('duck', "Fin n°2 : C'est mal joué :(");
    }

    // display score
    add([
        text(0 + gameState.scoreEnregistré + ' score'),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
    ]);

    add([
        text(0 + gameState.item + ' virus'),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
    ]);

    addButton('Restart', width() / 2, height() / 2 + 180);
});

go('menu');
