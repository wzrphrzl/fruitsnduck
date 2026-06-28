export function createEnemy(player) {

    //ENEMY
    const enemyStats = {
        speed: 20,
        size: 1,
        previousPosX: width() + 212,
    };
   const SOUND_enemy = null/* = play('roomba')*/;

    const enemy = add([
        sprite('enemy'),
        pos(400, 400),
        anchor('center'),
        area({ scale: 0.75 }),
        body(),
        scale(enemyStats.size),
        state('idle', ['idle', 'run']),
        layer('game'),
        z(10),
        'enemy',
    ]);

    enemy.onStateEnter('idle', async () => {
        enemy.play('idle');
        await wait(9999)
        enemy.enterState('run');
    });

    enemy.onStateEnter('run', async () => {
        enemy.play('run');
        await wait(2);
        enemy.enterState('idle');
    });


    enemy.onStateUpdate('run', async () => {
        
        if (enemy.pos.x > enemyStats.previousPosX) {
            enemy.flipX = true;
        }   
        else if (enemy.pos.x <= enemyStats.previousPosX) {
            enemy.flipX = false;
        }
        enemyStats.previousPosX = enemy.pos.x;

        if (player.exists()) {
            // const dir = player.pos.sub(enemy.pos).unit();
            SOUND_enemy;
            const dir = player.pos.sub(enemy.pos).unit();
            enemy.move(dir.scale(enemyStats.speed));
        }
        if (!player.exists()) return;
    });

    enemy.onCollide('poop', (poop) => {
        destroy(poop);
        enemy.color = RED;
        wait(.1, () => { enemy.color = null; });

        enemyStats.size -= 0.25;
        enemy.scale = vec2(enemyStats.size);
        enemyStats.speed -= 15;
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
