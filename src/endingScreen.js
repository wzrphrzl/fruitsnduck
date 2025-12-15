import { scoreState, addButton, fontStyleMed } from './appInit.js';

/****************/
/*    ENDING    */
/****************/

scene('lose', () => {
 
    setBackground('#0C2E44');
 
    function scorePersonnalisé(param1, param2) {

        const statusEnding = add([
            sprite('duck'),
            pos(width() / 5, height() / 2 - 80),
            scale(1.5),
            anchor('center'),
            layer('ui'),
        ]);

        statusEnding.play(param1);

        add([
            text(param2, fontStyleMed),
            pos(width() / 2, height() / 2 - 160),
            anchor('center'),
            layer('ui'),
        ]);

    }

    if (scoreState.savedScore > 0) {
        scorePersonnalisé('win', 'Bien joué !');
    } else if (scoreState.savedScore <= 0) {
        scorePersonnalisé('lose', "Mal joué...");
    }

    // display score
    add([
        text('Score total : ' + scoreState.savedScore, fontStyleMed),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
        layer('ui'),
    ]);

    add([
        text('Virus absorbés : ' + scoreState.savedItems, fontStyleMed),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
        layer('ui'),
    ]);

    addButton('Restart', width() / 2, height() / 2 + 180);
});

