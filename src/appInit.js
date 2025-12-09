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

// SOUNDS
loadSound('ring', './sound/ring.mp3');
loadSound('debuff', './sound/glou.mp3');
loadSound('fumer', './sound/fumer.mp3');
loadSound('roomba', './sound/roomba.mp3');
loadSound('lose', './sound/lose.mp3');
loadSound('OtherworldlyFoe', './sound/OtherworldlyFoe.mp3');
play('OtherworldlyFoe', { loop: true, paused: false });

// ASSETS
loadFont('jersey', './font/jersey.ttf');
loadSprite('rules', './img/rules.png');
k.setBackground(200, 200, 200);

const gameState = {
    scoreEnregistré: '',
    item: '',
};

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
loadShader('invert', null);

loadSprite('duck', './img/duck.png', {
    sliceX: 4,
    anims: {
        'idle': {
            from: 1,
            to: 0,
            speed: 6,
            loop: true,
        },
        'run': {
            from: 1,
            to: 0,
            speed: 6,
            loop: true,
        },
        'win': {
            from: 3,
            to: 3,
            loop: false,
        },
    },
});

loadSprite('enemy', './img/enemy.png', {
    sliceX: 2,
    anims: {
        'idle': {
            from: 0,
            to: 1,
            speed: 6,
            loop: true,
        },
        'run': {
            from: 0,
            to: 1,
            speed: 6,
            loop: true,
        },
    },
});

loadSprite('titleScreen', './img/title-screen.png', {
    sliceX: 0,
    anims: {
        'blink': {
            from: 0,
            to: 0,
            speed: 2,
            loop: true,
        },
    }
});

function addButton(texte, posX, posY) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(320, 96, { radius: 8 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor('center'),
            outline(6, Color.fromHex('#3C5AA5')),
            color(219, 249, 255),
        ]);

        btn.add([
            text(txt, { size: 80, font: 'jersey' }),
            anchor('center'),
            color(Color.fromHex('#3C5AA5')),
        ]);

        btn.onHoverUpdate(() => {
            const t = time() * 10;
            btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
            btn.scale = vec2(1.1);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = rgb(219, 249, 255);
        });

        btn.onClick(f);
    }

    addButton(texte, () => {
        go('game');
    });
}

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

export { k, gameState, SPEED, addRect, addButton };
