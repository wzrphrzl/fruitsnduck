import { fontStyleSmall } from '../../appInit.js';
import { palette } from '../../lib/colorpalette.js';

// UPGRADES PANEL (legendary objects collected by the player)
// Per-upgrade display size (all same width) + the playerStats key it maps to.
const UPGRADE_META = {
    superPiment:      { width: 24, height: 30, label: 'mines', statKey: 'mines' },
    superTomatoArmor: { width: 24, height: 32, label: 'armor', statKey: 'armor' },
    samaraSpeed:      { width: 24, height: 30, label: 'speed', statKey: 'speed' },
    superStar:        { width: 24, height: 22, label: 'stars', statKey: 'superStar' },
};

const UPGRADE_PANEL = {
    x: 32,            // left edge (screen)
    bottomY: 768,     // bottom edge — aligned with the combo boxes' bottom (672 + 96)
    width: 164,
    radius: 12,
    padX: 16,         // rect left edge → sprite left edge
    padTop: 16,       // rect top edge → first sprite top
    padBottom: 16,    // last sprite bottom → rect bottom edge
    itemGap: 12,      // vertical gap between two upgrades
    labelGap: 12,     // sprite right edge → label left edge
    titleGap: 16,     // title bottom edge → rect top edge
};

let upgrades = [];      // collected upgrade sprite names, in pickup order
let upgradeUIObjs = [];  // spawned UI objects, torn down and rebuilt on each change

// playerStats is handed in by addUpgrade_UI rather than imported : this keeps the UI free of
// any dependency on entities/player.js, which would otherwise close an import cycle
// (player → inventory → hud → hudUpgrades → player). It is mutated in place, so holding
// the reference is enough for the labels to keep reading live values.
let stats = null;

function clearUpgradesPanel() {
    upgradeUIObjs.forEach(o => o.exists() && destroy(o));
    upgradeUIObjs = [];
}

export function resetUpgrades() {
    clearUpgradesPanel();
    upgrades = [];
}

export function addUpgrade_UI(spriteName, playerStats) {
    if (!UPGRADE_META[spriteName] || upgrades.includes(spriteName)) return;
    stats = playerStats;
    upgrades.push(spriteName);
    renderUpgradesPanel();
}

function renderUpgradesPanel() {
    clearUpgradesPanel();
    if (upgrades.length === 0) return;

    const P = UPGRADE_PANEL;
    // spawn a fixed UI object AND track it for teardown
    const track = (comps) => { const o = add([...comps, fixed(), layer('ui')]); upgradeUIObjs.push(o); return o; };

    // height = paddings + items + gaps between them
    const itemsHeight = upgrades.reduce((h, n) => h + UPGRADE_META[n].height, 0);
    const height = P.padTop + itemsHeight + P.itemGap * (upgrades.length - 1) + P.padBottom;
    const topY = P.bottomY - height;   // rect top edge (world y)

    // background (bottom-left anchored → grows upward as upgrades are added)
    track([
        rect(P.width, height, { radius: P.radius }), pos(P.x, P.bottomY), anchor('botleft'),
        color(Color.fromHex(palette.blue.darkest)), opacity(0.5),
    ]);

    // title "Upgrades", above the panel
    track([
        text('Upgrades', fontStyleSmall), pos(P.x, topY - P.titleGap), anchor('botleft'),
        color(Color.fromHex(palette.slate.lighter)),
    ]);

    // items: first pickup stays at the bottom, later ones stack above it
    let itemBottom = P.bottomY - P.padBottom;
    for (const name of upgrades) {
        const meta = UPGRADE_META[name];
        const itemTop = itemBottom - meta.height;

        track([
            sprite(name, { width: meta.width, height: meta.height }),
            pos(P.x + P.padX, itemTop), anchor('topleft'),
        ]);

        // "<name> +<live value>" — value read from playerStats, refreshed each frame
        const value = () => `${meta.label} +${stats[meta.statKey]}`;
        const label = track([
            text(value(), fontStyleSmall),
            pos(P.x + P.padX + meta.width + P.labelGap, itemTop + meta.height / 2), anchor('left'),
            color(Color.fromHex(palette.slate.lighter)),
        ]);
        label.onUpdate(() => { label.text = value(); });

        itemBottom = itemTop - P.itemGap;   // next item sits above
    }
}
