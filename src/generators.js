import { k, SPEED } from './appInit.js';


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