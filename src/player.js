import { k } from './appInit.js';

const playerSpeed = 400;

export function createPlayer() {

    // PLAYER
    const player = k.add([
        sprite('duck'),
        pos(center()),
        anchor('center'),
        area({ scale: .8 }),
        body(),
        state('defaultIdle', ['defaultIdle', 'defaultRun', 'stress', 'orangeIdle', 'orangeRun', 'orangePoop', 'armorIdle', 'armorRun']),
        layer('game'),
        'duck',
    ]);

    player.onStateEnter('defaultIdle', () => {
        player.play('defaultIdle');
    });
    player.onStateEnter('defaultRun', () => {
        player.play('defaultRun');
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
        player.enterState('defaultRun');
    });

    player.onUpdate(() => {
        setCamPos(player.pos);

        if (!isKeyDown("up") && !isKeyDown("right") && !isKeyDown("down") && !isKeyDown("left")) {
            player.enterState('defaultIdle');
        }
    });

    return player;
}
