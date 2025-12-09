import { k, gameState, SPEED, addButton } from './appInit.js';

/****************/
/*     GAME     */
/****************/

scene('game', () => {
    //RECANGLES
    function addRect(width, height, posX, posY) {
        k.add([
            rect(width, height),
            pos(posX, posY),
            area(),
            color(0, 0, 0),
            body({ isStatic: true }),
        ]);
    }
    //HAUT
    addRect(5760, 1080, -1920, -1180);
    //BAS
    addRect(5760, 1080, -1920, 1180);
    //GAUCHE
    addRect(1920, 3240, -2020, -1080);
    //GAUCHE
    addRect(1920, 3240, 2020, -1080);

    //SCORE
    gameState.item = 0;

    const score = add([
        text('Score ' + 0, {
            font: 'jersey',
            size: 100,
        }),
        pos(64, 72),
        fixed(),
        anchor('left'),
        scale(1),
        z(100),
        { value: 0 },
    ]);

    // SCALEOBJECT
    function scaleObject(param1) {
        param1.scale = vec2(1.4);
        wait(0.2, () => {
            param1.scale = vec2(1.25);
        });
    }

    //THREE
    const three = k.add([
        sprite('three'),
        pos(1080, 256),
        scale(1),
        anchor('center'),
        area(),
        body({ mass: 30 }),
        'three',
    ]);

    k.onCollide('duck', 'three', () => {
        scaleObject(three);
    });

    //ENEMY
    let SPEED_enemy = 10;
    let SIZE_enemy = 2;
    const SOUND_enemy = play('roomba');

    const enemy = add([
        sprite('enemy'),
        pos(width() + 80, height() + 80),
        area({ scale: 0.75 }),
        body(),
        scale(SIZE_enemy),
        anchor('center'),
        state('move', ['idle', 'move']),
        'enemy',
    ]);

    enemy.onStateEnter('run', async () => {
        // Don't do anything if player doesn't exist anymore
        if (player.exists()) {
            // const dir = player.pos.sub(enemy.pos).unit();
            SOUND_enemy;
        }
        await wait(1);
        enemy.enterState('move');
    });

    enemy.onStateEnter('move', async () => {
        await wait(2);
        enemy.enterState('idle');
    });

    enemy.onStateUpdate('move', () => {
        if (!player.exists()) return;
        const dir = player.pos.sub(enemy.pos).unit();
        enemy.move(dir.scale(SPEED_enemy));
    });

    k.onCollide('duck', 'enemy', () => {
        destroy(player);
        SOUND_enemy.paused = !SOUND_enemy.paused;
        play('lose');

        gameState.scoreEnregistré = score.value;
        go('lose');
    });

    // PLAYER
    const player = k.add([
        sprite('duck'),
        pos(center()),
        scale(2),
        anchor('center'),
        area({ scale: 1 }),
        body(),
        shader('invert', () => ({
            u_time: time(),
        })),
        state('move', ['idle', 'run']),
        'duck',
    ]);

    player.onUpdate(() => {
        setCamPos(player.pos);
        setCamScale(1);
    });

    // CONTROLS
    onKeyDown('left', () => {
        player.move(-SPEED, 0);
    });
    onKeyDown('right', () => {
        player.move(SPEED, 0);
    });
    onKeyDown('up', () => {
        player.move(0, -SPEED);
    });
    onKeyDown('down', () => {
        player.move(0, SPEED);
    });

    onKeyPress('left', () => {
        player.flipX = true;
    });
    onKeyPress('right', () => {
        player.flipX = false;
    });

    onKeyPress(['left', 'right', 'up', 'down'], () => {
        player.play('run');
    });
    onKeyRelease(['left', 'right', 'up', 'down'], () => {
        player.play('idle');
    });

    //OBJETS
    const pear = sprite('pear');
    const banana = sprite('banana');
    const tomato = sprite('tomato');
    const virusPurple = sprite('virusPurple');
    const virusBlue = sprite('virusBlue');
    const virusBrown = sprite('virusBrown');
    const star = sprite('star');

    const objets = [banana, pear, tomato, virusPurple, virusBlue, virusBrown];

    function appear(param1) {
        const x = rand(0, width() - 140);
        const y = rand(0, height() - 140);
        const random = Math.floor(Math.random() * objets.length);
        k.add([
            objets[random],
            pos(x, y),
            area(),
            //rotate(x),
            scale(1),
            body({ mass: 0.3 }),
            param1,
            move(SPEED, 0),
        ]);
    }

    for (let i = 0; i < 10; i++) {
        appear('objet');
    }

    //LOOT
    player.onCollide('objet', (objet) => {
        destroy(objet);
        scaleObject(player);
        appear('objet');

        function colChange(couleur) {
            score.color = couleur;
            wait(0.5, () => {
                score.color = WHITE;
            });
        }

        if (objet.sprite == 'pear') {
            score.value += 20;
            play('ring');
        }
        if (objet.sprite == 'banana') {
            score.value += 20;
            play('ring');
        } else if (objet.sprite == 'virusPurple') {
            score.value -= 3;
            play('debuff');
            gameState.item++;
        } else if (objet.sprite == 'virusBlue') {
            score.value -= 5;
            play('debuff');
            gameState.item++;
        } else if (objet.sprite == 'virusBrown') {
            score.value -= 15;
            play('debuff');
            gameState.item++;
        }

        if (enemy.exists() === true) {
            enemy.scale = vec2(SIZE_enemy);
            SIZE_enemy += 0.01;
            SPEED_enemy += 5;
        }

        scaleObject(score);

        score.text = '€ ' + score.value;
    });

    enemy.onCollide('objet', (objet) => {
        if (objet.sprite == 'virusBlue' || objet.sprite == 'virusBrown') {
            destroy(objet);
        }
    });

    // STAR
    loop(5, () => {
        const starBonus = add([
            star,
            pos(rand(vec2(0), vec2(width(), height()))),
            rotate(0),
            scale(1),
            anchor('center'),
            area(),
            body(),
            'star',
        ]);

        starBonus.onUpdate(() => {
            starBonus.angle += 120 * dt();
        });

        k.onCollide('duck', 'star', (star) => {
            score.text = '€ ' + score.value;
            destroy(starBonus);

            for (let i = 0; i < 3; i++) {
                appear('objet');
            }
        });

        wait(3, () => {
            destroy(starBonus);
        });
    });
});

/****************/
/*    ENDING    */
/****************/

scene('lose', () => {
    function scorePersonnalisé(param1, param2) {
        add([
            sprite(param1),
            pos(width() / 5, height() / 2 - 80),
            scale(1.5),
            anchor('center'),
        ]);
        add([
            text(param2, {
                font: 'jersey',
                size: 56,
            }),
            pos(width() / 2, height() / 2 - 160),
            anchor('center'),
        ]);
    }

    if (gameState.scoreEnregistré > 0) {
        scorePersonnalisé('duck', 'Fin °1 : Bien joué !');
    } else if (gameState.scoreEnregistré <= 0) {
        scorePersonnalisé('duck', "Fin n°2 : C'est mal joué :(");
    }

    // display score
    add([
        text(0 + gameState.scoreEnregistré + ' score'),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
    ]);

    add([
        text(0 + gameState.item + ' virus'),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
    ]);

    addButton('Mieux faire', width() / 2, height() / 2 + 180);
});


go('menu');


