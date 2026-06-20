import { scoreStats, fontStyleMed } from './appInit.js';
import { addButton, addRect } from './generators.js';

scene('lose', () => {

    addRect(1440, 800, 0, 0, 0, '#0C3131', 'bg', { fixed: true, area: false });

    // SET A DIFFERENT ENDING BASED ON SCORE (POSITIVE OR NEGATIVE)
    function personalizedScore(param1, param2) {

        const statusEnding = add([
            sprite('duck'),
            pos(width() / 5, height() / 2 - 80),
            scale(2),
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

    if (scoreStats.savedScore > 0) {
        personalizedScore('win', 'Well done!');
    } else if (scoreStats.savedScore <= 0) {
        personalizedScore('lose', "Better luck next time...");
    }

    // SCORE DISPLAY
    add([
        text('Total Score : ' + scoreStats.savedScore, fontStyleMed),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
        layer('ui'),
    ]);

    add([
        text('Collected Viruses : ' + scoreStats.virusCount, fontStyleMed),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
        layer('ui'),
    ]);

    addButton('Restart', width() / 2, height() / 2 + 180);
});

