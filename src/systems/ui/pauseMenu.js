import { fontStyleBig, fontStyleMedium } from '../../appInit.js';
import { palette } from '../../lib/colorpalette.js';

// PAUSE MENU : freezes every game object except itself, so no parent container
// is needed — a paused object stops updating AND stops firing its own events,
// which is what keeps this menu clickable while the game behind it is frozen.
const PAUSE_BOX = {
    w: 480,
    h: 300,
    radius: 24,
    z: 9000,        // above every other UI widget
    btnW: 320,
    btnH: 72,
    btnGap: 16,
};

let menu = null;        // the whole overlay (veil + panel), or null before create
let frozen = [];        // objects THIS menu paused : resume only wakes those back up
let paused = false;

export function resetPauseMenu() {
    menu = null;
    frozen = [];
    paused = false;
}

// TRUE WHILE THE GAME IS PAUSED — for the global key handlers that keep running
export function isGamePaused() {
    return paused;
}

export function togglePause() {
    if (!menu || !menu.exists()) return;

    paused = !paused;

    if (paused) {
        // Everything but the menu itself (children follow their parent)
        frozen = get('*').filter((o) => o !== menu && !o.paused);
        frozen.forEach((o) => { o.paused = true; });
        menu.hidden = false;
    } else {
        frozen.forEach((o) => { if (o.exists()) o.paused = false; });
        frozen = [];
        menu.hidden = true;
    }
}

// BUILDS THE OVERLAY (hidden) AND BINDS P / ESCAPE. Call once per game scene.
export function createPauseMenu() {
    resetPauseMenu();

    // Container : the single object excluded from the freeze
    menu = add([
        pos(0, 0),
        fixed(),
        layer('ui'),
        z(PAUSE_BOX.z),
        'pauseMenu',
    ]);
    menu.hidden = true;

    // DIMMED VEIL OVER THE GAME
    menu.add([
        rect(width(), height()),
        pos(0, 0),
        anchor('topleft'),
        color(Color.fromHex(palette.magenta.darkest2)),
        opacity(0.7),
        fixed(),
        layer('ui'),
    ]);

    // PANEL
    const panel = menu.add([
        rect(PAUSE_BOX.w, PAUSE_BOX.h, { radius: PAUSE_BOX.radius }),
        pos(center()),
        anchor('center'),
        color(Color.fromHex(palette.blue.darkest)),
        outline(4, Color.fromHex(palette.cyan.default)),
        fixed(),
        layer('ui'),
    ]);

    panel.add([
        text('Pause', fontStyleBig),
        pos(0, -PAUSE_BOX.h / 2 + 24),
        anchor('top'),
        color(Color.fromHex(palette.cyan.default)),
        fixed(),
        layer('ui'),
    ]);

    // BUTTONS : stacked under the title
    [
        ['Resume', togglePause],
        ['Quit', () => { togglePause(); go('intro'); }],
    ].forEach(([label, action], i) => {
        const btnY = -PAUSE_BOX.h / 2 + 128 + i * (PAUSE_BOX.btnH + PAUSE_BOX.btnGap);

        const btn = panel.add([
            rect(PAUSE_BOX.btnW, PAUSE_BOX.btnH, { radius: 12 }),
            pos(0, btnY),
            anchor('top'),
            area(),
            scale(1),
            outline(3, Color.fromHex(palette.yellowOrange.bright)),
            color(Color.fromHex(palette.blue.dark)),
            fixed(),
            layer('ui'),
        ]);

        btn.add([
            text(label, fontStyleMedium),
            pos(0, PAUSE_BOX.btnH / 2 - 4),
            anchor('center'),
            color(Color.fromHex(palette.yellowOrange.bright)),
            fixed(),
            layer('ui'),
        ]);

        btn.onHoverUpdate(() => {
            btn.color = Color.fromHex(palette.cyan.dark);
            btn.scale = vec2(1.05);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.color = Color.fromHex(palette.blue.dark);
            btn.scale = vec2(1);
        });

        btn.onClick(() => {
            play('buttonClick');
            action();
        });
    });

    // Global handler : never frozen, since it belongs to no game object
    onKeyPress(['p', 'escape'], togglePause);

    return menu;
}
