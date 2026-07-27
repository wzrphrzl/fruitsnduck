import { scoreStats } from '../appInit.js';
import { objects } from './objects.js';
import { bump } from '../lib/effects.js';
import { addExplosion } from './generators.js';
import { showScoreTile, showComboTile } from './ui.js';
import { classifyCombo, resolveCombo, playComboSound, comboExplosion, comboLabel } from './loots.js';
import { initInventory, addFruit, isInventoryFull, getInventorySlots, completeCombo } from './inventory.js';


export function fruitCombo({ player, score, boxes, boss, bossStats }) {

    initInventory(boxes);
    scoreStats.comboCount = 0;   // RESETS COMBO COUNT AT THE BEGINNING OF THE GAME

    const COMBO_TYPES = ['commonFruit', 'superFruitT1'];

    player.onCollide('objectContainer', (objectContainer) => {

        const objectCollided = objects[objectContainer.sprite];

        updateCombo(objectContainer, objectCollided);
        triggerObjectEvent(objectContainer, objectCollided);
        updateScore(objectCollided);
        buffBoss();

        bump(player);
        destroy(objectContainer);

    });

    // FRUIT COMBO : fill 3 slots; a complete trio triggers its combo, then clears right away
    function updateCombo(objectContainer, objectCollided) {
        if (!COMBO_TYPES.includes(objectCollided.objectType)) return;

        // ADD THE NEW FRUIT TO THE NEXT AVAILABLE SLOT (also redraws the boxes)
        addFruit(objectContainer.sprite);

        if (isInventoryFull()) {
            const slots = getInventorySlots();
            const category = classifyCombo(slots);
            scoreStats.comboCount++; 
            showComboTile(comboLabel(category));
            playComboSound(category);

            if (category === 'perfectCombo') {
                objects[slots[0]].objectEvent();
            } else {
                // baseCombo / unPerfectCombo / nearPerfectCombo → loot from the category table
                resolveCombo(category, { player });
            }

            // STATE RESETS NOW (next trio can start) — the boxes keep showing this one briefly,
            // then each box pops an explosion as the trio is wiped
            completeCombo(1, () => {
                const explosionSprite = comboExplosion(category);
                boxes.forEach((box) => addExplosion(box.width / 2, box.height / 2, box, explosionSprite));
            });
        }
    }

    // Any non-combo object with an objectEvent fires it on pickup
    // (upgrades, acorn, virus...). Combo fruits are excluded — their objectEvent,
    // when they have one, only fires on a completed perfectCombo (see updateCombo).
    function triggerObjectEvent(objectContainer, objectCollided) {
        if (COMBO_TYPES.includes(objectCollided.objectType)) return;
        if (objectCollided.objectEvent) objectCollided.objectEvent(objectContainer);
    }

    function updateScore(objectCollided) {
        const scoreChange = objectCollided.scoreValue;

        if (scoreChange > 0) {
            score.value += scoreChange;
            showScoreTile(scoreChange);
            play('fruit-collected', { volume: 0.1, loop: false, paused: false });
        } else if (scoreChange < 0) {
            score.value += scoreChange;
            showScoreTile(scoreChange);
            play('debuff');
        }

        score.text = '' + score.value;   // label 'Score :' is a separate static element
        bump(score)
    }

    function buffBoss() {
        if (boss.exists() === true) {
            bossStats.size += 0.04;
            boss.scale = vec2(bossStats.size);
            bossStats.speed += 4;
        }
    }
}
