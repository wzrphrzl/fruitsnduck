export function createVirus(player) {

    //BOSS
    const virusStats = {
        speed: 10,
        size: 1,
        previousPosX: width() + 212,
    };
   const SOUND_virus = null;

    const virus = add([
        sprite('virus1Pink'),
        pos(400, 400),
        anchor('center'),
        area({ scale: 0.75 }),
        body(),
        scale(virusStats.size),
        state('run'),
        layer('game'),
        z(10),
        'virus1Pink',
    ]);

    virus.onStateEnter('run', async () => {
        virus.play('run');
    });

    virus.onStateUpdate('run', async () => {


        virusStats.previousPosX = virus.pos.x;

        if (player.exists()) {
            const dir = player.pos.sub(virus.pos).unit();
            virus.move(dir.scale(virusStats.speed));
        }
        if (!player.exists()) return;
    });

    virus.onCollide('poop', (poop) => {
        destroy(poop);
        virus.color = RED;
        wait(.1, () => { virus.color = null; });

        virusStats.size -= 0.25;
        virus.scale = vec2(virusStats.size);
        virusStats.speed -= 20;
    });

    ['objectContainer', 'thistle', 'tree'].forEach((tag) => {
        virus.onCollide(tag, (gameObject) => {
            destroy(gameObject);
        });
    });

    return { virus, virusStats };
}
