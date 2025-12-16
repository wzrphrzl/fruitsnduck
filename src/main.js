import { k, scoreState, SPEED, addRect, bump, bumpMini } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';
import { createUI } from './ui.js';
import { setXs, setYs, addTree, appearObject, createStarBonus } from './generators.js';

import './menu.js';

scene('game', () => {

    //debug.inspect = true;

    setBackground('#134C4C');
    /*HAUT*/   addRect(9360, 1080, 0, -3960, -3200, '#000000', 'ui', { area: true });
    /*DROITE*/ addRect(1080, 9360, 0, 3240, -4280, '#000000', 'ui', { area: true });
    /*BAS*/    addRect(9360, 1080, 0, -3960, 2920, '#000000', 'ui', { area: true });
    /*GAUCHE*/ addRect(1080, 9360, 0, -2880, -4280, '#000000', 'ui', { area: true });

    // Initialize UI, player, enemy
    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    const { enemy, enemyStats } = createEnemy(player, score);


    addTree(setXs(player), setYs(player));

    //OUTC
    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state == 'fruity') {
            
            bump(touchedTree);
            
            wait(.4, () => {

                for (let i = 0; i < 10; i++) {
                    appearObject(setXs(player), setYs(player),
                    [sprite('banana'), sprite('pear'), sprite('tomato'), sprite('virusPurple'), sprite('virusBlue'), sprite('virusBrown')],
                       );
                }

                touchedTree.enterState('default');
            });
        }

        else if (touchedTree.state == 'default') return

        addTree(setXs(player), setYs(player));

    });

    let boxQueue = [null, null, null];
    let boxSprites = [null, null, null];

    player.onCollide('objet', (objet) => {
        destroy(objet);
        bump(player);

        // Décaler la file : box3 <- box2 <- box1 <- nouveau
        boxQueue.unshift(objet.sprite); // Ajoute au début
        boxQueue.pop(); // Retire le dernier (4ème élément)

        const comboEvents = {
            'tomato': () => {
                debug.log('Combo tomates ! Événement 1');
                // Ajouter ici l'effet spécifique (ex: bonus de points, etc.)
                score.value += 100;
                play('ring');
            },
            'pear': () => {
                debug.log('Combo poires ! Événement 2');
                score.value += 150;
                play('ring');
            },
            'virusBrown': () => {
                debug.log('Combo virus brun ! Événement 3');
                enemyStats.speed = Math.max(10, enemyStats.speed - 10);
                debug.log('Ennemi ralenti !');
            },
            'banana': () => {
                debug.log('Combo bananes !');
                score.value += 80;
                play('ring');
            },
            'virusPurple': () => {
                debug.log('Combo virus violet !');
                enemyStats.size = Math.max(0.5, enemyStats.size - 0.2);
            },
            'virusBlue': () => {
                debug.log('Combo virus bleu !');
                // Effet spécifique pour virus bleu
            }
        };

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

        const fruitScores = {
            'tomato': 20,
            'pear': 20,
            'banana': 20,
            'virusPurple': -10,
            'virusBlue': -15,
            'virusBrown': -20
        };

        const scoreChange = fruitScores[objet.sprite];

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

    // STAR
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

