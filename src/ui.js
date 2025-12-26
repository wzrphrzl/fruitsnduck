import { fontStyleSmall, fontStyleTiny } from './appInit.js';
import { addRect } from './generators.js';

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

    // INVENTORY UI
    add([
        text('Fruit Combo', fontStyleTiny),
        pos(1408, 632),
        fixed(),
        anchor('topright'),
        { value: 0 },
        color('#92A1B9'),
        layer('ui'),
    ]);

    const box1 = addRect(96, 96, 20, 1072, 672, '#03193F', 'ui', { fixed: true });
    const box2 = addRect(96, 96, 20, 1192, 672, '#03193F', 'ui', { fixed: true });
    const box3 = addRect(96, 96, 20, 1312, 672, '#03193F', 'ui', { fixed: true });

    add([
        text('Rare Fruits', fontStyleTiny),
        pos(1408, 116),
        fixed(),
        anchor('topright'),
        { value: 0 },
        color('#92A1B9'),
        layer('ui'),
    ]);

    const box4 = addRect(80, 80, 40, 1144, 24, '#03193F', 'ui', { fixed: true });
    const box5 = addRect(80, 80, 40, 1236, 24, '#03193F', 'ui', { fixed: true });
    const box6 = addRect(80, 80, 40, 1328, 24, '#03193F', 'ui', { fixed: true });


    return { score, box1, box2, box3, box4, box5, box6 };
}
