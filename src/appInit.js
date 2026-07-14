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
    buttons: {
        up:    { keyboard: ['up', 'w', 'z'], gamepad: ['dpad-up'] },
        left:  { keyboard: ['left', 'a', 'q'], gamepad: ['dpad-left'] },
        down:  { keyboard: ['down', 's'], gamepad: ['dpad-down'] },
        right: { keyboard: ['right', 'd'], gamepad: ['dpad-right'] },
    },
});

// FONT STYLES, GAME LAYERS AND SCORE STATE
loadFont('CaveatRegular', './font/Caveat-Regular.ttf');
loadFont('Nunito', './font/Nunito-SemiBold.ttf');
const fontStyleBig = { size: 48, font: 'Nunito' };
const fontStyleCaveat = { size: 34, font: 'CaveatRegular' };
const fontStyleMedium = { size: 28, font: 'Nunito' };
const fontStyleRegular = { size: 24, font: 'Nunito' };
const fontStyleMention = { size: 18, font: 'Nunito' };

setLayers(['bg', 'game', 'ui'], 'ui');

const scoreStats = { savedScore: '', virusCount: '', gameTime: 0, };

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
// SPRITES IN ALPHABETICAL ORDER
loadSprite('acorn', './img/acorn.png');
loadSprite('cbanana', './img/cbanana.png');
loadSprite('clemon', './img/clemon.png');
loadSprite('cpear', './img/cpear.png');
loadSprite('ccherry', './img/ccherry.png');
loadSprite('cwatermelon', './img/cwatermelon.png');
loadSprite('egg', './img/egg.png');
loadSprite('gameRules', './img/game-rules.png');
loadSprite('grass-1', './img/grass-1.png');
loadSprite('grass-2', './img/grass-2.png');
loadSprite('grass-3', './img/grass-3.png');
loadSprite('grass-4', './img/grass-4.png');
loadSprite('grass-5', './img/grass-5.png');
loadSprite('grass-6', './img/grass-6.png');
loadSprite('grass-7', './img/grass-7.png');
loadSprite('grass-8', './img/grass-8.png');
loadSprite('grass-9', './img/grass-9.png');
loadSprite('heartIngame', './img/heart-ingame.png');
loadSprite('particle', './img/particle_hexagon_filled.png');
loadSprite('samaraLegend', './img/samara-legend.png');
loadSprite('samaraSpeed', './img/samara-speed.png');
loadSprite('sGrape1', './img/sgrape-1.png');
loadSprite('sGrape2', './img/sgrape-2.png');
loadSprite('sGrape3', './img/sgrape-3.png');
loadSprite('sKumquat1', './img/skumquat-1.png');
loadSprite('sKumquat2', './img/skumquat-2.png');
loadSprite('sKumquat3', './img/skumquat-3.png');
loadSprite('sPiment1', './img/spiment-1.png');
loadSprite('sPiment2', './img/spiment-2.png');
loadSprite('sPiment3', './img/spiment-3.png');
loadSprite('sPlum1', './img/splum-1.png');
loadSprite('sPlum2', './img/splum-2.png');
loadSprite('sPlum3', './img/splum-3.png');
loadSprite('sTomato1', './img/stomato-1.png');
loadSprite('sTomato2', './img/stomato-2.png');
loadSprite('sTomato3', './img/stomato-3.png');
loadSprite('superHeart', './img/super-heart.png');
loadSprite('superHeartLegend', './img/super-heart-legend.png');
loadSprite('superPiment', './img/superpiment.png');
loadSprite('superPimentLegend', './img/superpiment-legend.png');
loadSprite('superStar', './img/superstar.png');
loadSprite('superstarLegend', './img/superstar-legend.png');
loadSprite('superTomatoArmor', './img/supertomato-armor.png');
loadSprite('superTomatoArmorLegend', './img/supertomato-armor-legend.png');
loadSprite('treeSmall', './img/tree-small.png');
loadSprite('virus3Red', './img/virus-3-red.png');
loadSprite('virus4Blue', './img/virus-4-blue.png');
loadSprite('virus5Brown', './img/virus-5-brown.png');
loadSprite('virusPink', './img/virus-1-pink.png');
loadSprite('virusYellow', './img/virus-2-yellow.png');

// ANIMATED SPRITES
loadSprite('dandelionChrono', './img/dandelion-chrono.png', {
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

loadSprite('duck', './img/duck.png', {
    sliceX: 7,
    sliceY: 3,
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
            speed: 9,
            loop: true,
        },
        'win': {
            from: 6,
            to: 6,
            loop: false,
        },
        'orangeIdle': {
            from: 7,
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
        'rage': {
            from: 14,
            to: 14,
            loop: false,
        },
        'vicious': {
            from: 15,
            to: 15,
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

loadSprite('heartUI', './img/heart-ui.png', {
    sliceX: 2,
    anims: {
        'heartFull': {
            from: 0,
            to: 0,
            loop: false,
        },
        'heartEmpty': {
            from: 1,
            to: 1,
            loop: false,
        },
    }
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

loadSprite('thistle', './img/thistle.png', {
    sliceX: 4,
    anims: {
        'default': {
            from: 0,
            to: 3,
            speed: 14,
            loop: false,
        },
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
        },
    }
});

loadSprite('tree', './img/tree-full.png', {
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


export { k, scoreStats, fontStyleBig, fontStyleCaveat, fontStyleMedium, fontStyleRegular, fontStyleMention };
