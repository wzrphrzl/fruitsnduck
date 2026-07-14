import { scoreStats } from '../appInit.js';
import { objectList } from './objects.js';
import { addFlower } from './generators.js';
import { bump } from '../lib/effects.js';
import { showScoreTile, renderFruitBoxes, showComboTile } from './ui.js';
import { classifyCombo, resolveCombo, playComboSound } from './loots.js';


export function fruitCombo({ player, score, boxes, enemy, enemyStats }) {
 
    let comboSlots   = [null, null, null];   // sprite names currently held in the combo
    let comboSprites = [null, null, null];   // the sprite objects drawn in the boxes

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

    // FRUIT COMBO : fill 3 slots; a complete trio triggers its combo, then auto-clears after 2s
    function updateCombo(objectContainer, objectCollided) {
        if (objectCollided.objectType !== 'commonFruit' && objectCollided.objectType !== 'superFruitT1') return;

        // INVENTORY LOCKED WHILE FULL (until it auto-clears) — IGNORE NEW FRUITS
        if (comboSlots.every(f => f !== null)) return;

        // ADD THE NEW FRUIT TO THE NEXT AVAILABLE SLOT
        const nextAvailableIndex = comboSlots.findIndex(f => f === null);
        comboSlots[nextAvailableIndex] = objectContainer.sprite;

        // REDRAW THE BOXES (pop the fruit that was just collected)
        comboSprites = renderFruitBoxes(boxes, comboSlots, comboSprites, nextAvailableIndex);

        // TRIO COMPLETE → CLASSIFY, TRIGGER ITS OUTCOME, THEN AUTO-CLEAR AFTER 2s
        if (comboSlots.every(f => f !== null)) {
            const category = classifyCombo(comboSlots);
            debug.log('fruitCombo : ' + category);
            showComboTile(category);
            playComboSound(category);

            if (category === 'perfectCombo') {
                // 3 identical super fruits (T1) → that fruit's own event
                objectList[comboSlots[0]].objectEvent();
            } else {
                // baseCombo / unPerfectCombo / nearPerfectCombo → loot from the category table
                resolveCombo(category, { player });
            }

            // EMPTY THE INVENTORY (STATE + UI) AFTER 2s
            wait(2, () => {
                comboSprites = renderFruitBoxes(boxes, [null, null, null], comboSprites, -1);
                comboSlots = [null, null, null];
            });
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
            scoreStats.virusCount++;
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
