import { k, gameState, SPEED, addRect } from './appInit.js';
import { createPlayer } from './player.js';

scene('game', () => {

    //HAUT
    addRect(5760, 1080, -1920, -1180);
    //BAS
    addRect(5760, 1080, -1920, 1180);
    //GAUCHE
    addRect(1920, 3240, -2020, -1080);
    //GAUCHE
    addRect(1920, 3240, 2020, -1080);

    const score = add([
        text(' ' + 0, {
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

    // bump
    function bump(param1) {
        param1.scale = vec2(1.15);
        wait(0.2, () => {
            param1.scale = vec2(1);
        });
    }

    //ENEMY
    let SPEED_enemy = 20;
    let SIZE_enemy = 1;
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
        wait(1, () => {
            enemy.enterState('idle');
        });
        wait(2.5, () => {
            enemy.enterState('move');
        });
    });

    enemy.onStateUpdate('move', () => {
        if (!player.exists()) return;
        const dir = player.pos.sub(enemy.pos).unit();
        enemy.move(dir.scale(SPEED_enemy));
    });

    // PLAYER
    const player = createPlayer();

    //OBJETS
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
        appear('objet');

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
            SIZE_enemy += 0.1;
            SPEED_enemy += 5;
        }

        bump(score);
        score.text = score.value;
    });

    enemy.onCollide('duck', () => {
        destroy(player);
        SOUND_enemy.paused = !SOUND_enemy.paused;
        play('lose');

        gameState.scoreEnregistré = score.value;
        go('lose');
    });

    enemy.onCollide('objet', (objet) => {
        //if (objet.sprite == 'virusBlue' || objet.sprite == 'virusBrown') {
            destroy(objet);
        //}
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


