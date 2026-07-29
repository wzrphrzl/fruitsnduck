import { palette } from '../lib/colorpalette.js';

// SHARED BY EVERY VIRUS : they all ramp up together (see buffEnemies in fruitcombo.js), and a
// virus spawned later joins at the current speed. Module-level, so a new game must reset it.
const VIRUS_BASE_SPEED = 80;

export const virusStats = {
    speed: VIRUS_BASE_SPEED,
    size: 1,
};

export function resetVirusStats() {
    virusStats.speed = VIRUS_BASE_SPEED;
}

export function createVirus(player, posX, posY) {

    // RANDOM SKIN : purely cosmetic, every variant behaves the same
    const VIRUS_SPRITES = ['virus1Pink', 'virus2Yellow', 'virus3Red', 'virus4Blue'];
    const virusSprite = choose(VIRUS_SPRITES);

   const SOUND_virus = null;

    const virus = add([
        sprite(virusSprite),
        pos(posX, posY),
        anchor('center'),
        area({ scale: 0.75 }),
        body(),
        scale(virusStats.size),
        state('run'),
        layer('game'),
        z(10),
        health(2),
        'virus',
    ]);

    virus.add([
        ellipse(virus.width /2 *.85, 8),
        pos(0, virus.height / 2 ),
        color(Color.fromHex(palette.blue.darkest)),
        anchor('center'),
        opacity(0.4),
        layer('bg'),
    ]);

    virus.onStateEnter('run', async () => {
        virus.play('run');
    });

    virus.onStateUpdate('run', async () => {

        if (player.exists()) {
            const dir = player.pos.sub(virus.pos).unit();
            virus.move(dir.scale(virusStats.speed));
        }
        if (!player.exists()) return;
    });

    virus.onHurt(() => {
        virus.color = RED;
        wait(.1, () => { virus.color = null; });
    });

    virus.onDeath(() => {
        destroy(virus);   // l'ombre enfant part avec le parent
    });

    virus.onCollide('poop', (poop) => {
        destroy(poop);
        virus.hp -= 1;
    });

    ['objectContainer', 'thistle', 'tree'].forEach((tag) => {
        virus.onCollide(tag, (gameObject) => {
            destroy(gameObject);
        });
    });

    return { virus, virusStats };
}
