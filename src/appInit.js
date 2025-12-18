import kaplay from 'kaplay';
import 'kaplay/global';

const k = kaplay({
    // without specifying "width" and "height", kaboom will size to the container (document.body by default)
    width: 1440,
    height: 800,
    scale: 1,
    // "stretch" stretches the defined width and height to fullscreen
    stretch: true,
    // "letterbox" makes stretching keeps aspect ratio (leaves black bars on empty spaces), have no effect without "stretch"
    letterbox: true,
    //pixelDensity: window.devicePixelRatio,
});

setBackground('#000000');


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

loadSprite('grass', './img/grass.png');

loadSprite('tree', './img/tree.png', {
    sliceX: 5,
    anims: {
        'default': {
            from: 4,
            to: 4,
        },
        'fruity': {
            from: 0,
            to: 3,
            speed: 16,
            loop: false,
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
const fontStyleTiny = { size: 24, font: 'Nunito' };

export { k, scoreState, SPEED, fontStyleMed, fontStyleSmall, fontStyleTiny };
