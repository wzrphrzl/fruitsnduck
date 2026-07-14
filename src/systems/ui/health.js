import { bumpHp } from '../../lib/effects.js';
import { player } from '../../entities/player.js';

// HEALTH POINTS : one heart per max HP, filled up to the current HP
export function healthPointsUI(bumpIndex) {

    // CLEAR EXISTING HEARTS
    destroyAll('hp');

    function addHeart(index) {

        get('hp').forEach((heart) => {
            heart.pos.x += -56;
        });

        // FULL IF WITHIN CURRENT HP, ELSE EMPTY (anim set at creation: no override = no timing race)
        const heart = add([
            sprite('heartUI', { anim: index < player.hp ? 'heartFull' : 'heartEmpty' }),
            scale(0.59),
            pos(1386, 48),
            opacity(1),
            anchor('center'),
            fixed(), layer('ui'),
            'hp',
        ]);

        // POP ONLY THE HEART THAT CHANGED
        if (index === bumpIndex) {
            bumpHp(heart);
        }
    }

    // ADDS ONE HEART PER MAX HP POINT
    for (let i = 0; i < player.maxHP; i++) {
        addHeart(i);
    }
}
