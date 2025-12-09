import kaplay from 'kaplay';
import 'kaplay/global';
const k = kaplay({
    // without specifying "width" and "height", kaboom will size to the container (document.body by default)
    width: 1920,
    height: 1080,
    // "stretch" stretches the defined width and height to fullscreen
    // stretch: true,
    // "letterbox" makes stretching keeps aspect ratio (leaves black bars on empty spaces), have no effect without "stretch"
    letterbox: true,
});

//debug.inspect = true;

// SOUNDS
loadSound('ring', './sound/ring.mp3');
loadSound('debuff', './sound/glou.mp3');
loadSound('fumer', './sound/fumer.mp3');
loadSound('roomba', './sound/roomba.mp3');
loadSound('lose', './sound/lose.mp3');
loadSound("OtherworldlyFoe", "./sound/OtherworldlyFoe.mp3");
play("OtherworldlyFoe", { loop: true, paused: false, });

// ASSETS
loadFont("jersey", "./font/jersey.ttf");
loadSprite('rules', './img/rules.png');
k.setBackground(200, 200, 200);
let scoreEnregistré = '';
let item = '';
const SPEED = 600;

// SPRITES
loadSprite('tomato', './img/tomato.png');
loadSprite('pear', './img/pear.png');
loadSprite('banana', './img/banana.png');
loadSprite('virusBlue', './img/virus-blue.png');
loadSprite('virusPurple', './img/virus-purple.png');
loadSprite('virusBrown', './img/virus-brown.png');
loadSprite('star', './img/star.png');
loadSprite('three', './img/three.png');
loadShader("invert", null);

loadSprite('duck', './img/duck.png', {
    sliceX: 4,
    anims: {
        'idle': {
            from: 0,
            to: 0,
            speed: 6,
            loop: true,
        },
        'run': {
            from: 1,
            to: 0,
            speed: 6,
            loop: true,
        }
    }
});

loadSprite('enemy', './img/enemy.png', {
    sliceX: 2,
    anims: {
        'idle': {
            from: 0,
            to: 0,
            speed: 6,
            loop: true,
        },
        'run': {
            from: 0,
            to: 1,
            speed: 6,
            loop: true,
        }
    }
});

loadSprite('titleScreen', './img/title-screen.png', {
    sliceX: 0,
    anims: {
        'blink': {
            from: 0,
            to: 0,
            speed: 2,
            loop: true,
        }
    }
});

function addButton(texte, posX, posY) {
    function addButton(txt, f) {

        const btn = k.add([
            rect(280, 80, { radius: 8 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor("center"),
            outline(4, Color.fromHex("#3C5AA5")),
            color(219, 249, 255),
        ]);

        btn.add([
            text(txt),
            anchor("center"),
            color(Color.fromHex("#3C5AA5")),
        ]);

        btn.onHoverUpdate(() => {
            const t = time() * 10;
            btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
            btn.scale = vec2(1.1);
            setCursor("pointer");
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = rgb(219, 249, 255);
        });

        btn.onClick(f);

    }

    addButton(texte, () => { go('game'); });

}

/****************/
/*     MENU     */
/****************/

scene('menu', () => {

    const titleScreen = add([
        sprite('titleScreen'),
        pos(width() / 2, height() / 2 - 192),
        scale(1),
        anchor('center'),
    ]);

    titleScreen.play('blink');

    addButton('Start', width() / 2, height() / 2 + 64);

    add([
        sprite('rules'),
        pos(width() / 2, height() / 2 + 360),
        anchor('center'),
    ]);

    add([
        text('V 0.8', { size: 32 }),
        color(219, 249, 255),
        pos(width() - 40, 40),
        anchor('center'),
        anchor('right'),
    ]);

});

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
            body({ isStatic: true })
        ]);
    }
    //HAUT
    addRect(5760, 1080, -1920, -1180)
    //BAS
    addRect(5760, 1080, -1920, 1180)
    //GAUCHE
    addRect(1920, 3240, -2020, -1080)
    //GAUCHE
    addRect(1920, 3240, 2020, -1080)

    //SCORE
    item = 0;

    let score = add([
        text('Score ' + 0, {
            font: 'jersey',
            size: 100
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
        area({ scale: .75 }),
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

        scoreEnregistré = score.value;
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
        shader("invert", () => ({
            "u_time": time(),
        })),
        state('move', ['idle', 'run']),
        'duck'
    ]);

    player.onUpdate(() => {
        setCamPos(player.pos);
        setCamScale(1);
    });

    // CONTROLS
    onKeyDown('left', () => { player.move(-SPEED, 0); });
    onKeyDown('right', () => { player.move(SPEED, 0); });
    onKeyDown('up', () => { player.move(0, -SPEED); });
    onKeyDown('down', () => { player.move(0, SPEED); });
    
    onKeyPress("left", () => { player.flipX = true; });
    onKeyPress("right", () => { player.flipX = false; });
    
    onKeyPress(["left", "right", "up", "down"], () => {
        player.play('run');
    });
    onKeyRelease(["left", "right", "up", "down"], () => {
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
            body({ mass: .3 }),
            param1,
            move(SPEED, 0)
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
            wait(.5, () => {
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
            item++;
        } else if (objet.sprite == 'virusBlue') {
            score.value -= 5;
            play('debuff');
            item++;
        } else if (objet.sprite == 'virusBrown') {
            score.value -= 15;
            play('debuff');
            item++;
        }

        if (enemy.exists() == true) {
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
            'star'
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
                size: 56
            }),
            pos(width() / 2, height() / 2 - 160),
            anchor('center')
        ]);
    }

    if (scoreEnregistré > 0) {
        scorePersonnalisé('duck', 'Fin °1 : Bien joué !');
    }
    else if (scoreEnregistré <= 0) {
        scorePersonnalisé('duck', 'Fin n°2 : C\'est mal joué :(');
    }

    // display score
    add([
        text(0 + scoreEnregistré + ' score'),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
    ]);

    add([
        text(0 + item + ' virus'),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
    ]);

    addButton('Mieux faire', width() / 2, height() / 2 + 180);

});


go('menu');


