//loadRoot('public/')

//Son
loadSound('ring', './sound/ring.mp3');
loadSound('glou', './sound/glou.mp3');
loadSound('fumer', './sound/fumer.mp3');
loadSound('wesh', './sound/wesh.mp3');
loadSound('roomba', './sound/roomba.mp3');
loadSound('lose', './sound/lose.mp3');
loadSound("OtherworldlyFoe", "./sound/OtherworldlyFoe.mp3");
loadSound('rolls', './sound/rolls.mp3');
loadSound('pet-1', './sound/pet-1.mp3');
loadSound('pet-2', './sound/pet-2.mp3');
loadSound('pet-3', './sound/pet-3.mp3');
loadSound('pet-4', './sound/pet-4.mp3');
loadSound('pet-5', './sound/pet-5.mp3');


play("OtherworldlyFoe", { loop: true, paused: false, });
loadFont("jersey", "./font/jersey.ttf");

loadSprite('prix', './img/prix.png');
loadSprite('euros10', './img/euros10.png');
loadSprite('euros20', './img/euros20.png');
loadSprite('canb', './img/canb.png');
loadSprite('cang', './img/cang.png');
loadSprite('cano', './img/cano.png');
loadSprite('canr', './img/canr.png');
loadSprite('label5', './img/label5.png');

loadSprite('roomba', './img/roomba.png');
loadSprite('cb', './img/cb.png');
loadSprite('sprite0', './img/lose/0.png');
loadSprite('sprite1', './img/lose/1.png');

loadSprite('spectrum-survivor', './img/spectrum-survivor.png', {
    sliceX: 2,
    anims: {
        'idle': {
            from: 0,
            to: 1,
            speed: 2,
            loop: true,
        }
    }
});
loadSprite('speltur', './img/speltur.png', {
    sliceX: 10,
    anims: {
        'idle': {
            from: 0,
            to: 9,
            speed: 6,
            loop: true,
        }
    }
});
loadSprite('typhlo', './img/typhlo.png', {
    sliceX: 2,
    anims: {
        'idle': {
            from: 0,
            to: 1,
            speed: 10,
            loop: true,
        }
    }
});

export function ajouterBouton(texte, posX, posY) {
    function addButton(txt, f) {

        const btn = add([
            rect(280, 80, { radius: 8 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor("center"),
            outline(4, Color.fromHex("#3C5AA5")),
            color(219, 249, 255),
        ]);

        btn.add([
            text(txt),
            anchor("center"),
            color(Color.fromHex("#3C5AA5")),
        ]);

        btn.onHoverUpdate(() => {
            const t = time() * 10;
            btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
            btn.scale = vec2(1.2);
            setCursor("pointer");
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = rgb(219, 249, 255);
        });

        btn.onClick(f);

    }

    addButton(texte, () => { go('game'); });

}

export function animJoueur(param1) {
    param1.scale = vec2(1.15);
    wait(0.2, () => {
        param1.scale = vec2(1);
    });
}