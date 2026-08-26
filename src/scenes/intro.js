

scene('intro', () => {


    // BLACK BACKGROUND
    add([
        rect(width(), height()),
        pos(0, 0),
        color(Color.fromHex('#000000')),
        anchor('topleft'),
        fixed(),
        layer('bg'),
    ]);

    // PASTABOX SCREEN : full-screen animated sprite (4 frames of 1440x800)
    const pastaboxScreen = add([
        sprite('pastaboxScreen', { anim: 'default' }),
        pos(0, 0),
        anchor('topleft'),
        opacity(1),   // required by fadeIn() : it uses this value as the fade target
        z(6),
    ]);

    // KAPLAY SCREEN : same full-screen still sprite, shown after the pastabox one
    const kaplayScreen = add([
        sprite('kaplayScreen'),
        pos(0, 0),
        anchor('topleft'),
        opacity(1),   // required by fadeIn() : it uses this value as the fade target
        z(6),
    ]);
    kaplayScreen.hidden = true;   // stays out of sight until its own fadeIn

    // fadeIn 2s -> hold 1s -> fadeOut 2s, twice in a row
    pastaboxScreen.fadeIn(2).then(() => {
        wait(1, () => {
            pastaboxScreen.fadeOut(1).then(() => {
                pastaboxScreen.destroy();
                kaplayScreen.hidden = false;
                kaplayScreen.fadeIn(1).then(() => {
                    wait(1, () => {
                        kaplayScreen.fadeOut(1).then(() => go('menu'));
                    });
                });
            });
        });
    });

});
