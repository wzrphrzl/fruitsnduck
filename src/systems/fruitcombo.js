import { scoreStats } from '../appInit.js';
import { objects } from './objects.js';
import { bump } from '../lib/effects.js';
import { showScoreTile, showComboTile } from './ui.js';
import { classifyCombo, resolveCombo, playComboSound } from './loots.js';
import { initInventory, addFruit, isInventoryFull, getInventorySlots, clearInventory } from './inventory.js';


export function fruitCombo({ player, score, boxes, enemy, enemyStats }) {

    initInventory(boxes);
    scoreStats.comboCount = 0;   // RESETS COMBO COUNT AT THE BEGINNING OF THE GAME

    const COMBO_TYPES = ['commonFruit', 'superFruitT1'];

    player.onCollide('objectContainer', (objectContainer) => {

        const objectCollided = objects[objectContainer.sprite];

        updateCombo(objectContainer, objectCollided);
        triggerObjectEvent(objectContainer, objectCollided);
        updateScore(objectCollided);
        buffEnemy();

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
            showComboTile(category);
            playComboSound(category);

            if (category === 'perfectCombo') {
                objects[slots[0]].objectEvent();
            } else {
                // baseCombo / unPerfectCombo / nearPerfectCombo → loot from the category table
                resolveCombo(category, { player });
            }

            // EMPTY THE INVENTORY RIGHT AWAY SO THE NEXT FRUIT STARTS A FRESH TRIO
            clearInventory();
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

    function buffEnemy() {
        if (enemy.exists() === true) {
            enemyStats.size += 0.04;
            enemy.scale = vec2(enemyStats.size);
            enemyStats.speed += 4;
        }
    }
}
