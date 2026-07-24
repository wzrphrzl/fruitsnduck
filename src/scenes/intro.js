import { palette } from '../lib/colorpalette.js';
import { fontStyleRegular } from '../appInit.js';

scene('intro', () => {


    // Scene-specific input binding (cleaned-up handlers below are scene-scoped)
    setButton("next", {
        keyboard: "space",
        mouse: "left",
    });

    // BACKGROUND FRAME DEFINITION
    const background = add([
        rect(1440, 800),
        pos(0, 0),
        color(Color.fromHex(palette.blue.darkest)),
        anchor('topleft'),
        fixed(),
        layer('bg'),
    ]);


    const dialogs = [
    "[default]Mon petit Qurkee bien aimé, je suis fatiguée... Le jour est venu pour moi de te confier l'héritage de notre verger d'arbres fruitiers...[/default]",
    "[default]Autrefois, ses arbres magiques donnaient tous les fruits du monde. C'était le cadeau de la nature aux animaux.[/default]",
    "[default]Mais le Merle jaloux découpe nos arbres pour vendre ses nids à la chaîne... Aujourd'hui, il n'y a presque plus d'arbres magiques...[/default]",
];
let curDialog = 0;
let isTalking = false;

// LANDSCAPE ILLUSTRATION : centered horizontally, 56px from the top,
// rounded corners (radius 8) clipped via mask + cyan outline


const frameW = 792;
const frameH = 496;
const frameRadius = 16;
const framePos = vec2(center().x, 56);

const frame = add([
    rect(frameW, frameH, { radius: frameRadius }),
    pos(framePos),
    anchor('top'),
    mask(),
]);
frame.add([
    sprite('1Landscape'),
    anchor('top'),
]);

const frameBorder = add([
    rect(frameW, frameH, { radius: frameRadius, fill: false }),
    pos(framePos),
    anchor('top'),
    outline(4, Color.fromHex(palette.cyan.default)),
]);


const textbox = add([
    rect(width() - 120, 144, { radius: 16 }),
    anchor('center'),
    // bottom edge 56px above the screen bottom (anchor center, height 144 → -56 -72)
    pos(center().x, height() - 56 - 72),
    color(Color.fromHex(palette.blue.dark)),
    outline(4, Color.fromHex(palette.cyan.default)),
]);

// Dialog text with typewriter effect.
// Padding inside the textbox : 12 top / 32 right / 20 bottom / 32 left.
// Top-left = textbox top-left corner + (left, top) padding.
const txtPos = textbox.pos.sub((width() - 120) / 2, 144 / 2).add(32, 12);
const txt = add([
    text("", {
        ...fontStyleRegular,
        width: 1264,
        align: "left",
        styles: {
            "default": { color: Color.WHITE },
        },
        transform: (idx) => ({
            opacity: idx < txt.letterCount ? 1 : 0,
        }),
    }),
    pos(txtPos),
    anchor("topleft"),
    { letterCount: 0 },
]);

onButtonPress("next", () => {
    if (isTalking) return;

    // Cycle through the dialogs
    curDialog = (curDialog + 1) % dialogs.length;
    startWriting(dialogs[curDialog]);
});

function startWriting(dialog) {
    isTalking = true;
    txt.letterCount = 0;
    txt.text = dialog;
    const len = txt.formattedText().renderedText.length;

    const writing = loop(0.05, () => {
        txt.letterCount = Math.min(txt.letterCount + 1, len);
        play("grandma", { volume: 0.05 });

        if (txt.letterCount == len) {
            isTalking = false;
            writing.cancel();
        }
    });
}

// Start the first dialog line
startWriting(dialogs[curDialog]);

});
