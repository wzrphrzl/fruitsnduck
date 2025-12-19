import { addButton, addRect } from './generators.js';

scene('menu', () => {

    addRect(1440, 800, 0, 0, 0, '#C7CFDD', 'bg', { fixed: true, area: false });

    const titleScreen = add([
        sprite('titleScreen'),
        pos(width() / 2, height() / 2 - 192),
        scale(1),
        anchor('center'),
        layer('game'),
    ]);

    // titleScreen.play('blink');

    addButton('Start', width() / 2, height() / 2 + 64);

    add([
        sprite('rules'),
        pos(width() / 2, height() / 2 + 320),
        scale(.75),
        anchor('center'),
        layer('ui'),
    ]);

    add([
        text('V 0.9.1', { size: 32 }),
        color(219, 249, 255),
        pos(width() - 40, 40),
        anchor('center'),
        anchor('right'),
        layer('ui'),
    ]);
});
