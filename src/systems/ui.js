import { fontStyleTiny } from '../appInit.js';
import { addRect } from '../lib/helpers.js';
import { player } from '../entities/player.js';
import { bumpHp } from '../lib/effects.js';

// FLOATING SCORE TILES (STAIRCASE) — SHARED STATE
// Each score change spawns a tile at the top slot, just under the score.
// Older tiles shift down one slot; at most 3 are shown at once (a 4th drops
// the oldest). Each tile lives 3s, fading out via tween + easeInOutQuad.
const SCORE_TILE = {
    x: 32,          // LEFT-ALIGNED WITH THE SCORE
    topY: 64,       // TOP SLOT, JUST BELOW THE SCORE
    w: 56,
    h: 28,
    gap: 6,         // VERTICAL GAP BETWEEN STACKED TILES
    life: 3,        // SECONDS BEFORE A TILE IS GONE
    max: 3,         // MAX TILES ON SCREEN
};

// MOST RECENT TILE FIRST : index 0 = top slot
let scoreTiles = [];

function scoreTileSlotY(index) {
    return SCORE_TILE.topY + index * (SCORE_TILE.h + SCORE_TILE.gap);
}

// SNAP EVERY TILE TO THE SLOT MATCHING ITS ARRAY INDEX
function repositionScoreTiles() {
    scoreTiles.forEach((tile, index) => {
        const y = scoreTileSlotY(index);
        tile.bg.pos = vec2(SCORE_TILE.x, y);
        tile.text.pos = vec2(SCORE_TILE.x + SCORE_TILE.w / 2, y + SCORE_TILE.h / 2);
    });
}

function removeScoreTile(tile) {
    const index = scoreTiles.indexOf(tile);
    if (index === -1) return;                        // ALREADY REMOVED
    scoreTiles.splice(index, 1);
    if (tile.fade && !tile.finished) tile.fade.cancel();
    if (tile.bg.exists()) destroy(tile.bg);
    if (tile.text.exists()) destroy(tile.text);
    repositionScoreTiles();
}

export function createUI() {


    // SCORE UI
    const initialScore = 0;
    const score = add([
        text('Score : ' + initialScore, fontStyleTiny),
        pos(32, 24),
        fixed(),
        anchor('topleft'),
        { value: initialScore },
        layer('ui'),
    ]);

    // SCORE TILES
    scoreTiles = [];


    // INVENTORY UI
    add([
        text('Fruit Combo', fontStyleTiny),
        pos(1408, 632),
        fixed(),
        anchor('topright'),
        { value: 0 },
        color('#92A1B9'),
        layer('ui'),
    ]);

    const box1 = addRect(96, 96, 20, 1072, 672, '#03193F', 'ui', { fixed: true });
    const box2 = addRect(96, 96, 20, 1192, 672, '#03193F', 'ui', { fixed: true });
    const box3 = addRect(96, 96, 20, 1312, 672, '#03193F', 'ui', { fixed: true });

    return { score, box1, box2, box3 };
}

// amount : signed score change (e.g. 5 → '+5', -10 → '-10')
export function showScoreTile(amount) {

    // OVERFLOW : DROP THE OLDEST (BOTTOM) TILE BEFORE ADDING A NEW ONE
    if (scoreTiles.length >= SCORE_TILE.max) {
        removeScoreTile(scoreTiles[scoreTiles.length - 1]);
    }

    const labelText = (amount > 0 ? '+' : '') + amount;

    // BACKGROUND : 56x28, RADIUS 16, #03193F @ 50% OPACITY
    const bg = add([
        rect(SCORE_TILE.w, SCORE_TILE.h, { radius: 16 }),
        pos(SCORE_TILE.x, SCORE_TILE.topY),
        anchor('topleft'),
        color(Color.fromHex('#03193F')),
        opacity(0.5),
        fixed(),
        layer('ui'),
        'scoreTile',
    ]);

    // LABEL : NUNITO 16px, #B4B4B4, CENTERED ON THE TILE (own opacity, unaffected by the bg)
    const textObj = add([
        text(labelText, { size: 16, font: 'Nunito' }),
        pos(SCORE_TILE.x + SCORE_TILE.w / 2, SCORE_TILE.topY + SCORE_TILE.h / 2),
        anchor('center'),
        color(Color.fromHex('#B4B4B4')),
        opacity(1),
        fixed(),
        layer('ui'),
        'scoreTile',
    ]);

    const tile = { bg, text: textObj, finished: false, fade: null };

    // FADE OUT OVER ITS 3s LIFETIME (easeInOutQuad), THEN REMOVE
    tile.fade = tween(1, 0, SCORE_TILE.life, (p) => {
        bg.opacity = p * 0.5;   // BG CAPS AT 50%
        textObj.opacity = p;    // LABEL CAPS AT 100%
    }, easings.easeInOutQuad);
    tile.fade.onEnd(() => {
        tile.finished = true;
        removeScoreTile(tile);
    });

    // NEWEST GOES ON TOP; EXISTING TILES SHIFT DOWN ONE SLOT
    scoreTiles.unshift(tile);
    repositionScoreTiles();
}

