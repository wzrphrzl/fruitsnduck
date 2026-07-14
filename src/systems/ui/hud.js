import { fontStyleMedium, fontStyleRegular } from '../../appInit.js';
import { addRect } from '../../lib/helpers.js';
import { palette } from '../../lib/colorpalette.js';
import { resetScoreTiles } from './scoreTiles.js';
import { resetComboTile } from './comboTile.js';
import { resetUpgrades } from './upgrades.js';

// Builds the static HUD and resets every widget's state for a fresh game.
export function createUI() {

    // RESET EVERY WIDGET'S PERSISTENT STATE
    resetScoreTiles();
    resetComboTile();
    resetUpgrades();

    // SCORE
    const initialScore = 0;
    const score = add([
        text('Score : ' + initialScore, fontStyleMedium),
        pos(32, 24),
        anchor('topleft'),
        { value: initialScore },
        fixed(), layer('ui'),
    ]);

    // INVENTORY UI : "Fruit Combo" label + 3 combo boxes
    add([
        text('Fruit Combo', fontStyleRegular),
        pos(1404, 632),
        anchor('topright'),
        { value: 0 },
        color(palette.slate.lighter),
        fixed(), layer('ui'),
    ]);

    const box1 = addRect(96, 96, 20, 1072, 672, palette.blue.darkest, 'ui', { fixed: true });
    const box2 = addRect(96, 96, 20, 1192, 672, palette.blue.darkest, 'ui', { fixed: true });
    const box3 = addRect(96, 96, 20, 1312, 672, palette.blue.darkest, 'ui', { fixed: true });

    return { score, box1, box2, box3 };
}
