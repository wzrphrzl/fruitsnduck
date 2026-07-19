import { k } from '../appInit.js';

// COSMETIC VISUAL EFFECTS

// BUMP EFFECTS
export function bump(sprite) {
    tween(
        vec2(1.12),                      // FROM
        vec2(1),                        // TO
        0.185,                          // DURATION
        (s) => sprite.scale = s,        // SETTER
        easings.easeInCubic,
    );
}

export function bumpFruit(sprite) {
    tween(
        vec2(2),                       // FROM
        vec2(.65),                       // TO
        .5,                            // DURATION
        (s) => sprite.scale = s,        // SETTER
        easings.easeOutBack,            // SPRINGY EASING (SLIGHT OVERSHOOT)
    );
}

export function bumpHp(sprite) {
    // POP: START BIGGER, THEN SPRING BACK TO THE RESTING SCALE WITH EASING
    tween(
        vec2(1.5),                       // FROM
        vec2(.59),                      // TO (RESTING SCALE)
        1.5,                            // DURATION
        (s) => sprite.scale = s,        // SETTER
        easings.easeOutBack,            // SPRINGY EASING (SLIGHT OVERSHOOT)
    );
}

// DUST PARTICLE TRAIL (ON PLAYER, WHEN THE SAMARA SPEED IS PICKED)
export function addDustTrail(player) {
    const particleAsset = getSprite('particle');
    const trail = k.add([
        pos(0, -16),  
        z(5), 
        layer('game'),
        particles({
            max: 40,
            speed: [30, 70],
            lifeTime: [0.3, 0.7],
            scales: [1, 0],            // SHRINK TO NOTHING OVER LIFETIME
            opacities: [0.7, 0.0],     // FADE OUT
            angle: [0, 360],
            texture: particleAsset.data.frames[0].tex,
            quads: [particleAsset.data.frames[0].q],
        }, {
            rate: 0,                   // NO AUTO-EMISSION : WE EMIT MANUALLY WHILE MOVING
            direction: -90,            // PUFF UPWARDS
            spread: 40,
        }),
    ]);

    // FRAMERATE-INDEPENDENT EMISSION WHILE MOVING
    const TRAIL_RATE = 24;             // PARTICLES PER SECOND
    let trailTimer = 0;
    player.onUpdate(() => {
        const moving = isButtonDown('right') - isButtonDown('left') !== 0
            || isButtonDown('down') - isButtonDown('up') !== 0;
        const canMove = !(player.state === 'kwak' || player.state === 'orangePoop' || player.state === 'armorPoop');

        if (!moving || !canMove) {
            trailTimer = 0;
            return;
        }

        // MOVE THE EMITTER (NOT THE OBJECT) TO THE PLAYER'S FEET : THE OBJECT STAYS
        // PUT SO ALREADY-SPAWNED PARTICLES KEEP THEIR WORLD POSITION AND TRAIL BEHIND.
        // DUST COMES OUT BEHIND THE DUCK : -44 WHEN FACING RIGHT, 52 WHEN FACING LEFT.
        const offsetX = player.flipX ? 52 : -44;
        trail.emitter.position = player.pos.add(offsetX, player.height / 2);

        trailTimer += dt();
        const interval = 1 / TRAIL_RATE;
        while (trailTimer >= interval) {
            trailTimer -= interval;
            trail.emit(1);
        }
    });

    return trail;
}

// TEXT EFFECTS 

export const wavy = (idx) => ({
    pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
});

export const rainbow = (idx) => ({
    color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
});

export function combineEffects(...effects) {
    return (idx, ch, param) => Object.assign({}, ...effects.map(fn => fn(idx, ch, param)));
}
