import { fontStyleBig, fontStyleMedium } from '../../appInit.js';
import { palette } from '../../lib/colorpalette.js';
import { wavy } from '../../lib/effects.js';

// COMBO TILE POPUP : shown at the bottom center of the screen when a combo is made
const COMBO_BOX = {
    w: 384,
    h: 96,          // same height as the fruit boxes
    cx: 720,        // horizontally centered on the screen (1440 wide)
    bottomY: 768,   // aligned with the fruit boxes' bottom edge (top 672 + height 96)
    radius: 24,
    z: 100,         // above the static "Fruit Combo" label
    delay: 2.5,       // visible time before the fade-out
    fadeTime: 0.5,  // fade-out duration
};

// used when showComboTile() is called without an explicit color pair
const DEFAULT_COLORS = { bg: palette.blue.darkest, accent: palette.green.lighter };

// single reusable popup : { box, label, timer, fade } — or null when hidden
let comboPopup = null;

export function resetComboTile() {
    comboPopup = null;
}

// `colors` : { bg, accent } hex strings — see comboColors() in loots.js
export function showComboTile(name, colors = DEFAULT_COLORS) {
    const cy = COMBO_BOX.bottomY - COMBO_BOX.h / 2;
    const bg = Color.fromHex(colors.bg);
    const accent = Color.fromHex(colors.accent);

    if (!comboPopup || !comboPopup.box.exists()) {
        // CREATE
        const box = add([
            rect(COMBO_BOX.w, COMBO_BOX.h, { radius: COMBO_BOX.radius }),
            pos(COMBO_BOX.cx, cy), anchor('center'),
            color(bg),
            outline(4, accent),
            opacity(1), z(COMBO_BOX.z), fixed(), layer('ui'),
        ]);
        const label = add([
            text(name, { ...fontStyleBig, letterSpacing: 8, transform: wavy }),
            pos(COMBO_BOX.cx + 2, cy - 8), anchor('center'),
            color(accent),
            opacity(1), z(COMBO_BOX.z), fixed(), layer('ui'),
        ]);
        comboPopup = { box, label, timer: null, fade: null };
    } else {
        // REUSE : a new combo while it's still shown → update text + colors, cancel the pending fade-out
        comboPopup.timer?.cancel();
        comboPopup.fade?.cancel();
        comboPopup.label.text = name;
        comboPopup.box.color = bg;
        comboPopup.box.outline.color = accent;
        comboPopup.label.color = accent;
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
