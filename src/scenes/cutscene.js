import { palette } from '../lib/colorpalette.js';
import { fontStyleText, fontStyleSmall } from '../appInit.js';

scene('cutscene', () => {

    //debug.inspect = true;

    // Scene-specific input binding (cleaned-up handlers below are scene-scoped)
    setButton("next", {
        keyboard: "space",
        mouse: "left",
    });

    // BACKGROUND FRAME DEFINITION
    add([
        rect(1440, 800),
        pos(0, 0),
        color(Color.fromHex(palette.magenta.darkest2)),
        anchor('topleft'),
        fixed(),
        layer('bg'),
    ]);

    // SKIP BUTTON 
    const skipBtn = add([
        rect(88, 64, { radius: 12 }),
        pos(width() - 24, 24),
        area(),
        anchor('topright'),
        outline(3, Color.fromHex(palette.cyan.darker)),
        color(palette.blue.darker),
        z(30),
    ]);
    const skipLabel = skipBtn.add([
        text('Skip', fontStyleSmall),
        anchor('center'),
        pos(-44, 32),
        color(Color.fromHex(palette.cyan.darker)),
        z(31),
    ]);
    skipBtn.onHoverUpdate(() => {
        skipBtn.color = Color.fromHex(palette.blue.dark);
        skipBtn.outline.color = Color.fromHex(palette.cyan.default);
        skipLabel.color = Color.fromHex(palette.cyan.default);
        setCursor('pointer');
    });
    skipBtn.onHoverEnd(() => {
        skipBtn.color = Color.fromHex(palette.blue.darker);
        skipBtn.outline.color = Color.fromHex(palette.cyan.darker);
        skipLabel.color = Color.fromHex(palette.cyan.darker);
    });
    skipBtn.onClick(() => {
        play('buttonClick');
        go('game');
    });


    // Each line may carry a visual: sprite + anchor + world pos + size.
    // The frame (mask), its sprite and the border all resize/reposition to it.
    // A line without `sprite` keeps the previous visual on screen.
    const dialogs = [
        { text: "[default][/default]", sprite: "1Landscape", anchor: "topleft", pos: vec2(298, 40), width: 843, height: 528 },
        { text: "[default]My dearest little Qurkee, I am growing tired... The day has come for me to pass on the legacy of our fruit tree orchard...[/default]" },
        { text: "[default]Long ago, its magic trees bore every fruit in the world. It was nature's gift to the animals.[/default]", sprite: "2Grandma", anchor: "topleft", pos: vec2(168, -104), width: 552, height: 754 },
        { text: "[default]But the jealous Blackbird cuts down our trees to mass-produce his nests... Today, there are almost no magic trees left...[/default]", tags: [{ sprite: "2TagBlackbird", pos: vec2(800, 320), width: 218, height: 202 }] },
        { text: "[default]...and where the trees vanish, the viruses spread...[/default]", tags: [{ sprite: "2TagVirus", pos: vec2(1052, 240), width: 207, height: 206 }] },
        { text: "[default]Qurkee, make our orchard bloom again, you are our last hope.[/default]" },
        { text: "[default]Remember my recipes, gather 3 fruits and the magic happens: Salad, Compote, Crumble... and my famous [/default][kaboom]Smoothie[/kaboom][default]![/default]", tags: [{ sprite: "2TagFruits", pos: vec2(795, 40), width: 365, height: 250 }] },
        { text: "[default]Here... my last acorn. Grab it, my little duck.[/default]", sprite: "3ThrownAcorn", anchor: "top", pos: vec2(center().x, 56), width: 904, height: 496 },
        { text: "[default][kaboom]Good luck!!![/kaboom]  [/default]" },
    ];
    let curDialog = 0;
    let isTalking = false;
    let tagObjs = [];
    let writing = null;      // handle on the running typewriter loop
    let curLen = 0;          // full length of the line being typed

    // LANDSCAPE ILLUSTRATION : matches dialogs[0] (size + pos),
    // rounded corners (radius 16) clipped via mask + cyan outline


    const frameW = 843;
    const frameH = 528;
    const frameRadius = 16;
    const framePos = vec2(298, 40);

    const frame = add([
        rect(frameW, frameH, { radius: frameRadius }),
        pos(framePos),
        anchor('topleft'),
        mask(),
        z(0),
    ]);
    const avatar = frame.add([
        sprite('1Landscape', { width: frameW, height: frameH }),
        anchor('topleft'),
        pos(0, 0),
        opacity(1),
    ]);

    const frameBorder = add([
        rect(frameW, frameH, { radius: frameRadius, fill: false }),
        pos(framePos),
        anchor('topleft'),
        outline(4, Color.fromHex(palette.cyan.default)),
        opacity(1),
        z(1),
    ]);

    const textbox = add([
        rect(width() - 120, 144, { radius: 16 }),
        anchor('center'),
        // bottom edge 56px above the screen bottom (anchor center, height 144 → -56 -72)
        pos(center().x, height() - 56 - 72),
        color(Color.fromHex(palette.blue.darkest)),
        outline(4, Color.fromHex(palette.cyan.default)),
        opacity(1),
        z(10),
    ]);

    // 2s fade-in on the dialog box and the first visual when the scene starts
    textbox.fadeIn(0);
    avatar.fadeIn(2);
    frameBorder.fadeIn(2);



    // Dialog text with typewriter effect.
    // Padding inside the textbox : 12 top / 32 right / 20 bottom / 32 left.
    // Top-left = textbox top-left corner + (left, top) padding.
    const txtPos = textbox.pos.sub((width() - 120) / 2, 144 / 2).add(32, 20);
    const txt = add([
        text("", {
            ...fontStyleText,
            width: 1264,
            align: "left",
            styles: {
                "default": { color: Color.WHITE },
                // Wave effect only (keeps the default white)
                "kaboom": (idx) => ({
                    pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
                }),
            },
            transform: (idx) => ({
                opacity: idx < txt.letterCount ? 1 : 0,
            }),
        }),
        pos(txtPos),
        anchor("topleft"),
        z(20),
        { letterCount: 0 },
    ]);

    onButtonPress("next", () => {
        // Still typing → reveal the whole line instantly instead of advancing
        if (isTalking) {
            finishWriting();
            return;
        }

        // Last line fully shown → start the game
        if (curDialog === dialogs.length - 1) {
            go('game');
            return;
        }

        // Advance to the next dialog
        curDialog += 1;
        updateDialog();
    });

    // Swap the visual (if this line defines one), then type the text.
    // Frame (mask), sprite and border all resize/reposition to the sprite.
    function updateDialog() {
        const d = dialogs[curDialog];
        if (d.sprite) {
            // A new main visual resets the overlay tags
            tagObjs.forEach(destroy);
            tagObjs = [];
            avatar.use(sprite(d.sprite, { width: d.width, height: d.height }));
            avatar.anchor = d.anchor;
            for (const o of [frame, frameBorder]) {
                o.width = d.width;
                o.height = d.height;
                o.anchor = d.anchor;
                o.pos = d.pos;
            }
        }
        // Add this line's overlay tags (they accumulate until the next main visual)
        if (d.tags) {
            d.tags.forEach((t) => {
                const tag = add([
                    sprite(t.sprite, { width: t.width, height: t.height }),
                    pos(t.pos),
                    anchor("topleft"),
                    z(2),
                ]);
                shakeObj(tag);
                tagObjs.push(tag);
            });
        }
        startWriting(d.text);
    }

    // Per-sprite shake : jitters the object around its spawn pos for `duration`
    // seconds, then snaps it back (Kaplay's global shake() moves the whole camera).
    function shakeObj(obj, duration = 0.4, intensity = 6) {
        const base = obj.pos.clone();
        let t = 0;
        const ev = obj.onUpdate(() => {
            t += dt();
            if (t >= duration) {
                obj.pos = base;
                ev.cancel();
                return;
            }
            obj.pos = base.add(rand(-intensity, intensity), rand(-intensity, intensity));
        });
    }

    function startWriting(dialog) {
        isTalking = true;
        txt.letterCount = 0;
        txt.text = dialog;
        curLen = txt.formattedText().renderedText.length;

        // Empty line (e.g. the landscape splash) → nothing to type, no sound
        if (curLen === 0) {
            isTalking = false;
            return;
        }

        writing = loop(0.04, () => {
            txt.letterCount = Math.min(txt.letterCount + 1, curLen);
            play("grandma", { volume: 0.05 });

            if (txt.letterCount == curLen) {
                finishWriting();
            }
        });
    }

    // Reveal the current line in full and stop the typewriter loop.
    function finishWriting() {
        txt.letterCount = curLen;
        isTalking = false;
        if (writing) {
            writing.cancel();
            writing = null;
        }
    }

    // Show the landscape splash (fades in), then chain straight into the first
    // line so the text types itself without waiting for a click.
    updateDialog();
    wait(0, () => {
        curDialog += 1;
        updateDialog();
    });

});
