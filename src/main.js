import { k, gameState, SPEED, addRect, fontStyleSmall } from './appInit.js';
import { createPlayer } from './player.js';
import { createEnemy } from './enemy.js';

import './menu.js';

scene('game', () => {

    //debug.inspect = true;

    const pear = sprite('pear');
    const banana = sprite('banana');
    const tomato = sprite('tomato');
    const virusPurple = sprite('virusPurple');
    const virusBlue = sprite('virusBlue');
    const virusBrown = sprite('virusBrown');
    const star = sprite('star');
    const objets = [banana, pear, tomato, virusPurple, virusBlue, virusBrown];

    setBackground('#134C4C');
    /*HAUT*/   addRect(9360, 1080, 0, -3960, -3200, '#000000', 'ui', { area: true });
    /*DROITE*/ addRect(1080, 9360, 0, 3240, -4280, '#000000', 'ui', { area: true });
    /*BAS*/    addRect(9360, 1080, 0, -3960, 2920, '#000000', 'ui', { area: true });
    /*GAUCHE*/ addRect(1080, 9360, 0, -2880, -4280, '#000000', 'ui', { area: true });
    const box1 = addRect(96,96, 20, 1084, 672, '#1B1B1B', 'ui', { fixed: true });
    const box2 = addRect(96,96, 20, 1192, 672, '#1B1B1B', 'ui', { fixed: true });
    const box3 = addRect(96,96, 20, 1300, 672, '#1B1B1B', 'ui', { fixed: true });    


    // UI 
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

        return tree;
    }
    
    const tree = addTree(1080, 256);

    tree.onStateEnter('default', () => {
        tree.play('default');
    });

    tree.onStateEnter('fruity', () => {
        tree.play('fruity');
    });    

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
        if (tree.state === 'fruity') {     
            wait(.2, () => {
                for (let i = 0; i < 10; i++) {
                    appear('objet');
                }
                tree.enterState('default');
            });
        }
    });    



    box1.add([
            pear,
            anchor("center"),
            pos(48,48),
            scale(.5),
            layer('ui'),
    ]); 

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

go('game');

