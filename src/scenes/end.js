import { scoreStats, fontStyleMedium } from '../appInit.js';
import { addRect, addButton } from '../lib/helpers.js';
import { formatTime } from '../systems/timer.js';
import { palette } from '../lib/colorpalette.js';

scene('lose', () => {

    addRect(1440, 800, 0, 0, 0, palette.green.darkest, 'bg', { fixed: true, area: false });


    // SET A DIFFERENT ENDING BASED ON SCORE (POSITIVE OR NEGATIVE)
    function personalizedScore(param1, param2) {

        // DISPLAY THE DUCK SPRITE

        const posX = width() / 4; 
        const posY = height() / 2;

        add([
            ellipse(120, 120),
            pos(posX, posY),
            color(Color.fromHex(palette.green.darker)),
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
            rect(392, 328, { radius: 8 }),
            pos(width() /2 - 196, height() /2 - 164),
            anchor('topleft'),
            color(Color.fromHex(palette.green.darker)),
            outline(4, Color.fromHex(palette.green.default) ),
            body({ isStatic: true }),
            layer('bg'),
            'scoreMenu',
        ]);
        
        scoreMenu.add([
            text(param2, fontStyleMedium),
            pos(32, 40),
            anchor('topleft'),
            layer('ui'),
        ]);
    
        scoreMenu.add([
            text('Score : ' + scoreStats.savedScore, fontStyleMedium),
            pos(32, 112),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

        //VIRUS COUNT
        scoreMenu.add([
            text('Collected Viruses : ' + scoreStats.virusCount, fontStyleMedium),
            pos(32, 184),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

        //TIME SURVIVED
        scoreMenu.add([
            text('Time survived : ' + formatTime(scoreStats.gameTime), fontStyleMedium),
            pos(32, 256),
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

