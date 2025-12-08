import k from './1-config.js';
import { ajouterBouton, animJoueur } from './assets.js';

const SPEED = 600;
let scoreEnregistré = '';
let canuche = '';
let pvRolls = 5;


loadShader("invert", null);

/***********/
//SCENE-MENU
/***********/

scene('menu', () => {

    k.setBackground(185, 150, 210);

    const spectrumSurvivor = add([
        sprite('spectrum-survivor'),
        pos(width() / 2, height() / 2 - 192),
        scale(1.33),
        anchor('center'),
    ]);

    spectrumSurvivor.play('idle');

    ajouterBouton('Commencer', width() / 2, height() / 2 + 64);

    add([
        sprite('prix'),
        pos(width() / 2, height() / 2 + 360),
        anchor('center'),
    ]);

    add([
        text('v.0.6b', { size: 32 }),
        color(219, 249, 255),
        pos(width() - 40, 40),
        anchor('center'),
        anchor('right'),
    ]);

});

/*************/
//SCENE-GAME 1
/*************/

scene('game', () => {

    canuche = 0;

    k.setBackground(50, 50, 50);

    //RECANGLES
    function addRect(width, height, posX, posY) {
        k.add([
            rect(width, height),
            pos(posX, posY),
            area(),
            color(0, 0, 0),
            body({ isStatic: true })
        ]);
    }

    //HAUT
    addRect(5760, 1080, -1920, -1720)
    //BAS
    addRect(5760, 1080, -1920, 1720)
    //GAUCHE
    addRect(1920, 3240, -2560, -1080)
    //GAUCHE
    addRect(1920, 3240, 2560, -1080)

    //SCORE
    let score = add([
        text('€ ' + 0, {
            font: 'jersey',
            size: 100
        }),
        pos(64, 72),
        fixed(),
        anchor('left'),
        scale(1),
        z(100),
        { value: 0 },
    ]);

    //TYPHLO
    const typhlo = k.add([
        sprite('typhlo'),
        pos(1080, 256),
        scale(1),
        anchor('center'),
        area(),
        body({ mass: 30 }),
        'typhlo',
    ]);

    typhlo.play('idle');
    typhlo.onClick(() => {
        burp();
        animJoueur(typhlo);
    });
    k.onCollide('speltur', 'typhlo', () => {
        burp();
        animJoueur(typhlo);
    });


    const listePets = ['pet-1', 'pet-2', 'pet-3', 'pet-4', 'pet-5'];

    function prouter() {
        const random = Math.floor(Math.random() * listePets.length);
        play(listePets[random]);
    }

    loadSprite('caca', './img/caca.png', {
        sliceX: 2,
        anims: {
            'idle': {
                from: 0,
                to: 1,
                speed: 4,
                loop: true,
            }
        }
    });

    //ROLLS
    loadSprite('rolls', './img/rolls.png', {
        sliceX: 2,
        anims: {
            'idle': {
                from: 0,
                to: 0,
                speed: 6,
                loop: true,
            },
            'idle2': {
                from: 1,
                to: 1,
                speed: 6,
                loop: true,
            }
        }
    });

    let ROLLS_SPEED = 100;
    let taillerolls = 2.33;
    const bruitRolls = play('rolls');

    const rolls = add([
        sprite('rolls'),
        rotate(120),
        pos(width() + 80, height() + 80),
        area({ scale: .66 }),
        body(),
        scale(taillerolls),
        anchor('center'),
        state('move'),
        'rolls',
    ]);


    rolls.onStateEnter('move', async () => {

        if (joueur.exists()) {
            const dir = joueur.pos.sub(rolls.pos).unit();
            rolls.move(dir.scale(ROLLS_SPEED));

            bruitRolls;
        }

        await wait(0);
        rolls.enterState('move');

    });

    rolls.onStateUpdate('move', () => {

        if (!joueur.exists()) return;
        const dir = joueur.pos.sub(rolls.pos).unit();
        rolls.move(dir.scale(ROLLS_SPEED));
        rolls.angle -= 120 * dt();

    });

    //CHIER
    k.onKeyPress("space", () => {

        const caca = k.add([
            sprite('caca'),
            pos(joueur.pos.add(-20, 20)),
            anchor("bot"),
            area({ scale: 1 }),
            scale(1.5),
            z(-10),
            //body(),
            'caca',
        ]);

        prouter();
        ROLLS_SPEED++;

        caca.play('idle');
        //joueur.moveTo(rand(0, width()), rand(0, height()));

    });

    rolls.onCollide('caca', (caca) => {
        pvRolls = pvRolls - 1;
        console.log(pvRolls);
        play('rolls');
        destroy(caca);


        console.log(rolls.pos);

        rolls.color = RED;
        wait(.05, () => {
            rolls.color = null;
        });

        if (pvRolls == 0) {

            const dir = joueur.pos.sub(rolls.pos).unit();
            rolls.move(dir.scale(ROLLS_SPEED));

            bruitRolls;



            rolls.play('idle2');
            wait(5, () => {
                destroy(rolls);
            });
        }

    });

    //JOUEUR SPELTUR
    const joueur = k.add([
        sprite('speltur'),
        pos(center()),
        anchor('center'),
        area({ scale: .45 }),
        body(),
        shader("invert", () => ({
            "u_time": time(),
        })),
        'speltur'
    ]);

    joueur.play('idle');
    joueur.onClick(() => { play('wesh'); animJoueur(joueur); });

    joueur.onUpdate(() => {
        camPos(joueur.pos);
        camScale(1);
    });

    onKeyDown('left', () => { joueur.move(-SPEED, 0); });
    onKeyDown('q', () => { joueur.move(-SPEED, 0); });
    onKeyDown('right', () => { joueur.move(SPEED, 0); });
    onKeyDown('d', () => { joueur.move(SPEED, 0); });
    onKeyDown('up', () => { joueur.move(0, -SPEED); });
    onKeyDown('z', () => { joueur.move(0, -SPEED); });
    onKeyDown('down', () => { joueur.move(0, SPEED); });
    onKeyDown('s', () => { joueur.move(0, SPEED); });

    onKeyDown("left", () => {
        joueur.flipX = true;
    });
    onKeyDown("right", () => {
        joueur.flipX = false;
    });

    onKeyDown("q", () => {
        joueur.flipX = true;
    });
    onKeyDown("d", () => {
        joueur.flipX = false;
    });




    onKeyPress('space', () => {
        //play('wesh');
        animJoueur(joueur);
    });

    //OBJETS
    const euros20 = sprite('euros20');

    const cang = sprite('cang');
    const canb = sprite('canb');
    const canr = sprite('canr');
    const cb = sprite('cb');

    const objets = [euros20, cang, cang, canb, canr];

    function apparait(param1) {
        const x = rand(-500, 2520);
        const y = rand(-600, 1680);
        //const random = Math.floor(Math.random() * objets.length);
        k.add([
            objets[0],
            pos(x, y),
            area(),
            rotate(x),
            scale(1),
            body({ mass: .3 }),
            param1,
            move(SPEED, 0)
        ]);
    }



    for (let i = 0; i < 100; i++) {
        apparait('objet');
    }

    //LOOT
    joueur.onCollide('objet', (objet) => {

        destroy(objet);
        animJoueur(joueur);
        apparait('objet');

        function colChange(couleur) {
            score.color = couleur;
            wait(.5, () => {
                score.color = WHITE;
            });
        }

        if (objet.sprite == 'euros20') {
            colChange(YELLOW);
            score.value += 20;
            play('ring');
        }

        animJoueur(score);

        score.text = '€ ' + score.value;

    });

    //CB

    loop(5, () => {

        const cbBonus = add([
            cb,
            pos(rand(vec2(0), vec2(width(), height()))),
            rotate(0),
            scale(.66),
            anchor('center'),
            area(),
            body(),
            'cb'
        ]);

        cbBonus.onUpdate(() => {
            cbBonus.angle += 120 * dt();
        });

        k.onCollide('speltur', 'cb', () => {
            score.text = '€ ' + score.value;

            destroy(cbBonus);

            for (let i = 0; i < 3; i++) {
                apparait('objet');
            }
        });

        wait(3, () => {
            destroy(cbBonus);
        });

    });

});



//SCENE-LOSE
scene('lose', () => {

    k.setBackground(185, 150, 210);

    function scorePersonnalisé(param1, param2) {
        add([
            sprite(param1),
            pos(width() / 5, height() / 2 - 80),
            scale(1.5),
            anchor('center'),
        ]);
        add([
            text(param2, {
                font: 'jersey',
                size: 56
            }),
            pos(width() / 2, height() / 2 - 160),
            anchor('center')
        ]);
    }

    if (scoreEnregistré <= 0) {
        scorePersonnalisé('sprite0', 'Fin n°1 : Dette d\'enculin !');
    } else if (scoreEnregistré > 0) {
        scorePersonnalisé('sprite1', 'Fin °2 : Friqué, en dépit de');
    }

    // display score
    add([
        text(0 + scoreEnregistré + ' € en banque'),
        pos(width() / 2, height() / 2 - 80),
        scale(1),
        anchor('center'),
    ]);

    add([
        text(0 + canuche + ' canuchons'),
        pos(width() / 2, height() / 2),
        scale(1),
        anchor('center'),
    ]);

    ajouterBouton('Mieux faire', width() / 2, height() / 2 + 180);

});


go('menu');


debug.inspect = true;