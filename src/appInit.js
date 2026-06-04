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
    pixelDensity: window.devicePixelRatio,
    // VIRTUAL BUTTONS : MAP MOVEMENT ACTIONS TO KEYBOARD (ARROWS + WASD + ZQSD) AND GAMEPAD DPAD
    buttons: {
        up:    { keyboard: ['up', 'w', 'z'], gamepad: ['dpad-up'] },
        left:  { keyboard: ['left', 'a', 'q'], gamepad: ['dpad-left'] },
        down:  { keyboard: ['down', 's'], gamepad: ['dpad-down'] },
        right: { keyboard: ['right', 'd'], gamepad: ['dpad-right'] },
    },
});

// FONT STYLES, GAME LAYERS AND SCORE STATE
loadFont('Nunito', './font/Nunito-SemiBold.ttf');
const fontStyleMed = { size: 48, font: 'Nunito' };
const fontStyleSmall = { size: 32, font: 'Nunito' };
const fontStyleTiny = { size: 22, font: 'Nunito' };

setLayers(['bg', 'game', 'ui'], 'ui');

const scoreStats = { savedScore: '', virusCount: '', };

// SOUND EFFECTS
loadSound('fallen-precious-object', './sound/bonus/fallen-precious-object.mp3');
loadSound('fruit-collected', './sound/bonus/fruit-collected.mp3');
loadSound('debuff', './sound/bonus/debuff.mp3');
loadSound('soundStress', './sound/bonus/sound-stress.mp3');
loadSound('buff', './sound/bonus/buff.mp3');
loadSound('player-death', './sound/game-state/player-death.mp3');
loadSound('lose', './sound/game-state/lose.mp3');
loadSound('OtherworldlyFoe', './sound/OtherworldlyFoe.mp3');
play('OtherworldlyFoe', { volume: .05, loop: true, paused: false });

loadSound('treeHit', './sound/tree/tree-hit.mp3');
loadSound('footstep-1', './sound/footsteps/footstep-1.mp3');
loadSound('treePops-1', './sound/tree/tree-pops-1.mp3');
loadSound('treePops-2', './sound/tree/tree-pops-2.mp3');
loadSound('treePops-3', './sound/tree/tree-pops-3.mp3');
loadSound('treePops-4', './sound/tree/tree-pops-4.mp3');
loadSound('treePops-5', './sound/tree/tree-pops-5.mp3');
loadSound('armor-footstep-1', './sound/footsteps/armor-footstep-1.mp3');
loadSound('armor-footstep-2', './sound/footsteps/armor-footstep-2.mp3');
loadSound('armor-footstep-3', './sound/footsteps/armor-footstep-3.mp3');
loadSound('armor-footstep-4', './sound/footsteps/armor-footstep-4.mp3');
loadSound('kwak-1', './sound/kwak/kwak-1.mp3');
loadSound('kwak-2', './sound/kwak/kwak-2.mp3');
loadSound('kwak-3', './sound/kwak/kwak-3.mp3');
loadSound('kwak-4', './sound/kwak/kwak-4.mp3');
loadSound('kwak-5', './sound/kwak/kwak-5.mp3');
loadSound('fart-1', './sound/fart/fart-1.mp3');
loadSound('fart-2', './sound/fart/fart-2.mp3');
loadSound('fart-3', './sound/fart/fart-3.mp3');
loadSound('fart-4', './sound/fart/fart-4.mp3');
loadSound('fart-5', './sound/fart/fart-5.mp3');
// MAP
loadSprite('grass', './img/grass.png');
// OBJECTS, TREE, PLAYER, ENEMY SPRITES
loadSprite('tomato', './img/tomato.png');
loadSprite('pear', './img/pear.png');
loadSprite('banana', './img/banana.png');
loadSprite('virusBlue', './img/virus-blue.png');
loadSprite('virusPurple', './img/virus-purple.png');
loadSprite('virusBrown', './img/virus-brown.png');

loadSprite('orange', './img/orange.png');
loadSprite('lemon', './img/lemon.png');
loadSprite('watermelon', './img/watermelon.png');
loadSprite('kumquat', './img/kumquat.png');
loadSprite('grape', './img/grape.png');
loadSprite('piment', './img/piment.png');
loadSprite('strawberry', './img/strawberry.png');

loadSprite('tomatoArmor', './img/tomato-armor.png');
loadSprite('superPiment', './img/super-piment.png');
loadSprite('samaraSpeed', './img/samara-speed.png');
loadSprite('superGrape', './img/super-grape.png');
loadSprite('blueberry', './img/blueberry.png');
loadSprite('acorn', './img/acorn.png');
loadSprite('egg', './img/egg.png');

loadSprite('flower-1', './img/flower-1.png', {
    sliceX: 4,
    anims: {
        'default': {
            from: 0,
            to: 3,
            speed: 12,
            loop: false,
        },
    }
});
loadSprite('flower-2', './img/flower-2.png', {
    sliceX: 4,
    anims: {
        'default': {
            from: 0,
            to: 3,
            speed: 12,
            loop: false,
        },
    }
});
loadSprite('flower-3', './img/flower-3.png', {
    sliceX: 4,
    anims: {
        'default': {
            from: 0,
            to: 3,
            speed: 12,
            loop: false,
        },
    }
});

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
    sliceX: 7,
    sliceY: 2,
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
        'kwakRun': {
            from: 3,
            to: 2,
            speed: 6,
            loop: true,
        },
        'stressIdle': {
            from: 4,
            to: 4,
            loop: false,
        },
        'stressRun': {
            from: 5,
            to: 4,
            speed: 6,
            loop: true,
        }, 
        'win': {
            from: 6,
            to: 6,
            loop: false,
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
        'lose': {
            from: 13,
            to: 13,
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

export { k, scoreStats, fontStyleMed, fontStyleSmall, fontStyleTiny };
