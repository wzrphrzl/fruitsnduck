import { scoreState } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';
import { createUI } from './ui.js';
import { setXs, setYs, addTree, addObject, createStarBonus, addRect, bump, bumpMini } from './generators.js';
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

    // INITIALIZE THE OBJECT SPRITES, UI, PLAYER, ENEMY
    //const objectSpriteList = Object.keys(gameObjectList).map(gameObjectKey => sprite(gameObjectKey));
    //const defaultObjectSpriteList = Object.keys(gameObjectList).filter(key => gameObjectList[key].objectType === 'defaultObject').map(gameObjectKey => sprite(gameObjectKey));
    //const rareObjectSpriteList = Object.keys(gameObjectList).filter(key => gameObjectList[key].objectType === 'rareObject').map(gameObjectKey => sprite(gameObjectKey));



    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    const { enemy, enemyStats } = createEnemy(player, score);

    // ADD THE FIRST TREE ON THE MAP
    addTree(setXs(player), setYs(player));

    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state == 'fruity') {

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

    // INVENTORY LOGIC
    let inventoryBoxArray = [null, null, null];
    let inventoryBoxSprites = [null, null, null];

    // EACH OBJECT SPRITE IS BOTH REFRENCED BY ITS OWN NAME AND AS 'gameObject' TAG
    player.onCollide('gameObject', (gameObject) => {
        
        destroy(gameObject);
        bump(player);

        
        if ( gameObjectList[gameObject.sprite].objectType === 'defaultObject') {
            // NEW OBJECT -> BOX1 -> BOX2 -> BOX3 -> REMOVE LAST
                inventoryBoxArray.unshift(gameObject.sprite); 
                inventoryBoxArray.pop(); 
            
            // CHECK IF ALL THREE BOXES CONTAIN THE SAME FRUIT AND TRIGGER COMBO EVENT IF TRUE
            if (inventoryBoxArray.every(sprite => sprite !== null && sprite === inventoryBoxArray[0])) {

                const comboType = inventoryBoxArray[0]; // Le type de fruit du combo

                // Déclencher l'événement correspondant si il existe
                if (gameObjectList[comboType]?.comboEvent) {
                    gameObjectList[comboType].comboEvent();
                }
            }

            // DELETE OLD SPRITES FROM THE INVENTORY BOXES
            inventoryBoxSprites.forEach(sprite => {
                if (sprite) destroy(sprite);
            });

            // Créer les nouveaux sprites dans les bonnes boîtes
            const boxes = [box1, box2, box3];
            inventoryBoxSprites = inventoryBoxArray.map((spriteName, index) => {
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
        }

        // SCORE LOGIC
        const scoreChange = gameObjectList[gameObject.sprite]?.scoreValue || 0;

        if (scoreChange > 0) {
            score.value += scoreChange;
            play('ring');
        } else if (scoreChange < 0) {
            score.value += scoreChange;
            play('debuff');
            scoreState.virusCount++;
        }

        if (enemy.exists() === true) {
            enemyStats.size += 0.1;
            enemy.scale = vec2(enemyStats.size);
            enemyStats.speed += 15;
        }
        bump(score);
        score.text = score.value;
    });

    // STAR LOGIC
    loop(10, () => {
        const starBonus = createStarBonus(setXs(player), setYs(player));
        wait(2, () => { destroy(starBonus); });
    });

    player.onCollide('star', (star) => {
        score.text = score.value;
        addTree(setXs(player), setYs(player));
        destroy(star);
    });

});

import './endingScreen.js';

go('game');

