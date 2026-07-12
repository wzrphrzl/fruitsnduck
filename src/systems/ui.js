import { fontStyleMedium, fontStyleRegular, fontStyleMention, fontStyleCaveat } from '../appInit.js';
import { addRect } from '../lib/helpers.js';
import { player, playerStats } from '../entities/player.js';
import { bumpHp, bumpMini } from '../lib/effects.js';
import { palette } from '../lib/colorpalette.js';

// FLOATING SCORE TILES
const SCORE_TILE = {
    x: 32,          
    topY: 64,       
    w: 56,
    h: 32,
    gap: 6,         
    life: 3,        
    max: 3,         
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
        text('Score : ' + initialScore, fontStyleMedium),
        pos(32, 24),
        fixed(),
        anchor('topleft'),
        { value: initialScore },
        layer('ui'),
    ]);

    // SCORE TILES
    scoreTiles = [];

    // COMBO NAME POPUP
    comboPopup = null;

    // ABILITIES PANEL
    resetAbilitiesUI();

    // INVENTORY UI
    add([
        text('Fruit Combo', fontStyleRegular),
        pos(1404, 632),
        fixed(),
        anchor('topright'),
        { value: 0 },
        color(palette.slate.lighter),
        layer('ui'),
    ]);

    const box1 = addRect(96, 96, 20, 1072, 672, palette.blue.darkest, 'ui', { fixed: true });
    const box2 = addRect(96, 96, 20, 1192, 672, palette.blue.darkest, 'ui', { fixed: true });
    const box3 = addRect(96, 96, 20, 1312, 672, palette.blue.darkest, 'ui', { fixed: true });

    return { score, box1, box2, box3 };
}

// COMBO BOXES

export function renderComboBoxes(boxes, comboSlots, previousSprites, bumpIndex) {

    // REMOVE THE PREVIOUSLY DRAWN FRUITS
    previousSprites.forEach((s) => { if (s) destroy(s); });

    // DRAW THE CURRENT SLOTS, EACH CENTERED IN ITS BOX
    return comboSlots.map((spriteName, index) => {
        if (!spriteName) return null;

        const box = boxes[index];
        const fruit = box.add([
            sprite(spriteName),
            anchor('center'),
            pos(box.width / 2, box.height / 2),
            scale(.65),
            layer('ui'),
        ]);

        // POP THE FRUIT THAT WAS JUST COLLECTED
        if (index === bumpIndex) bumpMini(fruit);

        return fruit;
    });
}

// COMBO NAME POPUP : shown above the fruit combo boxes when a combo is made
const COMBO_BOX = {
    w: 328,
    h: 64,
    cx: 1240,       // horizontally centered over the 3 fruit boxes (1072 → 1408)
    bottomY: 656,   // 16px above the boxes' top edge (672)
    radius: 12,
    z: 100,         // above the static "Fruit Combo" label
    delay: 2,       // visible time before the fade-out (matches the combo inventory clear)
    fadeTime: 0.5,  // fade-out duration
};

// single reusable popup : { box, label, timer, fade } — or null when hidden
let comboPopup = null;

