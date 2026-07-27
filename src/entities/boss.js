export function createBoss(player) {

    //BOSS
    const bossStats = {
        speed: 10,
        size: 1,
        previousPosX: width() + 212,
    };
   const SOUND_boss = null/* = play('roomba')*/;

    const boss = add([
        sprite('boss'),
        pos(400, 400),
        anchor('center'),
        area({ scale: 0.75 }),
        body(),
        scale(bossStats.size),
        state('idle', ['idle', 'run']),
        layer('game'),
        z(10),
        'boss',
    ]);

    boss.onStateEnter('idle', async () => {
        boss.play('idle');
        await wait(20)
        boss.enterState('run');
    });

    boss.onStateEnter('run', async () => {
        boss.play('run');
        await wait(2);
        boss.enterState('idle');
    });

    boss.onStateUpdate('run', async () => {

        if (boss.pos.x > bossStats.previousPosX) {
            boss.flipX = true;
        }
        else if (boss.pos.x <= bossStats.previousPosX) {
            boss.flipX = false;
        }
        bossStats.previousPosX = boss.pos.x;

        if (player.exists()) {
            // const dir = player.pos.sub(boss.pos).unit();
            SOUND_boss;
            const dir = player.pos.sub(boss.pos).unit();
            boss.move(dir.scale(bossStats.speed));
        }
        if (!player.exists()) return;
    });

    boss.onCollide('poop', (poop) => {
        destroy(poop);
        boss.color = RED;
        wait(.1, () => { boss.color = null; });

        bossStats.size -= 0.25;
        boss.scale = vec2(bossStats.size);
        bossStats.speed -= 20;
    });

    ['objectContainer', 'thistle', 'tree'].forEach((tag) => {
        boss.onCollide(tag, (gameObject) => {
            destroy(gameObject);
        });
    });

    return { boss, bossStats };
}
