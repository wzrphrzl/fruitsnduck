import { scoreStats } from '../appInit.js';
import { gameObjectList } from './objects.js';
import { addFlower } from './generators.js';
import { bump, bumpMini } from '../lib/effects.js';
import { healthPointsUI } from '../systems/ui.js';

/*
 * OBJECT PICKUP SYSTEM : registers the player's 'gameObject' collision handler
 * and owns the inventory/combo state (kept private in this closure so the
 * reassignments below stay encapsulated).
 *
 * @param {object}   deps
 * @param {GameObj}  deps.player
 * @param {GameObj}  deps.score       UI score text object
 * @param {GameObj[]} deps.boxes      the 3 inventory box containers [box1, box2, box3]
 * @param {GameObj}  deps.enemy
 * @param {object}   deps.enemyStats
 */
export function setupInventory({ player, score, boxes, enemy, enemyStats }) {
    let inventoryBoxArray = [null, null, null];
    let objectsInBoxesArray = [null, null, null];

    // EACH OBJECT SPRITE IS BOTH REFRENCED BY ITS OWN NAME AND AS 'gameObject' TAG
    player.onCollide('gameObject', (gameObject) => {

        if (gameObject.sprite === 'heartIngame') {
            player.maxHP += 1;
            healthPointsUI(player.maxHP - 1);   // POP THE NEWLY ADDED HEART
            debug.log('Log player.maxHP : ' + player.maxHP);
            debug.log('Log player.hp : ' + player.hp);
        }

        if (gameObject.sprite === 'virusPurple') {
            player.hp -= 1;
            debug.log('max hp : ' + player.maxHP)
        }


        // DEFAULT OBJECT EFFECTS AND COMBO SYSTEM
        if (gameObjectList[gameObject.sprite].objectType === 'defaultObject') {

            // IF INVENTORY IS ALREADY FULL (from the previous trio), CLEAR IT BEFORE ADDING THE NEW FRUIT
            if (inventoryBoxArray.every(f => f !== null)) {
                const lastFruit = inventoryBoxArray[2];
                // If the new fruit matches the last collected fruit (box 3),
                // carry it over to box 1 so boxes 1 & 2 are pre-filled (instead of a full reset)
                if (gameObject.sprite === lastFruit) {
                    inventoryBoxArray = [lastFruit, null, null];
                } else {
                    inventoryBoxArray = [null, null, null];
                }
            }

            // ADD THE NEW FRUIT TO THE NEXT AVAILABLE SLOT
            const nextAvailableIndex = inventoryBoxArray.findIndex(f => f === null);
            if (nextAvailableIndex !== -1) {
                inventoryBoxArray[nextAvailableIndex] = gameObject.sprite;
            }

            // DELETE OLD FRUITS FROM THE INVENTORY BOXES
            objectsInBoxesArray.forEach(sprite => {
                if (sprite) destroy(sprite);
            });

            // REFRESH THE FRUITS IN THE INVENTORY BOXES
            objectsInBoxesArray = inventoryBoxArray.map((spriteName, index) => {
                if (spriteName) {
                    const newSprite = boxes[index].add([
                        sprite(spriteName),
                        anchor("center"),
                        pos(48, 48),
                        scale(.5),
                        layer('ui'),
                    ]);

                    // Apply bump animation to the fruit that was just collected
                    if (index === nextAvailableIndex) {
                        bumpMini(newSprite);
                    }

                    return newSprite;
                }
                return null;
            });

            // COMBO CHECK: as soon as the 3rd fruit completes the trio with identical fruits,
            // trigger that fruit's combo event (spawns a special object)
            if (inventoryBoxArray.every(f => f !== null && f === inventoryBoxArray[0])) {
                console.log('fruit combo !');
                gameObjectList[inventoryBoxArray[0]].comboEvent();
            }
        }

        // RARE OBJECT EFFECTS
        if (gameObject.sprite === 'tomatoArmor') {
            gameObjectList.tomatoArmor.comboEvent();
        } else if (gameObject.sprite === 'superPiment') {
            gameObjectList.superPiment.comboEvent();
        } else if (gameObject.sprite === 'samaraSpeed') {
            gameObjectList.samaraSpeed.comboEvent();
        }

        // FLOWER EFFECTS WHEN IN ARMOR MODE
        if (player.state === 'armorRun' && gameObject.sprite === 'virusPurple'
            || player.state === 'armorRun' && gameObject.sprite === 'virusBlue'
            || player.state === 'armorRun' && gameObject.sprite === 'virusBrown'
        ) {
            addFlower(gameObject.pos.x, gameObject.pos.y);
        }

        // SCORE LOGIC
        const scoreChange = gameObjectList[gameObject.sprite].scoreValue;

        if (scoreChange > 0) {
            score.value += scoreChange;
            play('fruit-collected', { volume: 0.1, loop:  false, paused: false });
        } else if (scoreChange < 0) {
            score.value += scoreChange;
            scoreStats.virusCount++;
            play('debuff');
        }

        score.text = 'Score : ' + score.value;
        bump(score);

        // ENEMY BUFF ON COLLECTING OBJECTS
        if (enemy.exists() === true) {
            enemyStats.size += 0.05;
            enemy.scale = vec2(enemyStats.size);
            enemyStats.speed += 10;
        }

        bump(player);
        destroy(gameObject);

    });
}
