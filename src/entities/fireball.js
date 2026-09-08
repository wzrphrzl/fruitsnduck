// FIREBALL : the projectile the duck spits once the Super Star is collected.
// It carries its own collisions, so nothing else in the game needs to know it exists.
// MOTION : same numbers as the fruit spit (see the SPIT_* constants in player.js),
// so both projectiles read as the very same gesture.
const FIREBALL = {
    distance: 72,          // pixels travelled, in the facing direction
    travelDuration: .4,
    holdBeforeFade: .5,    // starts alongside the travel, not after it
    fadeDuration: .3,
    scale: .9,
    areaScale: .9,
    damage: 1,
    volume: .8,
};

// SPAWNS A FIREBALL AT (x, y) FLYING SIDEWAYS : direction = 1 (right) / -1 (left)
export function addFireball(x, y, direction) {

    const start = vec2(x, y);

    play('fireball', { volume: FIREBALL.volume });

    const fireball = add([
        sprite('fireball'),
        pos(start),
        anchor('center'),
        area({ scale: FIREBALL.areaScale, isSensor: true }),
        scale(FIREBALL.scale),
        opacity(1),
        layer('game'),
        z(10000),
        'fireball',
    ]);

    fireball.flipX = direction < 0;

    // NOTE : no area.offset correction here. addObject / addPlant need one because
    // they swap in a getSpriteOutline() polygon (local sprite coordinates) ; the
    // default rect hitbox is already centered on anchor('center').

    // A spent fireball keeps fading for a moment : this flag stops it from
    // hurting a second target on the way out
    let spent = false;

    const travel = tween(
        start,
        start.add(direction * FIREBALL.distance, 0),
        FIREBALL.travelDuration,
        (val) => { if (fireball.exists()) fireball.pos = val; },
        easings.easeOutQuad,
    );

    wait(FIREBALL.holdBeforeFade, () => burnOut());

    // ENEMIES : one damage point, then the fireball is spent.
    // Lowering hp is what triggers onHurt / onDeath — this Kaplay version has no hurt()
    ['virus', 'boss'].forEach((tag) => {
        fireball.onCollide(tag, (enemy) => {
            if (spent) return;
            enemy.hp -= FIREBALL.damage;
            burnOut();
        });
    });

    // THISTLE : no health points, it simply burns down
    fireball.onCollide('thistle', (thistle) => {
        if (spent) return;
        destroy(thistle);
        burnOut();
    });

    function burnOut() {
        if (spent || !fireball.exists()) return;
        spent = true;
        travel.cancel();
        tween(fireball.opacity, 0, FIREBALL.fadeDuration,
            (o) => { if (fireball.exists()) fireball.opacity = o; },
            easings.easeInQuad,
        ).onEnd(() => { if (fireball.exists()) destroy(fireball); });
    }

    return fireball;
}
