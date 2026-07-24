import { k } from '../appInit.js';
import { player } from '../entities/player.js';
import { objects } from './objects.js';
import { setPos } from '../lib/helpers.js';
import { treeGrows } from '../lib/audio.js';
import { palette } from '../lib/colorpalette.js';


// GAME ENTITIES GENERATION

// TREE CREATION
// Each new tree gets a z one lower than the previous (1000, 999, 998...),
let plantZ = 1000;
let objectZ = 1000;

// OBJECT SPAWNING
export function addObject(objectType, x, y) {

    // AREA : hitbox scale + optional manual fine-tuning (kept at 0 = auto-centered)
    const OBJECT_AREA_SCALE = 0.6;
    const OBJECT_AREA_OFFSET_X = 0;
    const OBJECT_AREA_OFFSET_Y = 0;

    // FILTERS GAMEOBJECTLIST AND RETURNS AN ARRAY OF THE SPECIFIED OBJECT TYPE
    const filteredObject = Object.keys(objects).filter(filterParam => objects[filterParam].objectType === objectType);
    // SELECTS A RANDOM OBJECT FROM THE FILTERED ARRAY
    const getRandomObjectFromList = Math.floor(Math.random() * filteredObject.length);
    const spriteName = filteredObject[getRandomObjectFromList];

    // Explicit coordinates override the random landing spot (fallback : setPos)
    const spawnPos = (x !== undefined && y !== undefined) ? vec2(x, y) : setPos(player, 100);
    const posX_Final = spawnPos.x;
    const posY_Final = spawnPos.y;
    const posY_Spawn = -height();

    const duration = rand(1.25, 1.85);

    // INITIAL TRANSPARENT CONTAINER (GATHERS POSITION AND THE SPRITE'S AREA)
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

export function addTree(x, y) {

    const tree = k.add([
        sprite('treeFull'),
        pos(x, y),
        scale(1),
        anchor('center'),
        area({ isSensor: false, scale: 0.85 }),
        body({ isStatic: true }),
        state('fruity', ['fruity', 'default']),
        layer('game'),
        z(plantZ),
        'tree',
    ]);

    plantZ--;

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
        tree.area.shape = getSpriteOutline('treeFull', 4, true, 1);
        tree.area.shape.pts = buildConvexHull(tree.area.shape.pts);
        tree.area.offset = vec2(-tree.width / 2 + 8, -tree.height / 2 + 8);
        tree.area.isSensor = true;
    });

    treeGrows();

    return tree;

}

// PLANTS
export function addPlant(spriteName, x, y, sound) {

        let scaleValue = .75;

        if ( spriteName == 'treeSmall') {
            scaleValue = 1;
        }

        const PLANT_AREA_SCALE = 0.65;

        const plant = k.add([
            sprite(spriteName),
            pos(x, y),
            scale(scaleValue),
            anchor('center'),
            area({ scale: PLANT_AREA_SCALE }),
            body({ isStatic: true }),
            state('default', ['default']),
            layer('game'),
            z(plantZ),
            spriteName,
        ]);

        plant.onStateEnter('default', () => {
            plant.play('default');
        });

        // AREA : adapt hitbox shape to sprite outline (grown frame), auto-centered
            plant.area.shape = getSpriteOutline(spriteName, 3, true, 1);
            plant.area.shape.pts = buildConvexHull(plant.area.shape.pts);
            plant.area.offset = vec2(
                -plant.width / 2 * PLANT_AREA_SCALE,
                -plant.height / 2 * PLANT_AREA_SCALE,
            );
        if (sound) play(sound);

        return plant;

}

// FLOWER SPAWNING
export function addFlower(posX, posY) {
    const flowerList = ['flower-1', 'flower-2', 'flower-3'];
    const randomFlower = Math.floor(Math.random() * flowerList.length);

    const flower = add([
        sprite(flowerList[randomFlower]),
        pos(posX, posY),
        scale(.75),
        anchor('center'),
        layer('game'),
        'flower',
    ]);

    wait(1, () => {
        flower.play('default');
    });
}

// `parent` (optional) : attach the explosion to a game object — posX/posY then become
// coordinates local to it, and it inherits its context (needed for fixed() UI elements).
// `spriteName` must have a 'default' anim with loop: false, or it will never self-destruct.
export function addExplosion(posX, posY, parent, spriteName = 'explosion1') {

    const explosion = (parent ?? k).add([
        sprite(spriteName),
        pos(posX, posY),
        scale(.8),
        anchor('center'),
        layer(parent ? 'ui' : 'game'),
        'explosion',
    ]);

    // SELF-DESTRUCT ONCE THE ANIMATION IS OVER (only fires because the anim is loop: false)
    explosion.play('default', { onEnd: () => destroy(explosion) });
}
