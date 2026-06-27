import { k } from '../appInit.js';
import { player } from '../entities/player.js';
import { gameObjectList } from './objects.js';
import { setXs, setYs } from '../lib/helpers.js';
import { treePops } from '../lib/audio.js';


// GAME ENTITIES GENERATION

// TREE CREATION
// Each new tree gets a z one lower than the previous (1000, 999, 998...),
let treeZ = 1000;
let objectZ = 1000;


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

    const posX_Final = setXs(player);
    const posY_Final = setYs(player);
    const posY_Spawn = -height();

    const duration = rand(1.25, 1.85);


    // A TRANSPARENT CONTAINER WHICH GATHERS THE POSITION AND THE SPRITE'S AREA
    const gameObjectContainer = add([
        sprite(spriteName),
        pos(posX_Final, posY_Final),
        opacity(0),
        anchor('center'),
        'gameObject',
     ]);

    const fallingObject = gameObjectContainer.add([
        sprite(spriteName),
        scale(.75),
        opacity(1),
        pos(0, posY_Spawn),
        anchor('center'),
        layer('game'),
        z(objectZ),
    ]);

    objectZ++;
    fallingObject.fadeIn(.5);

    // FALLING FUNCTION WITH EASING

    wait(.75, () => {

        tween(
            //START VALUE
            fallingObject.pos,
            //DESTINATION VALUE
            vec2(0, 0),
            //DURATION
            duration,
            //HOW VALUE SHOULD BE UPDATED
            (val) => fallingObject.pos = val,
            //INTERPOLATION FUNCTION
            easings.easeOutBounce,
        );
                
        gameObjectContainer.use(area({ scale: .75, isSensor: true }));

    });


    // ADDS A SHADOW BELOW THE OBJECT
    gameObjectContainer.add([
        ellipse(34, 10),
        pos(0, gameObjectContainer.height / 2 -10),
        color(Color.fromHex('#03193F')),
        anchor('center'),
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

// FLOWER SPAWNING (POPS WHEN A VIRUS IS COLLECTED IN ARMOR MODE)
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
