import kaplay from 'kaplay';
import 'kaplay/global';

// INITIALIZE KAPLAY 

// KAPLAY 
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

// GAME LAYERS AND SCORE STATE
setLayers(['bg', 'game', 'ui'], 'ui');
const scoreStats = {
    savedScore: '',
    virusCount: '',
};

// SOUNDS
loadSound('ring', './sound/ring.mp3');
loadSound('debuff', './sound/glou.mp3');
loadSound('roomba', './sound/roomba.mp3');
loadSound('lose', './sound/lose.mp3');
loadSound('OtherworldlyFoe', './sound/OtherworldlyFoe.mp3');
play('OtherworldlyFoe', { loop: true, paused: false });

//OBJECTS, TREE, PLAYER, ENEMY SPRITES
loadSprite('grass', './img/grass.png');
loadSprite('tomato', './img/tomato.png');
loadSprite('pear', './img/pear.png');
loadSprite('banana', './img/banana.png');
loadSprite('virusBlue', './img/virus-blue.png');
loadSprite('virusPurple', './img/virus-purple.png');
loadSprite('virusBrown', './img/virus-brown.png');
loadSprite('star', './img/star.png');

loadSprite('orange', './img/orange.png');
loadSprite('lemon', './img/lemon.png');
loadSprite('watermelon', './img/watermelon.png');
loadSprite('kumquat', './img/kumquat.png');
loadSprite('grape', './img/grape.png');
loadSprite('piment', './img/piment.png');
loadSprite('strawberry', './img/strawberry.png');

loadSprite('tomatoArmor', './img/tomato-armor.png');
loadSprite('superPiment', './img/super-piment.png');
loadSprite('superGrape', './img/super-grape.png');
loadSprite('blueberry', './img/blueberry.png');
loadSprite('egg', './img/egg.png');

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
    sliceY: 2,
    sliceX: 7,
    anims: {
        'defaultIdle': {
            from: 0,
            to: 0,
            loop: false,
        },
        'defaultRun': {
            from: 1,
            to: 0,
            speed: 6,
            loop: true,
        },
        'kwak': {
            from: 2,
            to: 2,
            loop: false,
        },
        'lose': {
            from: 3,
            to: 3,
            loop: false,
        },
        'win': {
            from: 4,
            to: 4,
            loop: false,
        },
        'stressIdle': {
            from: 5,
            to: 5,
            loop: false,
        },
        'stressRun': {
            from: 6,
            to: 5,
            speed: 6,
            loop: true,
        },        
        'orangeIdle': {
            from:7,
            to: 7,
            loop: false,
        },
        'orangeRun': {
            from: 8,
            to: 7,
            speed: 6,
            loop: true,
        },
        'orangePoop': {
            from: 9,
            to: 9,
            loop: false,
        },
        'armorIdle': {
            from: 10,
            to: 10,
            loop: false,
        },
        'armorRun': {
            from: 11,
            to: 10,
            speed: 4,
            loop: true,
        },
        'armorPoop': {
            from: 12,
            to: 12,
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

loadSprite('poop', './img/poop.png', {
    sliceX: 2,
    anims: {
        'idle': {
            from: 0,
            to: 1,
            speed: 4,
            loop: true,
        },
    }
});

// MENU SPRITES
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

loadSprite('gameRules', './img/game-rules.png');

// FONT STYLES
loadFont('Nunito', './font/Nunito-SemiBold.ttf');
const fontStyleMed = { size: 48, font: 'Nunito' };
const fontStyleSmall = { size: 32, font: 'Nunito' };
const fontStyleTiny = { size: 22, font: 'Nunito' };

export { k, scoreStats, fontStyleMed, fontStyleSmall, fontStyleTiny };
