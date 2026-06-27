import { k, fontStyleMed, fontStyleTiny, fontStyleSmall } from '../appInit.js';
import { addRect } from '../lib/helpers.js';

export function createUI() {

    // SCORE UI
    const initialScore = 0;
    const score = add([
        text('Score : ' + initialScore, fontStyleSmall),
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

// BUTTON CREATION
export function addButton(texte, posX, posY) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(272, 80, { radius: 12 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor('center'),
            outline(3, Color.fromHex('#FFEB57')),
            color('#00396D'),
            layer('ui'),
        ]);

        btn.add([
            text(txt, fontStyleMed),
            anchor('center'),
            pos(0, -4),
            color(Color.fromHex('#FFEB57')),
            layer('ui'),
        ]);

        btn.onHoverUpdate(() => {
            btn.color = Color.fromHex('#0D79BC');
            btn.scale = vec2(1.05);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = Color.fromHex('#00396D');
        });

        btn.onClick(f);
    }

    addButton(texte, () => {
        go('game');
    });
}

