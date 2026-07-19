import { bumpFruit } from '../../lib/effects.js';

// FRUIT BOXES : (re)draw the fruits currently held in the 3 inventory boxes.
export function renderFruitBoxes(boxes, fruitSlots, previousSprites, bumpIndex) {

    // REMOVE THE PREVIOUSLY DRAWN FRUITS
    previousSprites.forEach((s) => { if (s) destroy(s); });

    // DRAW THE CURRENT SLOTS, EACH CENTERED IN ITS BOX
    return fruitSlots.map((spriteName, index) => {
        if (!spriteName) return null;

        const box = boxes[index];
        const fruit = box.add([
            sprite(spriteName),
            anchor('center'),
            pos(box.width / 2, box.height / 2),
            scale(.65),
            layer('ui'),
        ]);

        // POP THE FRUIT THAT WAS JUST COLLECTED
        if (index === bumpIndex) bumpFruit(fruit);

        return fruit;
    });
}
