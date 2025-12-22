import { scoreState } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';
import { createUI } from './ui.js';
import { setXs, setYs, addTree, spawnObject, createStarBonus, addRect, bump, bumpMini } from './generators.js';
import { gameObjectList, addObjectSprites } from './gameObjects.js';

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

    // INITIALIZE UI, PLAYER, ENEMY, OBJECT SPRITES
    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    const { enemy, enemyStats } = createEnemy(player, score);
    const gameSprites = addObjectSprites();

    // ADD THE FIRST TREE ON THE MAP
    addTree(setXs(player), setYs(player));

    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state == 'fruity') {

            bump(touchedTree);

            wait(.4, () => {
                for (let i = 0; i < 10; i++) {
                    spawnObject(setXs(player), setYs(player), gameSprites);
                }
                touchedTree.enterState('default');
            });
        }
        else if (touchedTree.state == 'default') return

        addTree(setXs(player), setYs(player));
    });

    // GAME LOGIC
    let inventoryBoxArray = [null, null, null];
    let inventoryBoxSprites = [null, null, null];

    // EACH OBJECT SPRITE IS BOTH REFRENCED BY ITS OWN NAME AND AS 'gameObject' TAG
    player.onCollide('gameObject', (gameObject) => {
        destroy(gameObject);
        bump(player);

        // Décaler la file : box3 <- box2 <- box1 <- nouveau
        inventoryBoxArray.unshift(gameObject.sprite); // Ajoute au début
        inventoryBoxArray.pop(); // Retire le dernier (4ème élément)

        // Vérifier si les 3 boîtes contiennent le même fruit
        if (inventoryBoxArray.every(sprite => sprite !== null && sprite === inventoryBoxArray[0])) {

            const comboType = inventoryBoxArray[0]; // Le type de fruit du combo

            // Déclencher l'événement correspondant si il existe
            if (gameObjectList[comboType]?.comboEvent) {
                gameObjectList[comboType].comboEvent();
            }
        }

        // Supprimer les anciens sprites
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

        const scoreChange = gameObjectList[gameObject.sprite]?.score || 0;

        if (scoreChange > 0) {
            score.value += scoreChange;
            play('ring');
        } else if (scoreChange < 0) {
            score.value += scoreChange; // déjà négatif
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

