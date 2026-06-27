import { k } from '../appInit.js';
import { kwak, fart } from '../lib/audio.js';

const playerStats = { speed: 400, poopCount: 10 };

let player;
let poop;

function createPlayer() {

    // PLAYER SPRITES AND STATES
    const playerStateList = ['defaultIdle', 'defaultRun', 'kwak', 'stressIdle', 'stressRun', 'orangeIdle', 'orangeRun', 'orangePoop', 'armorIdle', 'armorRun', 'armorPoop', 'lose'];

    player = k.add([
        sprite('duck'),
        pos(center()),
        anchor('center'),
        area({ scale: .8 }),
        body(),
        z(10),
        state('defaultIdle', playerStateList),
        layer('game'),
        'duck',
    ]);

    playerStateList.forEach(state => {
        player.onStateEnter(state, () => {
            player.play(state);
        });
    });

    // KWAK AND POOP ACTIONS
    onKeyPress('space', () => {

        if (player.state === 'defaultIdle' || player.state === 'defaultRun') {
            const curState = player.state;
            player.enterState('kwak');
            kwak();
            wait(.35, () => {
                player.enterState(curState);
            });
        }

        if (['orangeIdle', 'orangeRun', 'armorIdle', 'armorRun'].includes(player.state) && playerStats.poopCount > 0) {

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

            playerStats.poopCount--;
        }
    });

    onKeyRelease('space', () => {
        if (player.state === 'orangePoop') {
            player.enterState('orangeIdle');
        } else if (player.state === 'armorPoop') {
            player.enterState('armorIdle');
        }
    });

    // FOOTSTEPS : ONE STEP EVERY N SECONDS WHILE RUNNING (N DEPENDS ON THE ACTIVE PERK)
    const FOOTSTEP_DELAY = {   // IN SECONDS
        defaultRun: 0.4,
        orangeRun:  0.4,
        armorRun:   0.60,      // ARMOR = HEAVIER, MORE SPACED-OUT STEPS
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
            play(player.state === 'armorRun' ? 'armor-footstep-1' : 'footstep-1', { volume: .6 });
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
        if (player.state == 'kwak' || player.state == 'orangePoop' || player.state == 'armorPoop') return;

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
        player.move(moveDir.scale(playerStats.speed * factor));
    });


    //player.enterState('armorIdle');
    return player;
}

// DUST PARTICLE TRAIL : EMITTED AT THE PLAYER'S FEET ONLY WHILE MOVING
function addDustTrail(player) {
    const particleAsset = getSprite('particle');
    const trail = k.add([
        pos(0, -16),    // X OFFSET IS APPLIED PER-DIRECTION VIA emitter.position BELOW
        z(5),   // BEHIND THE PLAYER (PLAYER z IS 10) SO DUST APPEARS UNDER ITS FEET
        layer('game'),
        particles({
            max: 40,
            speed: [30, 70],
            lifeTime: [0.3, 0.7],
            scales: [1, 0],            // SHRINK TO NOTHING OVER LIFETIME
            opacities: [0.7, 0.0],     // FADE OUT
            angle: [0, 360],
            texture: particleAsset.data.frames[0].tex,
            quads: [particleAsset.data.frames[0].q],
        }, {
            rate: 0,                   // NO AUTO-EMISSION : WE EMIT MANUALLY WHILE MOVING
            direction: -90,            // PUFF UPWARDS
            spread: 40,
        }),
    ]);

    // FRAMERATE-INDEPENDENT EMISSION WHILE MOVING
    const TRAIL_RATE = 24;             // PARTICLES PER SECOND
    let trailTimer = 0;
    player.onUpdate(() => {
        const moving = isButtonDown('right') - isButtonDown('left') !== 0
            || isButtonDown('down') - isButtonDown('up') !== 0;
        const canMove = !(player.state === 'kwak' || player.state === 'orangePoop' || player.state === 'armorPoop');

        if (!moving || !canMove) {
            trailTimer = 0;
            return;
        }

        // MOVE THE EMITTER (NOT THE OBJECT) TO THE PLAYER'S FEET : THE OBJECT STAYS
        // PUT SO ALREADY-SPAWNED PARTICLES KEEP THEIR WORLD POSITION AND TRAIL BEHIND.
        // DUST COMES OUT BEHIND THE DUCK : -44 WHEN FACING RIGHT, 52 WHEN FACING LEFT.
        const offsetX = player.flipX ? 52 : -44;
        trail.emitter.position = player.pos.add(offsetX, player.height / 2);

        trailTimer += dt();
        const interval = 1 / TRAIL_RATE;
        while (trailTimer >= interval) {
            trailTimer -= interval;
            trail.emit(1);
        }
    });

    return trail;
}

export { playerStats, player, poop, createPlayer, addDustTrail };
