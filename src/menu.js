import { addButton, addRect } from './generators.js';

scene('menu', () => {

    addRect(1440, 800, 0, 0, 0, '#C7CFDD', 'bg', { fixed: true, area: false });

    add([
        sprite('titleScreen'),
        pos(width() / 2, 40),
        scale(.9),
        anchor('top'),
        layer('game'),
    ]);

    // titleScreen.play('blink');

    addButton('Start', 730, 468);

    add([
        sprite('gameRules'),
        pos(width() / 2, height()-40),
        scale(1),
        anchor('bot'),
        layer('ui'),
    ]);

    add([
        text('V 0.9.4', { size: 32 }),
        color(219, 249, 255),
        pos(width() - 40, 40),
        anchor('center'),
        anchor('right'),
        layer('ui'),
    ]);
});
