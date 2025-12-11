import { k, gameState, SPEED, addRect } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';

scene('game', () => {

    /*HAUT*/   addRect(5760, 1080, -1920, -1180);
    /*BAS*/    addRect(5760, 1080, -1920, 1180);
    /*GAUCHE*/ addRect(1920, 3240, -2020, -1080);
    /*DROITE*/ addRect(1920, 3240, 2020, -1080);

    const score = add([
        text(' ' + 0, {
            font: 'Nunito',
            size: 100,
        }),
        pos(64, 72),
        fixed(),
        anchor('left'),
        z(100),
        { value: 0 },
    ]);

    //BUMP
    function bump(param1) {
        param1.scale = vec2(1.15);
        wait(0.2, () => {
            param1.scale = vec2(1);
        });
    }

    // PLAYER
    const player = createPlayer();

    //ENEMY
    const { enemy, enemyStats } = createEnemy(player, score);

    //OBJETS
    const three = k.add([
        sprite('three'),
        pos(1080, 256),
        scale(1),
        anchor('center'),
        area(),
        body({ mass: 30 }),
        'three',
    ]);

    const pear = sprite('pear');
    const banana = sprite('banana');
    const tomato = sprite('tomato');
    const virusPurple = sprite('virusPurple');
    const virusBlue = sprite('virusBlue');
    const virusBrown = sprite('virusBrown');
    const star = sprite('star');

    const objets = [banana, pear, tomato, virusPurple, virusBlue, virusBrown];

    function appear(param1) {
        const x = rand(0, width());
        const y = rand(0, height());
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

    //GAME LOGIC
    gameState.item = 0;

    for (let i = 0; i < 10; i++) {
        appear('objet');
    }

    player.onCollide('three', () => {
        bump(three);
    });

    player.onCollide('objet', (objet) => {
        destroy(objet);
        bump(player);

        if (objet.sprite == 'tomato') {
            score.value += 20;
            play('ring');
        }
        if (objet.sprite == 'pear') {
            score.value += 20;
            play('ring');
        }
        if (objet.sprite == 'banana') {
            score.value += 20;
            play('ring');
        } else if (objet.sprite == 'virusPurple') {
            score.value -= 5;
            play('debuff');
            gameState.item++;
        } else if (objet.sprite == 'virusBlue') {
            score.value -= 10;
            play('debuff');
            gameState.item++;
        } else if (objet.sprite == 'virusBrown') {
            score.value -= 20;
            play('debuff');
            gameState.item++;
        }

        if (enemy.exists() === true) {
            enemy.scale = vec2(enemyStats.size);
            enemyStats.size += 0.1;
            enemyStats.speed += 10;
        }
        bump(score);
        score.text = score.value;
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

        player.onCollide('star', () => {
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

 import './endingScreen.js';

go('lose');

