import { k, scoreStats, fontStyleMed, fontStyleSmall } from './appInit.js';
import { addButton, addRect } from './generators.js';

scene('lose', () => {

    addRect(1440, 800, 0, 0, 0, '#0C3131', 'bg', { fixed: true, area: false });


    // SET A DIFFERENT ENDING BASED ON SCORE (POSITIVE OR NEGATIVE)
    function personalizedScore(param1, param2) {

        // DISPLAY THE DUCK SPRITE

        const posX = width() / 4; 
        const posY = height() / 2;

        add([
            ellipse(120, 120),
            pos(posX, posY),
            color(Color.fromHex('#134C4C')),
            anchor('center'),
            layer('game'),
        ]);

        const statusEnding = add([
            sprite('duck'),
            pos(posX, posY - 8),
            scale(1.25),
            anchor('center'),
            layer('ui'),
        ]);

        statusEnding.play(param1);


        // SCORE DISPLAY

        const scoreMenu = add([
            rect(392, 256, { radius: 8 }),
            pos(width() /2 - 196, height() /2 - 128),
            anchor('topleft'),
            color(Color.fromHex('#134C4C')),
            outline(4, Color.fromHex('#33984B') ),
            body({ isStatic: true }),
            layer('bg'),
            'scoreMenu',
        ]);
        
        scoreMenu.add([
            text(param2, fontStyleSmall),
            pos(32, 40),
            anchor('topleft'),
            layer('ui'),
        ]);
    
        scoreMenu.add([
            text('Total Score : ' + scoreStats.savedScore, fontStyleSmall),
            pos(32, 112),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

        //VIRUS COUNT
        scoreMenu.add([
            text('Collected Viruses : ' + scoreStats.virusCount, fontStyleSmall),
            pos(32, 184),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

    }

    if (scoreStats.savedScore > 0) {
        personalizedScore('win', 'Well done!');
    } else if (scoreStats.savedScore <= 0) {
        personalizedScore('lose', "Better luck next time...");
    }

    addButton('Restart', width() / 2, height() / 2 + 216);
});

