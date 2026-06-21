import { fontStyleSmall, fontStyleTiny } from './appInit.js';
import { addRect } from './generators.js';

export function createUI() {

    // SCORE UI
    const initialScore = 0;
    const score = add([
        text('Score : ' + initialScore, fontStyleTiny),
        pos(32, 24),
        fixed(),
        anchor('topleft'),
        { value: initialScore },
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

/*     add([
        text('Rare Fruits', fontStyleTiny),
        pos(1408, 116),
        fixed(),
        anchor('topright'),
        { value: 0 },
        color('#92A1B9'),
        layer('ui'),
    ]); */

    return { score, box1, box2, box3 };
}

let rareObjStats_UI = {
    count: 0,
    posX: 32,
};;

export function addRareObject_UI(spriteName) {

    let posX = rareObjStats_UI.posX;

    if (rareObjStats_UI.count < 3) {
        rareObjStats_UI.posX = rareObjStats_UI.posX + 88;

        const addedBox = addRect(80, 80, 40, posX, 696, '#03193F', 'ui', { fixed: true });
        addedBox.add([
            sprite( spriteName ),
            anchor("center"),
            pos(40, 40),
            scale(.5),
            layer('ui'),
        ]);
    }
    rareObjStats_UI.count++;
}

