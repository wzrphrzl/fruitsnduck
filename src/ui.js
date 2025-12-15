import { addRect, fontStyleSmall, fontStyleTiny } from './appInit.js';

export function createUI() {
    // SCORE UI
    add([
        text('Score', fontStyleSmall),
        pos(32, 32),
        fixed(),
        anchor('topleft'),
        { value: 0 },
        layer('ui'),
    ]);

    const score = add([
        text(0, fontStyleSmall),
        pos(32, 72),
        fixed(),
        anchor('topleft'),
        { value: 0 },
        layer('ui'),
    ]);

    // BOXES UI

    add([
        text('Fruit Combo', fontStyleTiny),
        pos(1256, 640),
        fixed(),
        anchor('topleft'),
        { value: 0 },
        layer('ui'),
    ]);

    const box1 = addRect(96, 96, 20, 1084, 672, '#1B1B1B', 'ui', { fixed: true });
    const box2 = addRect(96, 96, 20, 1192, 672, '#1B1B1B', 'ui', { fixed: true });
    const box3 = addRect(96, 96, 20, 1300, 672, '#1B1B1B', 'ui', { fixed: true });
    // const box4 = addRect(96, 96, 20, 1300, 672, '#1B1B1B', 'ui', { fixed: true });


    return { box1, box2, box3, /* box4, */ score };
}
