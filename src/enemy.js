import { gameState } from './appInit.js';

export function createEnemy(player, score) {
    //ENEMY
    const enemyStats = {
        speed: 20,
        size: 1
    };
    const SOUND_enemy = play('roomba');

    const enemy = add([
        sprite('enemy'),
        pos(width(), height()),
        anchor('center'),
        area({ scale: 0.75 }),
        body(),
        scale(enemyStats.size),
        state('idle', ['idle', 'run']),
        'enemy',
    ]);

    enemy.onStateEnter('idle', async () => {
        enemy.play('idle');
        await wait(3)
        console.log('ça attend');
        enemy.enterState('run');
    });

    enemy.onStateEnter('run', async () => {
        enemy.play('run');
        await wait(2);
        enemy.enterState('idle');
        console.log('ça court');
    });

    enemy.onStateUpdate('run', async () => {
        if (player.exists()) {
            // const dir = player.pos.sub(enemy.pos).unit();
            SOUND_enemy;
            const dir = player.pos.sub(enemy.pos).unit();
            enemy.move(dir.scale(enemyStats.speed));

            console.log('enemy is moving');

        }  
        if (!player.exists()) return;
    });

    enemy.onCollide('duck', () => {
        destroy(player);
        SOUND_enemy.paused = !SOUND_enemy.paused;
        play('lose');

        gameState.scoreEnregistré = score.value;
        go('lose');
        //go('lose');
    });

    enemy.onCollide('objet', (objet) => {
        //if (objet.sprite == 'virusBlue' || objet.sprite == 'virusBrown') {
        destroy(objet);
        //}
    });

    return { enemy, enemyStats };
}
