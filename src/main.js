import { k, gameState, SPEED, addRect, fontStyleSmall } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';

import './menu.js';

scene('game', () => {

    setBackground('#134C4C');

    /*HAUT*/   addRect(5760, 1080, 0, -1920, -1180, '#000000', 'ui', { area: true });
    /*DROITE*/ addRect(1920, 3240, 0, 2020, -1080, '#000000', 'ui', { area: true });
    /*BAS*/    addRect(5760, 1080, 0, -1920, 1180, '#000000', 'ui', { area: true });
    /*GAUCHE*/ addRect(1920, 3240, 0, -2020, -1080, '#000000', 'ui', { area: true });

    const pear = sprite('pear');
    const banana = sprite('banana');
    const tomato = sprite('tomato');
    const virusPurple = sprite('virusPurple');
    const virusBlue = sprite('virusBlue');
    const virusBrown = sprite('virusBrown');
    const star = sprite('star');


    const box1 = addRect(104,104, 20, 1300, 672, '#1B1B1B', 'ui', { fixed: true });

    console.log((box1));


/*     rectWhite.add([
            pear,
            anchor("center"),
            fixed(),
            //rotate(x),
            scale(.75),
            layer('ui'),
    ]); */


    // const = rectBleu = addRect(300,380, 0, 0, '#0000FF', 'game');

    add([
        text('Score', fontStyleSmall),
        pos(32, 32),
        fixed(),
        anchor('topleft'),
        { value: 0 },
        layer('ui'),
    ]);

    const score = add([
        text(0, fontStyleSmall),
        pos(32, 72),
        fixed(),
        anchor('topleft'),
        { value: 0 },
        layer('ui'),
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
    const tree = k.add([
        sprite('tree'),
        pos(1080, 256),
        scale(1),
        anchor('center'),
        area(),
        body({ isStatic: true }),
        state('fruity', ['fruity', 'default']),
        layer('game'),
        'tree',
    ]);

    tree.play('fruity');

    
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
            scale(.75),
            body({ mass: 0.3 }),
            layer('game'),
            param1,
            move(SPEED, 0),
        ]);
    }

    //GAME LOGIC
    gameState.item = 0;

    player.onCollide('tree', () => {
        bump(tree);

        wait(.2, () => {
        for (let i = 0; i < 10; i++) {
            appear('objet');
        }
        tree.play('default');
        });
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
            layer('game'),
            'star',
        ]);

        starBonus.onUpdate(() => {
        //  starBonus.angle += 120 * dt();
        });

        player.onCollide('star', () => {
            score.text = score.value;
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

go('menu');

