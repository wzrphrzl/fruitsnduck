import { k, SPEED } from './appInit.js';

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
