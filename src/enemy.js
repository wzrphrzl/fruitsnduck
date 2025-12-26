import { scoreStats } from './appInit.js';

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
        layer('game'),
        'enemy',
    ]);

    enemy.onStateEnter('idle', async () => {
        enemy.play('idle');
        await wait(3)
        enemy.enterState('run');
    });

    enemy.onStateEnter('run', async () => {
        enemy.play('run');
        await wait(2);
        enemy.enterState('idle');
    });

    enemy.onStateUpdate('run', async () => {
        if (player.exists()) {
            // const dir = player.pos.sub(enemy.pos).unit();
            SOUND_enemy;
            const dir = player.pos.sub(enemy.pos).unit();
            enemy.move(dir.scale(enemyStats.speed));
        }
        if (!player.exists()) return;
    });

    enemy.onCollide('duck', () => {
        destroy(player);
        SOUND_enemy.paused = !SOUND_enemy.paused;
        play('lose');

        scoreStats.savedScore = score.value;
        go('lose');
        //go('lose');
    });

    enemy.onCollide('poop', () => {
        debug.log('ENEMY HIT BY POOP !');
        enemyStats.size -= 0.2;
        enemy.scale = vec2(enemyStats.size);
        enemyStats.speed -= 10;
    });

    enemy.onCollide('gameObject', (gameObject) => {
        //if (objet.sprite == 'virusBlue' || objet.sprite == 'virusBrown') {
        destroy(gameObject);
        //}
    });

    enemy.onCollide('tree', (gameObject) => {
        destroy(gameObject);
    });




    return { enemy, enemyStats };
}
