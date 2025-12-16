import { k, SPEED, fontStyleMed } from './appInit.js';

export function addButton(texte, posX, posY) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(296, 96, { radius: 16 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor('center'),
            outline(4, Color.fromHex('#FFEB57')),
            color('#622461'),
            layer('ui'),
        ]);

        btn.add([
            text(txt, fontStyleMed),
            anchor('center'),
            pos(0, 2),
            color(Color.fromHex('#FFEB57')),
            layer('ui'),
        ]);

        btn.onHoverUpdate(() => {
            btn.color = Color.fromHex('#93388F');
            btn.scale = vec2(1.1);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = Color.fromHex('#622461');
        });

        btn.onClick(f);
    }

    addButton(texte, () => {
        go('game');
    });
}

export function addRect(width, height, radiusVal, posX, posY, colorName, layerName, options = {}, rectName = 'rect') {
    const rectangle = [
        rect(width, height, { radius: radiusVal }),
        pos(posX, posY),
        anchor('topleft'),
        color(colorName),
        body({ isStatic: true }),
        layer(layerName),
        rectName,
    ];

    if (options.area === true) {
        rectangle.push(area());
    }

    if (options.fixed === true) {
        rectangle.push(fixed());
    }

    return k.add(rectangle);
}

export function bump(param1) {
    param1.scale = vec2(1.15);
    wait(0.2, () => {
        param1.scale = vec2(1);
    });
}

export function bumpMini(param1) {
    param1.scale = vec2(.6);
    wait(0.2, () => {
        param1.scale = vec2(.5);
    });
}

export function setXs(player) {
    if (Math.random() < 0.5) {
        return rand(player.pos.x - 720, player.pos.x - 96);
    } else {
        return rand(player.pos.x + 96, player.pos.x + 720);
    }
}

export function setYs(player) {
    if (Math.random() < 0.5) {
        return rand(player.pos.y - 400, player.pos.y - 96);
    } else {
        return rand(player.pos.y + 96, player.pos.y + 400);
    }
}

export function addTree(x, y) {
    const tree = k.add([
        sprite('tree'),
        pos(x, y),
        scale(1),
        anchor('center'),
        area(),
        body({ isStatic: true }),
        state('fruity', ['fruity', 'default']),
        layer('game'),
        'tree',
    ]);

    tree.onStateEnter('default', () => {
        tree.play('default');
    });

    tree.onStateEnter('fruity', () => {
        tree.play('fruity');
    });

    return tree;
}

export function appearObject(posX, posY, objets) {
    const random = Math.floor(Math.random() * objets.length);
    k.add([
        objets[random],
        pos(posX, posY),
        area(.9),
        scale(.75),
        body({ mass: 0.3 }),
        layer('game'),
        'objet',
        move(SPEED, 0),
    ]);
}

export function createStarBonus(poxX, posY) {
    return add([
        sprite('star'),
        pos(poxX, posY),
        rotate(0),
        scale(1),
        anchor('center'),
        area(),
        body(),
        layer('game'),
        'star',
    ]);
} 