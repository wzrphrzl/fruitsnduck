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
// Each new tree gets a z one lower than the previous (1000, 999, 998...),
// so newer trees render behind older ones within the 'game' layer.
let treeZ = 1000;

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
            z(treeZ),
            'tree',
        ]);

        treeZ--;

        tree.add([
            ellipse(tree.width / 2, 10),
            pos(0, 56),
            color(Color.fromHex('#03193F')),
            anchor('top'),
            opacity(0.25),
            layer('bg'),
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
    const getRandomObjectFromList = Math.floor(Math.random() * filteredObject.length);
 
    const spriteName = filteredObject[getRandomObjectFromList];
 
    // On génère la posX finale, on touche pas.
    const posX_Final = setXs(player);

    // On génère la position Y Finale, on touche pas
    const posY_Final = setYs(player);

    // Position Y initiale du sprite, en coordonnées LOCALES (relatives au conteneur).
    // Une hauteur de jeu au-dessus de l'origine du conteneur.
    const posY_Spawn = -height();

    // On invoque un conteneur qui contiendra tout
    const gameObject = add([
        sprite(spriteName),
        opacity(0),
        area({ scale: 0.9, isSensor: true }),
        pos(posX_Final, posY_Final),
        scale( .8),
        anchor('top'),
        'gameObject', 
     ]);

    const fallingObject = gameObject.add([
        sprite(spriteName),
        pos(0, posY_Spawn),
        anchor('top'),
        layer('game'),
    ]);

    onUpdate(() => {
        fallingObject.moveTo(0, 0, 1500);
    });

    // Add shadow (ellipse) as a child of the gameObject
    gameObject.add([
        ellipse(34, 10),
        pos(0, gameObject.height * 0.8 + 12),
        color(Color.fromHex('#03193F')),
        anchor('top'),
        opacity(0.3),
        layer('bg'),
    ]);

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

