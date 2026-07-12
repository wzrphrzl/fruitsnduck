import { fontStyleCaveat } from '../../appInit.js';
import { palette } from '../../lib/colorpalette.js';

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

export function resetComboName() {
    comboPopup = null;
}

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
            pos(COMBO_BOX.cx, cy - 2), anchor('center'),
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
