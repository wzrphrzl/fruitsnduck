import { k, SPEED } from './appInit.js';

export function createPlayer() {
    // PLAYER
    const player = k.add([
        sprite('duck'),
        pos(center()),
        scale(2),
        anchor('center'),
        area({ scale: 1 }),
        body(),
        shader('invert', () => ({
            u_time: time(),
        })),
        state('move', ['idle', 'run']),
        'duck',
    ]);

    player.onUpdate(() => {
        setCamPos(player.pos);
        setCamScale(1);
    });

    // CONTROLS
    onKeyDown('left', () => {
        player.move(-SPEED, 0);
    });
    onKeyDown('right', () => {
        player.move(SPEED, 0);
    });
    onKeyDown('up', () => {
        player.move(0, -SPEED);
    });
    onKeyDown('down', () => {
        player.move(0, SPEED);
    });

    onKeyPress('left', () => {
        player.flipX = true;
    });
    onKeyPress('right', () => {
        player.flipX = false;
    });

    onKeyPress(['left', 'right', 'up', 'down'], () => {
        player.play('run');
    });
    onKeyRelease(['left', 'right', 'up', 'down'], () => {
        player.play('idle');
    });

    return player;
}
