import { k } from './appInit.js';
import { kwak, fart } from './generators.js';

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
                area({ scale: 1 }),
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

    onKeyDown(['left', 'q'], () => {
        if (isKeyDown('right') || isKeyDown('d')) {
            return;
        } else {
            player.flipX = true;
        }
    });
    onKeyDown(['right', 'd'], () => {
        if (isKeyDown('left') || isKeyDown('q')) {
            return;
        } else {
            player.flipX = false;
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

    // STATE CHANGES BASED ON PERKS
    onKeyDown(['left', 'right', 'up', 'down', 'z', 'q', 's', 'd'], () => {
        if (player.state == 'defaultIdle') {
            player.enterState('defaultRun');
        }
        else if (player.state == 'orangeIdle') {
            player.enterState('orangeRun');
        }
        else if (player.state == 'armorIdle') {
            player.enterState('armorRun');
        }
    });

    onKeyDown(['left', 'q'], () => {
        if (player.state == 'kwak' || player.state == 'orangePoop' || player.state == 'armorPoop' ) return;
        player.move(-playerStats.speed, 0);
    });
    onKeyDown(['right', 'd'], () => {
        if (player.state == 'kwak' || player.state == 'orangePoop' || player.state == 'armorPoop') return;
        player.move(playerStats.speed, 0);
    });
    onKeyDown(['up', 'z'], () => {
        if (player.state == 'kwak' || player.state == 'orangePoop' || player.state == 'armorPoop') return;
        player.move(0, -playerStats.speed);
    });
    onKeyDown(['down', 's'], () => {
        if (player.state == 'kwak' || player.state == 'orangePoop' || player.state == 'armorPoop') return;
        player.move(0, playerStats.speed);
    });

    player.onUpdate(() => {
        setCamPos(player.pos);

        // IF ALL KEYS ARE UP, ENTERSTATE STATE IDLE
        if (!isKeyDown("up") && !isKeyDown("right") && !isKeyDown("down") && !isKeyDown("left") && !isKeyDown("z") && !isKeyDown("q") && !isKeyDown("s") && !isKeyDown("d")) {

            if (player.state == 'defaultRun') {
                player.enterState('defaultIdle');
            }
            else if (player.state == 'orangeRun') {
                player.enterState('orangeIdle');
            }
            else if (player.state == 'armorRun') {
                player.enterState('armorIdle');
            }
        }

    });

    //player.enterState('armorIdle');
    return player;
}

export { playerStats, player, poop, createPlayer };
