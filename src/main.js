import { scoreState } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';
import { createUI } from './ui.js';
import { setXs, setYs, addTree, spawnObject, createStarBonus, addRect, bump, bumpMini } from './generators.js';
import { gameObjectList, createComboEvents, createGameSprites } from './gameObjects.js';

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

    // INITIALIZE UI, PLAYER, ENEMY, GAME SPRITES
    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    const { enemy, enemyStats } = createEnemy(player, score);
    const gameSprites = createGameSprites();

    // Add the first Tree
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
    let boxQueue = [null, null, null];
    let boxSprites = [null, null, null];

    player.onCollide('gameObject', (gameObject) => {
        destroy(gameObject);
        bump(player);

        // Décaler la file : box3 <- box2 <- box1 <- nouveau
        boxQueue.unshift(gameObject.sprite); // Ajoute au début
        boxQueue.pop(); // Retire le dernier (4ème élément)

        const comboEvents = createComboEvents(score, enemyStats);

        // Vérifier si les 3 boîtes contiennent le même fruit
        if (boxQueue.every(sprite => sprite !== null && sprite === boxQueue[0])) {
            const comboType = boxQueue[0]; // Le type de fruit du combo

            // Déclencher l'événement correspondant si il existe
            if (comboEvents[comboType]) {
                comboEvents[comboType]();
            }
        }

        // Supprimer les anciens sprites
        boxSprites.forEach(sprite => {
            if (sprite) destroy(sprite);
        });

        // Créer les nouveaux sprites dans les bonnes boîtes
        const boxes = [box1, box2, box3];
        boxSprites = boxQueue.map((spriteName, index) => {
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
            scoreState.savedItems++;
        }

        if (enemy.exists() === true) {
            enemy.scale = vec2(enemyStats.size);
            enemyStats.size += 0.1;
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

go('menu');

