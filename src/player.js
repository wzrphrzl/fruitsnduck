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
        state('idle', ['idle', 'run']),
        layer('game'),
        'duck',
    ]);

    player.onStateEnter('idle', () => {
        player.play('idle');
    });
    player.onStateEnter('run', () => {
        player.play('run');
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
        player.enterState('run');
    });

    player.onUpdate(() => {
        setCamPos(player.pos);

        if (!isKeyDown("up") && !isKeyDown("right") && !isKeyDown("down") && !isKeyDown("left")) {
            player.enterState('idle');
        }
    });

    return player;
}
