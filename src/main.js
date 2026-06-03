import { scoreStats } from './appInit.js';
import { createPlayer, playerStats } from './player.js';
import { createEnemy } from './enemy.js';
import { createUI } from './ui.js';
import { setXs, setYs, addTree, addObject, acornBonus, addRect, bump, bumpMini, addFlower } from './generators.js';
import { gameObjectList } from './gameObjects.js';

import './menu.js';

scene('game', () => {

    // DEBUG FUNCTION
    // debug.inspect = true;

    // MAP SETTINGS
    addRect(1440, 800, 0, 0, 0, '#134C4C', 'bg', { fixed: true, area: false });

    add([
        pos(-1800, -2120),
        sprite("grass", {
            tiled: true,
            width: 5040,
            height: 5040,
        }),
        layer("bg"),
    ]);

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
    addTree(setXs(player), setYs(player));

    player.onCollide('tree', (touchedTree) => {


        if (touchedTree.state == 'fruity') {

            play('treeHit');

            bump(touchedTree);

            wait(.1, () => {
                for (let i = 0; i < 10; i++) {
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

            // PUSHES THE NEW OBJECT SPRITE IN THE INVENTORY WHILE REMOVING THE LAST ONE
            inventoryBoxArray.unshift(gameObject.sprite);
            inventoryBoxArray.pop();

            // CHECK IF ALL BOXES CONTAIN THE SAME FRUIT AS THE FIRST ONE AND TRIGGERS ITS COMBO EVENT
            if (inventoryBoxArray.every(sprite => sprite !== null && sprite === inventoryBoxArray[0])) {
                const selectedCombo = inventoryBoxArray[0];
                gameObjectList[selectedCombo].comboEvent();
            }
            // IF INVENTORY IS FULL BUT NO COMBO, CLEAR IT
            else if (inventoryBoxArray.every(sprite => sprite !== null)) {
                addObject('bonusObject');
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

                    // Appliquer bump() au sprite de box1
                    if (index === 0) {
                        bumpMini(newSprite);
                    }

                    return newSprite;
                }
                return null;
            });
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

        score.text = score.value;
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
        const starBonus = acornBonus(setXs(player), setYs(player));
        wait(2, () => { destroy(starBonus); });
    });

    player.onCollide('star', (star) => {
        score.text = score.value;
        addTree(setXs(player), setYs(player));
        destroy(star);
    });

});

import './endingScreen.js';

go('menu');

