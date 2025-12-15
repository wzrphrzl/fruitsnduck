import kaplay from 'kaplay';
import 'kaplay/global';

const k = kaplay({
    // without specifying "width" and "height", kaboom will size to the container (document.body by default)
    width: 1440,
    height: 800,
    // "stretch" stretches the defined width and height to fullscreen
    // stretch: true,
    // "letterbox" makes stretching keeps aspect ratio (leaves black bars on empty spaces), have no effect without "stretch"
    letterbox: true,
});

setLayers(['bg', 'game', 'ui'], 'ui');

// SOUNDS
loadSound('ring', './sound/ring.mp3');
loadSound('debuff', './sound/glou.mp3');
loadSound('roomba', './sound/roomba.mp3');
loadSound('lose', './sound/lose.mp3');
loadSound('OtherworldlyFoe', './sound/OtherworldlyFoe.mp3');
play('OtherworldlyFoe', { loop: true, paused: false });

// ASSETS
loadFont('Nunito', './font/Nunito-SemiBold.ttf');
loadSprite('rules', './img/rules.png');

const scoreState = {
    savedScore: '',
    savedItems: '',
};

const SPEED = 400;

// SPRITES
loadSprite('tomato', './img/tomato.png');
loadSprite('pear', './img/pear.png');
loadSprite('banana', './img/banana.png');
loadSprite('virusBlue', './img/virus-blue.png');
loadSprite('virusPurple', './img/virus-purple.png');
loadSprite('virusBrown', './img/virus-brown.png');
loadSprite('star', './img/star.png');
//loadShader('invert', null);

loadSprite('tree', './img/tree.png', {
    sliceX: 2,
    anims: {
        'default': {
            from: 0,
            to: 0,

        },
        'fruity': {
            from: 1,
            to: 1,
        },
    }
});

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

const fontStyleMed = { size: 48, font: 'Nunito' };
const fontStyleSmall = { size: 32, font: 'Nunito' };

function addButton(texte, posX, posY) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(296, 96, { radius: 16 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor('center'),
            outline(4, Color.fromHex('#FFEB57')),
            color('#622461'),
            layer('ui'),
        ]);

        btn.add([
            text(txt, fontStyleMed),
            anchor('center'),
            pos(0,2),
            color(Color.fromHex('#FFEB57')),
            layer('ui'),
        ]);

        btn.onHoverUpdate(() => {
            //const t = time() * 10;
            //btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
            btn.color = Color.fromHex('#93388F');
            btn.scale = vec2(1.1);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = Color.fromHex('#622461');
        });

        btn.onClick(f);
    }

    addButton(texte, () => {
        go('game');
    });
}

//RECANGLES
const addRect = function (width, height, radiusVal, posX, posY, colorName, layerName, options = {}, rectName = 'rect') {
    const rectangle = [
        rect(width, height, { radius: radiusVal }),
        pos(posX, posY),
        anchor('topleft'),
        color(colorName),
        body({ isStatic: true }),
        layer(layerName),
        rectName,
    ];

    if (options.area === true) {
        rectangle.push(area());
    }

    if (options.fixed === true) {
        rectangle.push(fixed());
    }

    return k.add(rectangle);
}

function bump(param1) {
    param1.scale = vec2(1.15);
    wait(0.2, () => {
        param1.scale = vec2(1);
    });
}

function setXs() {
    if (Math.random() < 0.5) {
        return rand(0, 624);
    } else {
        return rand(816, 1440);
    }
}

function setYs() {
    if (Math.random() < 0.5) {
        return rand(0, 304);
    } else {
        return rand(496, 800);
    }
}


export { k, scoreState, SPEED, addRect, addButton, fontStyleMed, fontStyleSmall, bump, setXs, setYs };
