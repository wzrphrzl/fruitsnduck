import { k } from './appInit.js';

export const playerStats = {
    speed: 400,
    poopCount: 0
};

export let player;

export function createPlayer() {

    // DEFINE THE PLAYER SPRITES AND STATES
    const playerStateList = ['defaultIdle', 'defaultRun', 'kwak', 'stressIdle', 'stressRun', 'orangeIdle', 'orangeRun', 'orangePoop', 'armorIdle', 'armorRun', 'armorPoop'];

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

    // ORANGE STATE - POOPING MECHANIC
    onKeyPress('space', () => {
        if (player.state === 'orangeIdle' && playerStats.poopCount > 0) {
            debug.log('Poop Count' + playerStats.poopCount);
            player.enterState('orangePoop');

            const poop = add([
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
        }
    });

    // PLAYER CONTROLS
    onKeyDown(['left', 'q'], () => {
        player.move(-playerStats.speed, 0);
    });
    onKeyDown(['right', 'd'], () => {
        player.move(playerStats.speed, 0);
    });
    onKeyDown(['up', 'z'], () => {
        player.move(0, -playerStats.speed);
    });
    onKeyDown(['down', 's'], () => {
        player.move(0, playerStats.speed);
    });

    onKeyPress(['left', 'q'], () => {
        player.flipX = true;
    });
    onKeyPress(['right', 'd'], () => {
        player.flipX = false;
    });

    onKeyPress(['left', 'right', 'up', 'down', 'z', 'q', 's', 'd'], () => {
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

    player.onUpdate(() => {
        setCamPos(player.pos);

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

    return player;
}
