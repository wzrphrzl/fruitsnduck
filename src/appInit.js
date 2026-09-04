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
        up: { keyboard: ['up', 'w', 'z'], gamepad: ['dpad-up'] },
        left: { keyboard: ['left', 'a', 'q'], gamepad: ['dpad-left'] },
        down: { keyboard: ['down', 's'], gamepad: ['dpad-down'] },
        right: { keyboard: ['right', 'd'], gamepad: ['dpad-right'] },
    },
});

// FONT STYLES, GAME LAYERS AND SCORE STATE
loadFont('monogram', './font/monogram-extended.ttf');
const fontStyleBold = { size: 80, font: 'monogram' };
const fontStyleBig = { size: 72, font: 'monogram' };
const fontStyleMedium = { size: 64, font: 'monogram' };
const fontStyleRegular = { size: 56, font: 'monogram' };
const fontStyleText = { size: 48, font: 'monogram' };
const fontStyleSmall = { size: 40, font: 'monogram' };

setLayers(['bg', 'game', 'ui'], 'ui');

const scoreStats = { savedScore: '', virusCount: '', gameTime: 0, comboCount: 0, };

// SOUND EFFECTS
loadSound('fallen-precious-object', './sound/bonus/fallen-precious-object.mp3');
loadSound('fruit-collected', './sound/bonus/fruit-collected.mp3');
loadSound('debuff', './sound/bonus/debuff.mp3');
loadSound('soundStress', './sound/bonus/sound-stress.mp3');
loadSound('buff', './sound/bonus/buff.mp3');
loadSound('lose', './sound/game-state/lose.mp3');
loadSound('mainTheme', './sound/fnd-main-theme.mp3');
const musicPlaying = play('mainTheme', { volume: .33, loop: true, paused: false });



loadSound('treeHit', './sound/tree/tree-hit.mp3');
loadSound('footstep-1', './sound/footsteps/footstep-1.mp3');
loadSound('footstep-2', './sound/footsteps/footstep-2.mp3');
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
loadSound('grandma', './sound/grandma.wav');
// fruit combos
loadSound('baseCombo', './sound/fruitcombos/basecombo.mp3');
loadSound('unPerfectCombo', './sound/fruitcombos/unperfectcombo.mp3');
loadSound('perfectCombo', './sound/fruitcombos/perfectcombo.mp3');
// loot box
loadSound('lootBox-1', './sound/lootBox/lootBox-1.mp3');
loadSound('lootBox-2', './sound/lootBox/lootBox-2.mp3');
loadSound('lootBox-3', './sound/lootBox/lootBox-3.mp3');
// pickups
loadSound('pickedAcorn', './sound/pickups/pickedAcorn.mp3');
loadSound('pickedDandelionChrono', './sound/pickups/pickedDandelionChrono.mp3');
loadSound('pickedHeartInGame', './sound/pickups/pickedHeartInGame.mp3');
loadSound('pickedSamaraSpeed', './sound/pickups/pickedSamaraSpeed.mp3');
loadSound('pickedSuperHeart', './sound/pickups/pickedSuperHeart.mp3');
loadSound('pickedSuperPiment', './sound/pickups/pickedSuperPiment.mp3');
loadSound('pickedSuperTomatoArmor', './sound/pickups/pickedSuperTomatoArmor.mp3');
// tomato armor
loadSound('armor-broken', './sound/tomato-armor/armor-broken.mp3');
loadSound('armor-empty-1', './sound/tomato-armor/armor-empty-1.mp3');
loadSound('armor-empty-2', './sound/tomato-armor/armor-empty-2.mp3');
loadSound('armorHit', './sound/tomato-armor/armorHit.mp3');
// npc
loadSound('blackbird', './sound/npc/blackbird.mp3');
// misc
loadSound('buttonClick', './sound/buttonClick.mp3');
loadSound('dandelionChronoGrows', './sound/dandelionChronoGrows.mp3');
loadSound('thistleGrows', './sound/thistleGrows.mp3');
loadSound('fallenFruit-1', './sound/fallenFruit-1.mp3');
loadSound('fallenFruit-2', './sound/fallenFruit-2.mp3');
loadSound('hitByVirus', './sound/hitByVirus.mp3');
loadSound('throwAcorn', './sound/throwAcorn.mp3');
loadSound('timerShort', './sound/timerShort.mp3');
loadSound('virusMoves', './sound/virusMoves.mp3');
loadSound('playerDeath', './sound/game-state/playerDeath.mp3');
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
loadSprite('virus1Pink', './img/virus-1-pink.png');
loadSprite('virus2Yellow', './img/virus-2-yellow.png');
loadSprite('virus3Red', './img/virus-3-red.png');
loadSprite('virus4Blue', './img/virus-4-blue.png');
loadSprite('virus5Brown', './img/virus-5-brown.png');

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
            from: 13,
            to: 13,
            loop: false,
        },
        'lose': {
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
        'spit': {
            from: 16,
            to: 17,
            loop: false,
            speed: 6,
        },
    },
});

loadSprite('boss', './img/boss.png', {
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

loadSprite('explosion1', './img/explosion-1.png', {
    sliceX: 6,
    anims: {
        'default': {
            from: 0,
            to: 5,
            speed: 8,
            loop: false,
        },
    }
});
loadSprite('explosion2', './img/explosion-2.png', {
    sliceX: 6,
    anims: {
        'default': {
            from: 0,
            to: 5,
            speed: 8,
            loop: false,
        },
    }
});
loadSprite('explosion3', './img/explosion-3.png', {
    sliceX: 6,
    anims: {
        'default': {
            from: 0,
            to: 5,
            speed: 8,
            loop: false,
        },
    }
});
loadSprite('explosion4', './img/explosion-4.png', {
    sliceX: 6,
    anims: {
        'default': {
            from: 0,
            to: 5,
            speed: 8,
            loop: false,
        },
    }
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

loadSprite('pastaboxScreen', './intro/pastabox-screen.png', {
    sliceX: 4,
    anims: {
        'default': {
            from: 0,
            to: 3,
            speed: 8,
            loop: true,
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

loadSprite('treeSmall', './img/tree-small.png', {
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

loadSprite('treeFull', './img/tree-full.png', {
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

// INTRO 
loadSprite('kaplayScreen', './intro/kaplay-screen.png');

// CUTSCENE
loadSprite('1Landscape', './cutscene/1-landscape.png');
loadSprite('2Grandma', './cutscene/2-grandma.png');
loadSprite('2TagBlackbird', './cutscene/2-tag-blackbird.png');
loadSprite('2TagFruits', './cutscene/2-tag-fruits.png');
loadSprite('2TagVirus', './cutscene/2-tag-virus.png');
loadSprite('3ThrownAcorn', './cutscene/3-thrown-acorn.png');

// MAP MOUNTAINS 
loadSprite('moutainTop', './img/mountains/mountain-top.png');
loadSprite('moutainTopRight', './img/mountains/mountain-topright.png');
loadSprite('moutainRight', './img/mountains/mountain-right.png');
loadSprite('moutainBottomRight', './img/mountains/mountain-bottomright.png');
loadSprite('moutainBottom', './img/mountains/mountain-bottom.png');
loadSprite('moutainBottomLeft', './img/mountains/mountain-bottomleft.png');
loadSprite('moutainLeft', './img/mountains/mountain-left.png');
loadSprite('moutainTopLeft', './img/mountains/mountain-topleft.png');



export { k, scoreStats, musicPlaying, fontStyleBold, fontStyleBig, fontStyleMedium, fontStyleRegular, fontStyleText, fontStyleSmall };
