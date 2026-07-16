import { scoreStats } from '../appInit.js';
import { objectList } from './objects.js';
import { addFlower } from './generators.js';
import { bump } from '../lib/effects.js';
import { showScoreTile, showComboTile } from './ui.js';
import { classifyCombo, resolveCombo, playComboSound } from './loots.js';
import { initInventory, addFruit, isInventoryFull, getInventorySlots, clearInventory } from './inventory.js';


export function fruitCombo({ player, score, boxes, enemy, enemyStats }) {

    initInventory(boxes);
    scoreStats.comboCount = 0;   // FRESH COUNT EACH GAME (scoreStats is module-level and survives scenes)

    const upgrades = ['heartIngame', 'superHeart', 'superTomatoArmor', 'superPiment', 'samaraSpeed', 'superStar'];
    const viruses = ['virus3Red', 'virus4Blue', 'virus5Brown'];

    // EACH OBJECT SPRITE IS BOTH REFRENCED BY ITS OWN NAME AND AS 'objectContainer' TAG
    player.onCollide('objectContainer', (objectContainer) => {

        const objectCollided = objectList[objectContainer.sprite];

        updateCombo(objectContainer, objectCollided);
        getDefinitiveBonus(objectContainer, objectCollided);
        maybeSpawnFlower(objectContainer);
        applyScore(objectCollided);
        buffEnemy();

        bump(player);
        destroy(objectContainer);

    });

    // FRUIT COMBO : fill 3 slots; a complete trio triggers its combo, then clears right away
    function updateCombo(objectContainer, objectCollided) {
        if (objectCollided.objectType !== 'commonFruit' && objectCollided.objectType !== 'superFruitT1') return;

        // ADD THE NEW FRUIT TO THE NEXT AVAILABLE SLOT (also redraws the boxes)
        addFruit(objectContainer.sprite);

        // TRIO COMPLETE → CLASSIFY, TRIGGER ITS OUTCOME, THEN CLEAR
        if (isInventoryFull()) {
            const slots = getInventorySlots();
            const category = classifyCombo(slots);
            debug.log('fruitCombo : ' + category);
            scoreStats.comboCount++;   // COUNTED FOR THE END SCREEN
            showComboTile(category);
            playComboSound(category);

            if (category === 'perfectCombo') {
                // 3 identical super fruits (T1) → that fruit's own event
                objectList[slots[0]].objectEvent();
            } else {
                // baseCombo / unPerfectCombo / nearPerfectCombo → loot from the category table
                resolveCombo(category, { player });
            }

            // EMPTY THE INVENTORY RIGHT AWAY SO THE NEXT FRUIT STARTS A FRESH TRIO
            clearInventory();
        }
    }

    // PLAYER UPGRADES
    function getDefinitiveBonus(objectContainer, objectCollided) {
        if (upgrades.includes(objectContainer.sprite)) {
            objectCollided.objectEvent();
        }
    }

    // ARMOR MODE : collecting a virus pops a flower where it was caught
    function maybeSpawnFlower(objectContainer) {
        if (player.state === 'armorRun' && viruses.includes(objectContainer.sprite)) {
            addFlower(objectContainer.pos.x, objectContainer.pos.y);
        }
    }

    function applyScore(objectCollided) {
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

        score.text = 'Score : ' + score.value;
        bump(score);
    }

    function buffEnemy() {
        if (enemy.exists() === true) {
            enemyStats.size += 0.04;
            enemy.scale = vec2(enemyStats.size);
            enemyStats.speed += 4;
        }
    }
}
