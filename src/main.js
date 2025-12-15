import { k, scoreState, SPEED, addRect, bump, bumpMini } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';
import { createUI } from './ui.js';

import './menu.js';

scene('game', () => {

    //debug.inspect = true;

    setBackground('#134C4C');
    /*HAUT*/   addRect(9360, 1080, 0, -3960, -3200, '#000000', 'ui', { area: true });
    /*DROITE*/ addRect(1080, 9360, 0, 3240, -4280, '#000000', 'ui', { area: true });
    /*BAS*/    addRect(9360, 1080, 0, -3960, 2920, '#000000', 'ui', { area: true });
    /*GAUCHE*/ addRect(1080, 9360, 0, -2880, -4280, '#000000', 'ui', { area: true });

    const pear = sprite('pear');
    const banana = sprite('banana');
    const tomato = sprite('tomato');
    const virusPurple = sprite('virusPurple');
    const virusBlue = sprite('virusBlue');
    const virusBrown = sprite('virusBrown');
    const star = sprite('star');
    const objets = [banana, pear, tomato, virusPurple, virusBlue, virusBrown];

    // Événements déclenchés pour chaque combo
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

    // Initialize UI, player, enemy
    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    const { enemy, enemyStats } = createEnemy(player, score);

    function setXs() {
        if (Math.random() < 0.5) {
            return rand(player.pos.x - 720, player.pos.x - 96);
        } else {
            return rand(player.pos.x + 96, player.pos.x + 720);
        }
    }

    function setYs() {
        if (Math.random() < 0.5) {
            return rand(player.pos.y - 400, player.pos.y - 96);
        } else {
            return rand(player.pos.y + 96, player.pos.y + 400);
        }
    }




    //THREE
    function addTree(x, y) {

        const tree = k.add([
            sprite('tree'),
            pos(x, y),
            scale(1),
            anchor('center'),
            area(),
            body({ isStatic: true }),
            state('fruity', ['fruity', 'default']),
            layer('game'),
            'tree',
        ]);

        tree.onStateEnter('default', () => {
            tree.play('default');
        });

        tree.onStateEnter('fruity', () => {
            tree.play('fruity');
        });

        return tree;
    }
    addTree(setXs(), setYs());


    function appear(param1) {
        /*         const x = rand(0, width());
                const y = rand(0, height()); */
        const random = Math.floor(Math.random() * objets.length);
        k.add([
            objets[random],
            pos(setXs(), setYs()),
            area(.9),
            //rotate(x),
            scale(.75),
            body({ mass: 0.3 }),
            layer('game'),
            param1,
            move(SPEED, 0),
        ]);
    }

    //GAME LOGIC

    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state === 'fruity') {
            bump(touchedTree);
            if (touchedTree.state === 'fruity') {
                wait(.4, () => {
                    for (let i = 0; i < 10; i++) {
                        appear('objet');
                    }
                    touchedTree.enterState('default');
                });
            }
        }

        else if (touchedTree.state === 'default') return

        addTree(setXs(), setYs());

    });

    let boxQueue = [null, null, null];
    let boxSprites = [null, null, null];

    player.onCollide('objet', (objet) => {
        destroy(objet);
        bump(player);

        // Décaler la file : box3 <- box2 <- box1 <- nouveau
        boxQueue.unshift(objet.sprite); // Ajoute au début
        boxQueue.pop(); // Retire le dernier (4ème élément)

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

    // STAR - Loop de création des étoiles
    loop(10, () => {
        const starBonus = add([
            star,
            pos(setXs(), setYs()),
            rotate(0),
            scale(1),
            anchor('center'),
            area(),
            body(),
            layer('game'),
            'star',
        ]);

        starBonus.onUpdate(() => {
            //  starBonus.angle += 120 * dt();
        });

        wait(2, () => {
            destroy(starBonus);
        });
    });

    player.onCollide('star', (star) => {
        score.text = score.value;
        addTree(setXs(), setYs());
        destroy(star);
    });

});

import './endingScreen.js';

go('game');

