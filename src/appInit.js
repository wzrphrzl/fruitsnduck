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

setLayers(['bg', 'game', 'ui'], 'game');

// SOUNDS
loadSound('ring', './sound/ring.mp3');
loadSound('debuff', './sound/glou.mp3');
loadSound('fumer', './sound/fumer.mp3');
loadSound('roomba', './sound/roomba.mp3');
loadSound('lose', './sound/lose.mp3');
loadSound('OtherworldlyFoe', './sound/OtherworldlyFoe.mp3');
play('OtherworldlyFoe', { loop: true, paused: false });

// ASSETS
loadFont('Nunito', './font/Nunito-SemiBold.ttf');
loadSprite('rules', './img/rules.png');

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
loadSprite('tree', './img/tree.png');
loadShader('invert', null);

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
        },
        'win': {
            from: 3,
            to: 3,
            loop: false,
        },
        'lose': {
            from: 2,
            to: 2,
            loop: false,
        },
    },
});

loadSprite('enemy', './img/enemy.png', {
    sliceX: 2,
    anims: {
        'idle': {
            from: 0,
            to: 0,
            loop: false,
        },
        'run': {
            from: 1,
            to: 0,
            speed: 3.5,
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

const fontStyle = { size: 56, font: 'Nunito' };

function addButton(texte, posX, posY) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(296, 96, { radius: 8 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor('center'),
            outline(6, Color.fromHex('#3C5AA5')),
            color(219, 249, 255),
            layer('ui'),
        ]);

        btn.add([
            text(txt, fontStyle),
            anchor('center'),
            color(Color.fromHex('#3C5AA5')),
            layer('ui'),
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
function addRect(width, height, posX, posY, colorName, layerName) {
    k.add([
        rect(width, height),
        pos(posX, posY),
        anchor('topleft'),
        area(),
        color(colorName),
        body({ isStatic: true }),
        layer(layerName),
    ]);
}

export { k, gameState, SPEED, addRect, addButton, fontStyle };
