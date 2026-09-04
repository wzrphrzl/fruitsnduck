import { fontStyleRegular, fontStyleSmall } from '../../appInit.js';
import { palette } from '../../lib/colorpalette.js';

// FLOATING SCORE TILES
const SCORE_TILE = { x: 32, topY: 72, w: 56, h: 32, gap: 6, life: 3, max: 3 };

// MOST RECENT TILE FIRST : index 0 = top slot
let scoreTiles = [];

export function resetScoreTiles() {
    scoreTiles = [];
}

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

// amount : signed score change (e.g. 5 → '+5', -10 → '-10')
export function showScoreTile(amount) {

    // OVERFLOW : DROP THE OLDEST (BOTTOM) TILE BEFORE ADDING A NEW ONE
    if (scoreTiles.length >= SCORE_TILE.max) {
        removeScoreTile(scoreTiles[scoreTiles.length - 1]);
    }

    const labelText = (amount > 0 ? '+' : '') + amount;
    // GAIN → green, LOSS → red (color only; fade below still just tweens opacity)
    const textColor = amount > 0 ? palette.green.bright : palette.red.dark;

    // BACKGROUND : #03193F @ 66%, radius 8
    const bg = add([
        rect(SCORE_TILE.w, SCORE_TILE.h, { radius: 8 }),
        pos(SCORE_TILE.x, SCORE_TILE.topY), anchor('topleft'),
        color(Color.fromHex(palette.blue.darkest)), opacity(0.66),
        fixed(), layer('ui'),
        'scoreTile',
    ]);

    const textObj = add([
        text(labelText, fontStyleSmall),
        pos(SCORE_TILE.x + SCORE_TILE.w / 2, SCORE_TILE.topY + SCORE_TILE.h / 2), anchor('center'),
        color(Color.fromHex(textColor)), opacity(1),
        fixed(), layer('ui'),
        'scoreTile',
    ]);

    const tile = { bg, text: textObj, finished: false, fade: null };

    // FADE OUT OVER ITS LIFETIME (easeInOutQuad), THEN REMOVE
    tile.fade = tween(1, 0, SCORE_TILE.life, (p) => {
        bg.opacity = p * 0.66;   // BG CAPS AT 66%
        textObj.opacity = p;     // LABEL CAPS AT 100%
    }, easings.easeInOutQuad);
    tile.fade.onEnd(() => {
        tile.finished = true;
        removeScoreTile(tile);
    });

    // NEWEST GOES ON TOP; EXISTING TILES SHIFT DOWN ONE SLOT
    scoreTiles.unshift(tile);
    repositionScoreTiles();
}
