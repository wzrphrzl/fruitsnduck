import { gameState, addButton } from './appInit.js';

/****************/
/*    ENDING    */
/****************/

scene('lose', () => {
    function scorePersonnalisé(param1, param2) {

        const statusEnding = add([
            sprite(param1),
            pos(width() / 5, height() / 2 - 80),
            scale(1.5),
            anchor('center'),
        ]);

        statusEnding.play('win');

        add([
            text(param2, {
                font: 'Nunito',
                size: 56,
            }),
            pos(width() / 2, height() / 2 - 160),
            anchor('center'),
        ]);

    }

    if (gameState.scoreEnregistré > 0) {
        scorePersonnalisé('duck', 'Bien joué !');
    } else if (gameState.scoreEnregistré <= 0) {
        scorePersonnalisé('duck', "Mal joué...");
    }

    // display score
    add([
        text('Score total : ' + 0 + gameState.scoreEnregistré, {
                font: 'Nunito',
                size: 56,
        }),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
    ]);

    add([
        text('Virus absorbés : ' + 0 + gameState.item, {
                font: 'Nunito',
                size: 56,
        }),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
    ]);

    addButton('Restart', width() / 2, height() / 2 + 180);
});

