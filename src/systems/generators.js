import { k } from '../appInit.js';
import { player } from '../entities/player.js';
import { objectList } from './objects.js';
import { setFreePos } from '../lib/helpers.js';
import { plantGrows } from '../lib/audio.js';
import { palette } from '../lib/colorpalette.js';


// GAME ENTITIES GENERATION

// TREE CREATION
// Each new tree gets a z one lower than the previous (1000, 999, 998...),
let treeZ = 1000;
let objectZ = 1000;


export function addTree(x, y) {

    const tree = k.add([
        sprite('tree'),
        pos(x, y),
        scale(1),
        anchor('center'),
        area({ isSensor: false, scale: 0.85 }),
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
        color(Color.fromHex(palette.blue.darkest)),
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

    // AREA : adapt hitbox shape to sprite getSpriteOutline

    wait(0.2, () => {
        tree.area.shape = getSpriteOutline('tree', 4, true, 1);
        tree.area.shape.pts = buildConvexHull(tree.area.shape.pts);
        tree.area.offset = vec2(-tree.width / 2 + 8, -tree.height / 2 + 8);
        tree.area.isSensor = true;
    });

    plantGrows();

    return tree;

}

export function addThistle(x, y) {

        // AREA : hitbox scale + optional manual fine-tuning (kept at 0 = auto-centered)
        const THISTLE_AREA_SCALE = 0.65;
        const THISTLE_AREA_OFFSET_X = 0;
        const THISTLE_AREA_OFFSET_Y = 0;

        const thistle = k.add([
            sprite('thistle'),
            pos(x, y),
            scale(.75),
            anchor('center'),
            area({ scale: THISTLE_AREA_SCALE }),
            body({ isStatic: true }),
            state('default', ['default']),
            layer('game'),
            z(treeZ),
            'thistle',
        ]);

        thistle.onStateEnter('default', () => {
            thistle.play('default');
        });

        // AREA : adapt hitbox shape to sprite outline (grown frame), auto-centered
        thistle.area.shape = getSpriteOutline('thistle', 3, true, 1);
        thistle.area.shape.pts = buildConvexHull(thistle.area.shape.pts);
        thistle.area.offset = vec2(
            -thistle.width / 2 * THISTLE_AREA_SCALE + THISTLE_AREA_OFFSET_X,
            -thistle.height / 2 * THISTLE_AREA_SCALE + THISTLE_AREA_OFFSET_Y,
        );

        plantGrows();
        return thistle;

}

export function addDandelionChrono(x, y) {

        const dandelionChrono = k.add([
            sprite('dandelionChrono'),
            pos(x, y),
            scale(.75),
            anchor('center'),
            area(),
            body({ isStatic: true }),
            state('default', ['default']),
            layer('game'),
            z(treeZ),
            'dandelionChrono',
        ]);

        dandelionChrono.onStateEnter('default', () => {
            dandelionChrono.play('default');
        });

        plantGrows();
        return dandelionChrono;

}


// OBJECT SPAWNING
export function addObject(objectType) {

    // AREA : hitbox scale + optional manual fine-tuning (kept at 0 = auto-centered)
    const OBJECT_AREA_SCALE = 0.6;
    const OBJECT_AREA_OFFSET_X = 0;
    const OBJECT_AREA_OFFSET_Y = 0;

    // FILTERS GAMEOBJECTLIST AND RETURNS AN ARRAY OF THE SPECIFIED OBJECT TYPE
    const filteredObject = Object.keys(objectList).filter(filterParam => objectList[filterParam].objectType === objectType);
    // SELECTS A RANDOM OBJECT FROM THE FILTERED ARRAY
    const getRandomObjectFromList = Math.floor(Math.random() * filteredObject.length);
    const spriteName = filteredObject[getRandomObjectFromList];

    const spawnPos = setFreePos(player, 100);
    const posX_Final = spawnPos.x;
    const posY_Final = spawnPos.y;
    const posY_Spawn = -height();

    const duration = rand(1.25, 1.85);


    // A TRANSPARENT CONTAINER WHICH GATHERS THE POSITION AND THE SPRITE'S AREA
    const objectContainer = add([
        sprite(spriteName),
        pos(posX_Final, posY_Final),
        opacity(0),
        anchor('center'),
        'objectContainer',
     ]);

    const fallingObject = objectContainer.add([
        sprite(spriteName),
        scale(.8),
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
                
        objectContainer.use(area({ scale: OBJECT_AREA_SCALE, isSensor: true }));

        // TIGHT SPRITE AREA : adapt hitbox shape to sprite outline
        objectContainer.area.shape = getSpriteOutline(spriteName, 0, true, 1);
        objectContainer.area.shape.pts = buildConvexHull(objectContainer.area.shape.pts);

        // AUTO-CENTER THE (SCALED) HITBOX ON THE SPRITE :
        // worldCenter = pos + offset + areaScale·(W/2, H/2)  →  offset = -areaScale·(W/2, H/2)
        objectContainer.area.offset = vec2(
            -objectContainer.width / 2 * OBJECT_AREA_SCALE + OBJECT_AREA_OFFSET_X,
            -objectContainer.height / 2 * OBJECT_AREA_SCALE + OBJECT_AREA_OFFSET_Y,
        );

    });

    // ADDS A SHADOW BELOW THE OBJECT
    objectContainer.add([
        ellipse(objectContainer.width /2 *.85, 10),
        pos(0, objectContainer.height / 2 -8),
        color(Color.fromHex(palette.blue.darkest)),
        anchor('center'),
        opacity(0.3),
        layer('bg'),
    ]);

}

// ACORN SPAWNING (GENERATES A TREE WHEN COLLECTED)
export function acornBonus() {
    const acorn = add([
        sprite('acorn'),
        pos(setFreePos(player, 100)),
        rotate(0),
        scale(.75),
        anchor('center'),
        area(),
        body(),
        layer('game'),
        'acorn',
    ]);

    // AREA : adapt hitbox shape to sprite outline
    acorn.area.shape = getSpriteOutline('acorn', 0, true, 1);
    acorn.area.shape.pts = buildConvexHull(acorn.area.shape.pts);
    acorn.area.offset = vec2(-acorn.width / 2, -acorn.height / 2);

    return acorn;
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