// COUNTDOWN TIMER
// startSeconds : initial time in seconds (e.g. 60 → starts at 01:00)
// onTimeout    : callback fired once when the timer reaches 0 (loses the game)
export function createTimer(startSeconds, onTimeout) {

    // FORMAT A TIME IN SECONDS AS XX:XX (e.g. 60 → '01:00', 59 → '00:59')
    function formatTime(totalSeconds) {
        const clamped = Math.max(0, Math.ceil(totalSeconds));
        const minutes = Math.floor(clamped / 60);
        const seconds = clamped % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    // ALIGNED WITH THE SCORE (SAME Y / FONT SIZE), HORIZONTALLY CENTERED
    const timer = add([
        text(formatTime(startSeconds), fontStyleTiny),
        pos(width() / 2, 24),
        fixed(),
        anchor('top'),
        layer('ui'),
        {
            remaining: startSeconds,
            stopped: false,
        },
    ]);

    // COUNT DOWN FRAME-BY-FRAME WITH dt(), REFRESH THE XX:XX LABEL EACH FRAME
    timer.onUpdate(() => {
        if (timer.stopped) return;

        timer.remaining -= dt();

        if (timer.remaining <= 0) {
            timer.remaining = 0;
            timer.stopped = true;
            timer.text = formatTime(0);
            onTimeout();
            return;
        }

        timer.text = formatTime(timer.remaining);
    });

    return timer;
}

// HEALTH POINTS
// bumpIndex (optional): index of the heart that just changed, to pop it; omit to pop none
export function healthPointsUI(bumpIndex) {

    // CLEAR EXISTING HEARTS
    destroyAll('hp');

    function addHeart(index) {

        get('hp').forEach((heart) => {
            heart.pos.x += -44;
        });

        // FULL IF WITHIN CURRENT HP, ELSE EMPTY (anim set at creation: no override = no timing race)
        const heart = add([
            sprite('heartUI', { anim: index < player.hp ? 'heartFull' : 'heartEmpty' }),
            scale(0.47),
            pos(1386, 48),
            fixed(),
            opacity(1),
            layer('ui'),
            anchor('center'),
            'hp',
        ]);

        // POP ONLY THE HEART THAT CHANGED
        if (index === bumpIndex) {
            bumpHp(heart);
        }
    }

    // ADDS ONE HEART PER MAX HP POINT
    for (let i = 0; i < player.maxHP; i++) {
        addHeart(i);
    }
    
}


// RARE OBJECTS
let rareObjStats_UI = {
    count: 0,
    posX: 32,
};;

export function addRareObject_UI(spriteName) {

    let posX = rareObjStats_UI.posX;

    if (rareObjStats_UI.count < 3) {
        rareObjStats_UI.posX = rareObjStats_UI.posX + 88;

        const addedBox = addRect(80, 80, 40, posX, 696, '#03193F', 'ui', { fixed: true });
        addedBox.add([
            sprite( spriteName ),
            anchor("center"),
            pos(40, 40),
            scale(.5),
            layer('ui'),
        ]);
    }
    rareObjStats_UI.count++;
}
