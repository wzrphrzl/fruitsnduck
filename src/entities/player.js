import { k } from '../appInit.js';
import { kwak, fart, armorWalks } from '../lib/audio.js';
import { palette } from '../lib/colorpalette.js';
import { popLastFruit } from '../systems/inventory.js';
import { addFireball } from './fireball.js';

const playerStats = { speedKaplay: 10, mines: 0, armor: 0, speed: 0, superStar: 1 };

let player;
let poop;

function createPlayer() {

    // PLAYER SPRITES AND STATES
    const playerStateList = ['defaultIdle', 'defaultRun', 'kwak', 'stressIdle', 'stressRun', 'orangeIdle', 'orangeRun', 'orangePoop', 'armorIdle', 'armorRun', 'armorPoop', 'lose', 'rage', 'vicious', 'spit'];


    player = k.add([
        sprite('duck'),
        pos(center()),
        anchor('center'),
        area({ shape: new Circle(vec2(0), 45), offset: vec2(0, 16) }),
        body(),
        z(10),
        health(3),
        state('defaultIdle', playerStateList),
        layer('game'),
        z(9999),
        'duck',
    ]);

    player.add([
        ellipse(48, 8),
        pos(0, player.height / 2),
        color(Color.fromHex(palette.blue.darkest)),
        anchor('center'),
        opacity(0.5),
        layer('bg'),
    ]);

    playerStateList.forEach(state => {
        player.onStateEnter(state, () => {
            player.play(state);
        });
    });

    // TWO SEPARATE VERBS : SPACE spits forward, C drops a mine behind.
    // Keeping them on their own key means every perk stays usable at once.

    // STATES THE DUCK CAN SPIT FROM (poop, lose and cutscene states are excluded)
    const SPIT_STATES = [
        'defaultIdle', 'defaultRun',
        'stressIdle', 'stressRun',
        'orangeIdle', 'orangeRun',
        'armorIdle', 'armorRun',
    ];

    // Only the default outfit has the kwak / spit animations : the others keep
    // their current animation and simply fire the projectile.
    const SPIT_ANIMATED_STATES = ['defaultIdle', 'defaultRun'];

    const POOP_STATES = ['orangeIdle', 'orangeRun', 'armorIdle', 'armorRun'];

    // SPIT : the fruit in the inventory is the ammo. What comes out depends on the
    // perks — Super Star turns the spat fruit into a fireball. No fruit → just kwak.
    // Bound to the player, not globally : a paused player stops firing them,
    // which is how the pause menu freezes the actions too (see ui/pauseMenu.js)
    player.onKeyPress('space', () => {
        if (!SPIT_STATES.includes(player.state)) return;

        const curState = player.state;
        const animated = SPIT_ANIMATED_STATES.includes(curState);
        const spatFruit = popLastFruit();
        const firesFireball = spatFruit && playerStats.superStar > 0;

        if (spatFruit) {
            if (animated) player.enterState('spit');
            wait(.25, () => {
                if (firesFireball) spitFireball();
                else spitFruit(spatFruit);
            });
        } else if (animated) {
            player.enterState('kwak');
        }

        // THE FIREBALL BRINGS ITS OWN SOUND (see entities/fireball.js)
        if (!firesFireball) kwak();

        if (animated) {
            wait(.7, () => {
                player.enterState(curState);
            });
        }
    });

    // MINE : the second verb, on its own key so it never competes with the spit
    player.onKeyPress('c', () => {
        if (!POOP_STATES.includes(player.state) || playerStats.mines <= 0) return;

        fart();

        if (player.state === 'orangeIdle' || player.state === 'orangeRun') {
            player.enterState('orangePoop');
        }
        else if (player.state === 'armorIdle' || player.state === 'armorRun') {
            player.enterState('armorPoop');
        }

        poop = add([
            pos(player.pos.x, player.pos.y + 20),
            anchor('center'),
            sprite('poop'),
            area({ scale: 1, isSensor: true }),
            scale(0.75),
            layer('game'),
            'poop',
        ])

        poop.play('idle');

        playerStats.mines--;
    });

    player.onKeyRelease('c', () => {
        if (player.state === 'orangePoop') {
            player.enterState('orangeIdle');
        } else if (player.state === 'armorPoop') {
            player.enterState('armorIdle');
        }
    });

    // SPIT — the fireball mirrors these numbers, see entities/fireball.js
    const SPIT_DISTANCE = 72;
    const SPIT_TRAVEL_DURATION = .4;
    const SPIT_FADE_DURATION = .3;
    const SPIT_START_OFFSET = 24;   // NUDGE THE START POINT SIDEWAYS, IN THE FACING DIRECTION

    // SUPER STAR : same gesture as the spit, but a fireball comes out instead
    function spitFireball() {
        const direction = player.flipX ? -1 : 1;   // flipX = facing left
        addFireball(player.pos.x + direction * SPIT_START_OFFSET, player.pos.y, direction);
    }

    function spitFruit(spriteName) {
        const direction = player.flipX ? -1 : 1;   // flipX = facing left
        const spitStartX = player.pos.x + direction * SPIT_START_OFFSET;
        const spitStartY = player.pos.y;

        const spat = add([
            sprite(spriteName),
            pos(),
            anchor('center'),
            scale(.70),
            opacity(1),
            layer('game'),
            z(10000),
        ]);

        tween(
            vec2(spitStartX, spitStartY),
            vec2(spitStartX + direction * SPIT_DISTANCE, spitStartY),
            SPIT_TRAVEL_DURATION,
            (val) => spat.pos = val,
            easings.easeOutQuad,
        );

        wait(.5, () => {
            tween(1, 0, SPIT_FADE_DURATION,
                (o) => spat.opacity = o,
                easings.easeInQuad,
            ).onEnd(() => destroy(spat));
        });

    }

    // FOOTSTEPS : ONE STEP EVERY N SECONDS WHILE RUNNING (N DEPENDS ON THE ACTIVE PERK)
    const FOOTSTEP_DELAY = {   // IN SECONDS
        defaultRun: 0.4,
        orangeRun: 0.4,
        armorRun: 0.60,      // ARMOR = HEAVIER, MORE SPACED-OUT STEPS
    };

    let footstepTimer = 0;
    player.onUpdate(() => {

        const delay = FOOTSTEP_DELAY[player.state];
        if (delay === undefined) {     // NOT RUNNING → NO FOOTSTEP SOUND
            footstepTimer = 0;
            return;
        }
        footstepTimer += dt();
        if (footstepTimer >= delay) {
            footstepTimer = 0;
            if (player.state === 'armorRun') armorWalks();
            else play('footstep-1', { volume: .6 });
        }
    });

    // MOVEMENT : 8 DIRECTIONS WITH NORMALIZED DIAGONALS (VIRTUAL BUTTONS DEFINED IN appInit.js)
    const moveDir = vec2(0);
    const DIAGONAL_FACTOR = 1 / Math.sqrt(2);   // KEEPS DIAGONAL SPEED EQUAL TO STRAIGHT-LINE SPEED

    // PERK-AWARE IDLE <-> RUN STATE TRANSITIONS
    const IDLE_TO_RUN = { defaultIdle: 'defaultRun', orangeIdle: 'orangeRun', armorIdle: 'armorRun' };
    const RUN_TO_IDLE = { defaultRun: 'defaultIdle', orangeRun: 'orangeIdle', armorRun: 'armorIdle' };

    player.onUpdate(() => {
        setCamPos(player.pos);

        // DON'T MOVE WHILE KWAKING OR POOPING
        if (player.state == 'kwak' || player.state == 'spit' || player.state == 'orangePoop' || player.state == 'armorPoop') return;

        // BOOLEANS COERCE TO 0/1 : EACH AXIS BECOMES -1, 0 OR 1
        moveDir.x = isButtonDown('right') - isButtonDown('left');
        moveDir.y = isButtonDown('down') - isButtonDown('up');

        const moving = moveDir.x !== 0 || moveDir.y !== 0;

        // FACE THE MOVEMENT DIRECTION
        if (moveDir.x < 0) player.flipX = true;
        else if (moveDir.x > 0) player.flipX = false;

        // SWITCH BETWEEN IDLE AND RUN FOR THE CURRENT PERK
        if (moving && IDLE_TO_RUN[player.state]) {
            player.enterState(IDLE_TO_RUN[player.state]);
        } else if (!moving && RUN_TO_IDLE[player.state]) {
            player.enterState(RUN_TO_IDLE[player.state]);
        }

        if (!moving) return;

        // NORMALIZE DIAGONALS SO ALL 8 DIRECTIONS SHARE THE SAME SPEED
        const factor = (moveDir.x && moveDir.y) ? DIAGONAL_FACTOR : 1;
        player.move(moveDir.scale(playerStats.speedKaplay * factor));
    });


    return player;
}

export { playerStats, player, poop, createPlayer };
