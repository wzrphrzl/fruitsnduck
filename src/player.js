import { k } from './appInit.js';

const playerSpeed = 400;
export let player;

export function createPlayer() {

    // DEFINE THE PLAYER VARIABLE AND THE PLAYER STATE LI

    const playerStateList = ['defaultIdle', 'defaultRun', 'orangeIdle', 'orangeRun', 'orangePoop', 'armorIdle', 'armorRun'];

    player = k.add([
        sprite('duck'),
        pos(center()),
        anchor('center'),
        area({ scale: .8 }),
        body(),
        state('defaultIdle', playerStateList),
        layer('game'),
        'duck',
    ]);

    playerStateList.forEach(state => {
        player.onStateEnter(state, () => {
            player.play(state);
        });
    });

    // PLAYER CONTROLS
    onKeyDown('left', () => {
        player.move(-playerSpeed, 0);
    });
    onKeyDown('right', () => {
        player.move(playerSpeed, 0);
    });
    onKeyDown('up', () => {
        player.move(0, -playerSpeed);
    });
    onKeyDown('down', () => {
        player.move(0, playerSpeed);
    });

    onKeyPress('left', () => {
        player.flipX = true;
    });
    onKeyPress('right', () => {
        player.flipX = false;
    });


    onKeyPress(['left', 'right', 'up', 'down'], () => {
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

        if (!isKeyDown("up") && !isKeyDown("right") && !isKeyDown("down") && !isKeyDown("left")) {
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
