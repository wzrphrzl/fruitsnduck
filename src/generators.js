import { k, fontStyleMed } from './appInit.js';
import { player } from './player.js';
import { gameObjectList } from './objects.js';

/*
 * This module provides utility functions for generating and spawning various game elements:
 * - UI components (buttons, rectangles)
 * - Game objects (trees, collectibles, bonuses)
 * - Visual effects and animations (bump effects)
 * - Position calculation helpers for random placement
 */

// GENERATE RANDOM POSITIONS FROM PLAYER
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

// BUTTON CREATION
export function addButton(texte, posX, posY) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(296, 96, { radius: 12 }),
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

// RECTANGLE CREATION
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

// BUMP EFFECTS
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

// TREE CREATION
export function addTree(x, y) {

    wait(2, () => {


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

        treePops();

        return tree;

    });


}

// OBJECT SPAWNING
export function addObject(objectType) {

    // FILTERS GAMEOBJECTLIST AND RETURNS AN ARRAY OF THE SPECIFIED OBJECT TYPE
    const filteredObject = Object.keys(gameObjectList).filter(filterParam => gameObjectList[filterParam].objectType === objectType);
    // SELECTS A RANDOM OBJECT FROM THE FILTERED ARRAY
    const getRandom = Math.floor(Math.random() * filteredObject.length);
    // GENERATES A RANDOM POSITION AND ADDS THE OBJECT TO THE GAME
    const posX_objectSpawn = setXs(player);
    const posY_objectSpawn = player.pos.y - 440;
    const posY_objectEnd = rand(80, 720);

    const addedObject = add([
        sprite(filteredObject[getRandom]),
        pos(posX_objectSpawn, posY_objectSpawn),
        area({ scale: 0.9, isSensor: true }),
        scale(.75),
        layer('game'),
        'gameObject',
    ]);

    onUpdate(() => {
        addedObject.moveTo(posX_objectSpawn, posY_objectSpawn + posY_objectEnd, 1750);
    });

}

// ACORN SPAWNING (GENERATES A TREE WHEN COLLECTED)
export function acornBonus(posX, posY) {
    return add([
        sprite('acorn'),
        pos(posX, posY),
        rotate(0),
        scale(.75),
        anchor('center'),
        area(),
        body(),
        layer('game'),
        'star',
    ]);
}

// KWAK SOUND EFFECT RANDOMIZER
export function kwak() {
    const kwakList = ['kwak-1', 'kwak-2', 'kwak-3', 'kwak-4', 'kwak-5'];
    const random = Math.floor(Math.random() * kwakList.length);
    play(kwakList[random]);
}

export function fart() {
    const fartList = ['fart-1', 'fart-2', 'fart-3', 'fart-4', 'fart-5'];
    const random = Math.floor(Math.random() * fartList.length);
    play(fartList[random]);
}

export function treePops() {
    const treePopsList = ['treePops-1', 'treePops-2', 'treePops-3', 'treePops-4', 'treePops-5'];
    const random = Math.floor(Math.random() * treePopsList.length);
    play(treePopsList[random]);
}

// KWAK SOUND EFFECT RANDOMIZER
export function addFlower(posX, posY) {
    const flowerList = ['flower-1', 'flower-2', 'flower-3'];
    const randomFlower = Math.floor(Math.random() * flowerList.length);

    const flower = add([
        sprite(flowerList[randomFlower]),
        pos(posX, posY),
        scale(.75),
        layer('game'),
        'flower',
    ]);

    wait(1, () => {
        flower.play('default');
    });
}

