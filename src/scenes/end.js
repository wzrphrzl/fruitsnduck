import { scoreStats, fontStyleRegular } from '../appInit.js';
import { addRect, addButton } from '../lib/helpers.js';
import { formatTime } from '../systems/timer.js';
import { palette } from '../lib/colorpalette.js';

scene('lose', () => {

    addRect(1440, 800, 0, 0, 0, palette.cyan.darker, 'bg', { fixed: true, area: false });


    // SET A DIFFERENT ENDING BASED ON SCORE (POSITIVE OR NEGATIVE)
    function personalizedScore(param1, param2) {

        // SCORE MENU GEOMETRY : the duck circle is centered on the menu's top edge
        const menuWidth = 640;
        const menuHeight = 344;
        const menuTop = height() / 2 - menuHeight / 2;

        // DISPLAY THE DUCK SPRITE

        const posX = 378;
        const posY = menuTop;

        add([
            ellipse(120, 120),   // SEMI-AXES : RENDERS A 240x240 CIRCLE
            pos(posX, posY),
            color(Color.fromHex(palette.yellowOrange.lightest)),
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
            rect(menuWidth, menuHeight, { radius: 24 }),
            pos(width() / 2 - menuWidth / 2, menuTop),
            anchor('topleft'),
            color(Color.fromHex(palette.cyan.dark)),
            outline(8, Color.fromHex(palette.cyan.default) ),
            body({ isStatic: true }),
            layer('bg'),
            'scoreMenu',
        ]);
          
        scoreMenu.add([
            text('Score : ' + scoreStats.savedScore, fontStyleRegular),
            pos(128, 40),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

        //FRUIT COMBO COUNT
        scoreMenu.add([
            text('Fruit Combos : ' + scoreStats.comboCount, fontStyleRegular),
            pos(128, 112),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

        //TIME SURVIVED
        scoreMenu.add([
            text('Time survived : ' + formatTime(scoreStats.gameTime), fontStyleRegular),
            pos(128, 184),
            scale(1),
            anchor('topleft'),
            layer('ui'),
        ]);

        scoreMenu.add([
            text(param2, fontStyleRegular),
            pos(128, 256),
            anchor('topleft'),
            layer('ui'),
        ]);

    }

    if (scoreStats.savedScore > 0) {
        personalizedScore('win', 'Well done!');
    } else if (scoreStats.savedScore <= 0) {
        personalizedScore('rage', "One more try ?");
    }

    addButton('Restart', width() / 2, height() / 2 + 256);
});

