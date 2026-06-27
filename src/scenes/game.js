import { scoreStats } from '../appInit.js';
import { createPlayer, playerStats } from '../entities/player.js';
import { createEnemy } from '../entities/enemy.js';
import { createUI } from '../systems/ui.js';
import { addTree, addObject, acornBonus, addFlower } from '../systems/generators.js';
import { setXs, setYs, addRect, bump, bumpMini } from '../lib/helpers.js';
import { gameObjectList } from '../systems/objects.js';
import { addTiledMap } from '../systems/map.js';

scene('game', () => {

    // DEBUG FUNCTION
    //debug.inspect = true;

    // MAP SETTINGS
    addRect(1440, 800, 0, 0, 0, '#134C4C', 'bg', { fixed: true, area: false });

    addTiledMap();

    // WALLS
    /*TOP*/   addRect(9360, 1080, 0, -3960, -2680, '#000000', 'ui', { area: true });
    /*RIGHT*/ addRect(1080, 9360, 0, 3240, -4280, '#000000', 'ui', { area: true });
    /*BOTTOM*/addRect(9360, 1080, 0, -3960, 2400, '#000000', 'ui', { area: true });
    /*LEFT*/  addRect(1080, 9360, 0, -2880, -4280, '#000000', 'ui', { area: true });

    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    playerStats.speed = 400;
    const { enemy, enemyStats } = createEnemy(player, score);

    // ADD THE FIRST TREE ON THE MAP
    //addTree(setXs(player), setYs(player));

    addTree( 1080, player.pos.y);

    player.onCollide('tree', (touchedTree) => {


        if (touchedTree.state == 'fruity') {

            play('treeHit');

            bump(touchedTree);

            wait(.1, () => {
                for (let i = 0; i < 5; i++) {
                    addObject('defaultObject');
                }
                touchedTree.enterState('default');
            });
        }
        else if (touchedTree.state == 'default') return

        addTree(setXs(player), setYs(player));
    });

    // INVENTORY SYSTEM
    let inventoryBoxArray = [null, null, null];
    let objectsInBoxesArray = [null, null, null];

    // EACH OBJECT SPRITE IS BOTH REFRENCED BY ITS OWN NAME AND AS 'gameObject' TAG
    player.onCollide('gameObject', (gameObject) => {

        // DEFAULT OBJECT EFFECTS AND COMBO SYSTEM
        if (gameObjectList[gameObject.sprite].objectType === 'defaultObject') {

            // IF INVENTORY IS ALREADY FULL (from the previous trio), CLEAR IT BEFORE ADDING THE NEW FRUIT
            if (inventoryBoxArray.every(f => f !== null)) {
                const lastFruit = inventoryBoxArray[2];
                // If the new fruit matches the last collected fruit (box 3),
                // carry it over to box 1 so boxes 1 & 2 are pre-filled (instead of a full reset)
                if (gameObject.sprite === lastFruit) {
                    inventoryBoxArray = [lastFruit, null, null];
                } else {
                    inventoryBoxArray = [null, null, null];
                }
            }

            // ADD THE NEW FRUIT TO THE NEXT AVAILABLE SLOT
            const nextAvailableIndex = inventoryBoxArray.findIndex(f => f === null);
            if (nextAvailableIndex !== -1) {
                inventoryBoxArray[nextAvailableIndex] = gameObject.sprite;
            }

            // DELETE OLD FRUITS FROM THE INVENTORY BOXES
            objectsInBoxesArray.forEach(sprite => {
                if (sprite) destroy(sprite);
            });

            // REFRESH THE FRUITS IN THE INVENTORY BOXES
            const boxes = [box1, box2, box3];
            objectsInBoxesArray = inventoryBoxArray.map((spriteName, index) => {
                if (spriteName) {
                    const newSprite = boxes[index].add([
                        sprite(spriteName),
                        anchor("center"),
                        pos(48, 48),
                        scale(.5),
                        layer('ui'),
                    ]);

                    // Apply bump animation to the fruit that was just collected
                    if (index === nextAvailableIndex) {
                        bumpMini(newSprite);
                    }

                    return newSprite;
                }
                return null;
            });

            // COMBO CHECK: as soon as the 3rd fruit completes the trio with identical fruits,
            // trigger that fruit's combo event (spawns a special object)
            if (inventoryBoxArray.every(f => f !== null && f === inventoryBoxArray[0])) {
                console.log('fruit combo !');
                gameObjectList[inventoryBoxArray[0]].comboEvent();
            }
        }

        // RARE OBJECT EFFECTS
        if (gameObject.sprite === 'tomatoArmor') {
            gameObjectList.tomatoArmor.comboEvent();
        } else if (gameObject.sprite === 'superPiment') {
            gameObjectList.superPiment.comboEvent();
        } else if (gameObject.sprite === 'samaraSpeed') {
            gameObjectList.samaraSpeed.comboEvent();
        }

        // FLOWER EFFECTS WHEN IN ARMOR MODE
        if (player.state === 'armorRun' && gameObject.sprite === 'virusPurple'
            || player.state === 'armorRun' && gameObject.sprite === 'virusBlue'
            || player.state === 'armorRun' && gameObject.sprite === 'virusBrown'
        ) {
            addFlower(gameObject.pos.x, gameObject.pos.y);
        }

        // SCORE LOGIC
        const scoreChange = gameObjectList[gameObject.sprite].scoreValue;

        if (scoreChange > 0) {
            score.value += scoreChange;
            play('fruit-collected', { volume: 0.1, loop:  false, paused: false });
        } else if (scoreChange < 0) {
            score.value += scoreChange;
            scoreStats.virusCount++;
            play('debuff');
        }

        score.text = 'Score : ' + score.value;
        bump(score);

        // ENEMY BUFF ON COLLECTING OBJECTS
        if (enemy.exists() === true) {
            enemyStats.size += 0.05;
            enemy.scale = vec2(enemyStats.size);
            enemyStats.speed += 10;
        }

        bump(player);
        destroy(gameObject);

    });

    player.onCollide('virus')

    // STAR LOGIC
    loop(10, () => {
        const poppedAcorn = acornBonus(setXs(player), setYs(player));
        wait(2, () => { destroy(poppedAcorn); });
    });

    player.onCollide('star', (star) => {
        score.text = score.value;
        addTree(setXs(player), setYs(player));
        destroy(star);
    });

});