export function showComboName(name) {
    const cy = COMBO_BOX.bottomY - COMBO_BOX.h / 2;

    if (!comboPopup || !comboPopup.box.exists()) {
        // CREATE
        const box = add([
            rect(COMBO_BOX.w, COMBO_BOX.h, { radius: COMBO_BOX.radius }),
            pos(COMBO_BOX.cx, cy), anchor('center'),
            color(Color.fromHex(palette.blue.darkest)),
            outline(2, Color.fromHex(palette.green.lighter)),
            opacity(1), z(COMBO_BOX.z), fixed(), layer('ui'),
        ]);
        const label = add([
            text(name, fontStyleCaveat),
            pos(COMBO_BOX.cx, cy -2), anchor('center'),
            color(Color.fromHex(palette.green.lighter)),
            opacity(1), z(COMBO_BOX.z), fixed(), layer('ui'),
        ]);
        comboPopup = { box, label, timer: null, fade: null };
    } else {
        // REUSE : a new combo while it's still shown → update text, cancel the pending fade-out
        comboPopup.timer?.cancel();
        comboPopup.fade?.cancel();
        comboPopup.label.text = name;
        comboPopup.box.opacity = 1;
        comboPopup.label.opacity = 1;
    }

    // (RE)START : wait `delay`, then fade out and remove
    const popup = comboPopup;
    popup.timer = wait(COMBO_BOX.delay, () => {
        popup.fade = tween(1, 0, COMBO_BOX.fadeTime, (p) => {
            if (popup.box.exists()) popup.box.opacity = p;
            if (popup.label.exists()) popup.label.opacity = p;
        }, easings.easeInOutQuad);
        popup.fade.onEnd(() => {
            if (popup.box.exists()) destroy(popup.box);
            if (popup.label.exists()) destroy(popup.label);
            if (comboPopup === popup) comboPopup = null;
        });
    });
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

    // BACKGROUND : same fill/opacity as the abilities panel (#03193F @ 66%), radius 8
    const bg = add([
        rect(SCORE_TILE.w, SCORE_TILE.h, { radius: 8 }),
        pos(SCORE_TILE.x, SCORE_TILE.topY),
        anchor('topleft'),
        color(Color.fromHex(palette.blue.darkest)),
        opacity(0.66),
        fixed(),
        layer('ui'),
        'scoreTile',
    ]);

    const textObj = add([
        text(labelText, fontStyleMention),
        pos(SCORE_TILE.x + SCORE_TILE.w / 2, SCORE_TILE.topY + SCORE_TILE.h / 2),
        anchor('center'),
        color(Color.fromHex(textColor)),
        opacity(1),
        fixed(),
        layer('ui'),
        'scoreTile',
    ]);

    const tile = { bg, text: textObj, finished: false, fade: null };

    // FADE OUT OVER ITS 3s LIFETIME (easeInOutQuad), THEN REMOVE
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

// HEALTH POINTS
export function healthPointsUI(bumpIndex) {

    // CLEAR EXISTING HEARTS
    destroyAll('hp');

    function addHeart(index) {

        get('hp').forEach((heart) => {
            heart.pos.x += -48;
        });

        // FULL IF WITHIN CURRENT HP, ELSE EMPTY (anim set at creation: no override = no timing race)
        const heart = add([
            sprite('heartUI', { anim: index < player.hp ? 'heartFull' : 'heartEmpty' }),
            scale(0.5),
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


// ABILITIES PANEL (legendary objects collected by the player)
// Per-ability display size (all same width) + the playerStats key it maps to.
const ABILITY_META = {
    superPiment:      { width: 24, height: 30, label: 'mines', statKey: 'mines' },
    superTomatoArmor: { width: 24, height: 32, label: 'armor', statKey: 'armor' },
    samaraSpeed:      { width: 24, height: 30, label: 'speed', statKey: 'speed' },
    superStar:        { width: 24, height: 22, label: 'stars', statKey: 'superStar' },
};

const ABILITY_PANEL = {
    x: 32,            // left edge (screen)
    bottomY: 768,     // bottom edge — aligned with the combo boxes' bottom (672 + 96)
    width: 148,
    radius: 12,
    padX: 16,         // rect left edge → sprite left edge
    padTop: 16,       // rect top edge → first sprite top
    padBottom: 16,    // last sprite bottom → rect bottom edge
    itemGap: 12,      // vertical gap between two abilities
    labelGap: 12,     // sprite right edge → label left edge
    titleGap: 16,     // title bottom edge → rect top edge
};

let abilities = [];      // collected ability sprite names, in pickup order
let abilityUIObjs = [];  // spawned UI objects, torn down and rebuilt on each change

function clearAbilitiesPanel() {
    abilityUIObjs.forEach(o => o.exists() && destroy(o));
    abilityUIObjs = [];
}

function resetAbilitiesUI() {
    clearAbilitiesPanel();
    abilities = [];
}

export function addRareObject_UI(spriteName) {
    if (!ABILITY_META[spriteName] || abilities.includes(spriteName)) return;
    abilities.push(spriteName);
    renderAbilitiesPanel();
}

function renderAbilitiesPanel() {
    clearAbilitiesPanel();
    if (abilities.length === 0) return;

    const P = ABILITY_PANEL;
    // spawn a fixed UI object on the 'ui' layer and track it for teardown
    const ui = (comps) => { const o = add([...comps, fixed(), layer('ui')]); abilityUIObjs.push(o); return o; };

    // height = paddings + items + gaps between them
    const itemsHeight = abilities.reduce((h, n) => h + ABILITY_META[n].height, 0);
    const height = P.padTop + itemsHeight + P.itemGap * (abilities.length - 1) + P.padBottom;
    const topY = P.bottomY - height;   // rect top edge (world y)

    // background (bottom-left anchored → grows upward as abilities are added)
    ui([
        rect(P.width, height, { radius: P.radius }), pos(P.x, P.bottomY), anchor('botleft'),
        color(Color.fromHex(palette.blue.darkest)), opacity(0.5),
    ]);

    // title "Abilities", above the panel
    ui([
        text('Abilities', fontStyleRegular), pos(P.x, topY - P.titleGap), anchor('botleft'),
        color(Color.fromHex(palette.slate.lighter)),
    ]);

    // items: first pickup stays at the bottom, later ones stack above it
    let itemBottom = P.bottomY - P.padBottom;
    for (const name of abilities) {
        const meta = ABILITY_META[name];
        const itemTop = itemBottom - meta.height;

        ui([
            sprite(name, { width: meta.width, height: meta.height }),
            pos(P.x + P.padX, itemTop), anchor('topleft'),
        ]);

        // "<name> +<live value>" — value read from playerStats, refreshed each frame
        const value = () => `${meta.label} +${playerStats[meta.statKey]}`;
        const label = ui([
            text(value(), fontStyleMention),
            pos(P.x + P.padX + meta.width + P.labelGap, itemTop + meta.height / 2), anchor('left'),
            color(Color.fromHex(palette.slate.lighter)),
        ]);
        label.onUpdate(() => { label.text = value(); });

        itemBottom = itemTop - P.itemGap;   // next item sits above
    }
}
