import { fontStyleRegular, fontStyleSmall } from '../../appInit.js';
import { addRect } from '../../lib/helpers.js';
import { palette } from '../../lib/colorpalette.js';
import { resetScoreTiles } from './scoreTiles.js';
import { resetComboTile } from './comboTile.js';
import { resetUpgrades } from './upgrades.js';
import { createPauseMenu } from './pauseMenu.js';

// Builds the static HUD and resets every widget's state for a fresh game.
export function createUI() {

    // RESET EVERY WIDGET'S PERSISTENT STATE
    resetScoreTiles();
    resetComboTile();
    resetUpgrades();

    // SCORE
    const initialScore = 0;
    // STATIC LABEL : never moves, never bumped
    // z above the pause menu's veil, so the score stays readable while paused
    const HUD_Z = 9500;

    const scoreLabel = add([
        text('Score:', fontStyleRegular),
        pos(32, 32),
        anchor('left'),
        z(HUD_Z),
        fixed(), layer('ui'),
    ]);

    // VALUE : updated and bumped independently of the label
    const score = add([
        text('' + initialScore, fontStyleRegular),
        pos(172, 32),
        scale(1),
        anchor('left'),
        { value: initialScore },
        z(HUD_Z),
        fixed(), layer('ui'),
    ]);

    // INVENTORY UI : "Fruit Combo" label + 3 combo boxes
    add([
        text('Fruit Combo', fontStyleSmall),
        pos(1404, 620),
        anchor('topright'),
        { value: 0 },
        color(palette.slate.lighter),
        fixed(), layer('ui'),
    ]);

    const box1 = addRect(96, 96, 20, 1072, 672, palette.blue.darkest, 'ui', { fixed: true });
    const box2 = addRect(96, 96, 20, 1192, 672, palette.blue.darkest, 'ui', { fixed: true });
    const box3 = addRect(96, 96, 20, 1312, 672, palette.blue.darkest, 'ui', { fixed: true });

    // PAUSE MENU : built hidden, bound to P / Escape
    createPauseMenu();

    return { score, box1, box2, box3 };
}
