import { k, fontStyleBold } from '../appInit.js';
import { palette } from './colorpalette.js';

// GENERIC HELPERS

// MAP BOUNDARIES FOR CLAMPING
const SPRITE_MARGIN = 80;
const SPAWN_MIN_X = -1840 + SPRITE_MARGIN;   
const SPAWN_MAX_X = 3280 - SPRITE_MARGIN;  
const SPAWN_MIN_Y = -1648 + SPRITE_MARGIN;  
const SPAWN_MAX_Y = 2448 - SPRITE_MARGIN;     

export function setXm(player) {
    return rand(
        player.pos.x - width() / 2 - SPRITE_MARGIN,
        player.pos.x + width() / 2 + SPRITE_MARGIN,
    );
}

// EITHER EXTREME, NEVER IN BETWEEN : lands just above or just below the viewport
export function setYm(player) {
    if (Math.random() < 0.5) {
        return player.pos.y - height() / 2 - SPRITE_MARGIN;
    } else {
        return player.pos.y + height() / 2 + SPRITE_MARGIN;
    }
}

function setXs(player) {
    if (Math.random() < 0.5) {
        return clamp(rand(player.pos.x - 640, player.pos.x - 64), SPAWN_MIN_X, SPAWN_MAX_X);
    } else {
        return clamp(rand(player.pos.x + 64, player.pos.x + 640), SPAWN_MIN_X, SPAWN_MAX_X);
    }
}

function setYs(player) {
    if (Math.random() < 0.5) {
        return clamp(rand(player.pos.y - 320, player.pos.y - 40), SPAWN_MIN_Y, SPAWN_MAX_Y);
    } else {
        return clamp(rand(player.pos.y + 40, player.pos.y + 320), SPAWN_MIN_Y, SPAWN_MAX_Y);
    }
}

// ENEMIES ARE IN THE LIST TOO : nothing should grow on top of the boss or a virus
const SPAWN_TAGS = ['objectContainer', 'tree', 'thistle', 'acorn', 'dandelionChrono', 'boss', 'virus'];

// PICK A RANDOM POSITION NEAR THE PLAYER THAT IS AT LEAST minDist AWAY FROM
// EVERY SPAWNED OBJECT (rejection sampling : retry up to maxTries, then give up
// and accept the last candidate — never worse than the old fully-random spawn).
export function setPos(player, minDist = 48, maxTries = 20) {
    let candidate;
    for (let i = 0; i < maxTries; i++) {
        candidate = vec2(setXs(player), setYs(player));
        const blocked = SPAWN_TAGS.some((tag) =>
            get(tag).some((obj) => obj.pos.dist(candidate) < minDist),
        );
        if (!blocked) return candidate;
    }
    return candidate;   // CROWDED AREA : overlap allowed as a fallback
}

// RECTANGLE CREATION (FOR MAPPING)
export function addRect(width, height, radiusVal, posX, posY, colorName, layerName, options = {}, rectName = 'rect') {
    const rectangle = [
        rect(width, height, { radius: radiusVal }),
        pos(posX, posY),
        anchor('topleft'),
        color(colorName),
        body({ isStatic: true }),
        layer(layerName),
        rectName,
    ];

    if (options.area === true) {
        rectangle.push(area());
    }

    if (options.fixed === true) {
        rectangle.push(fixed());
    }

    const rectangleObj = k.add(rectangle);

    if (options.tiledSprite) {
        rectangleObj.add([
            sprite(options.tiledSprite, { tiled: true, width, height }),
            pos(0, 0),
            anchor('topleft'),
            layer(layerName),
        ]);
    }

    return rectangleObj;
}

// BUTTON CREATION
export function addButton(texte, posX, posY, scene) {
    function addButton(txt, f) {
        const btn = k.add([
            rect(272, 80, { radius: 12 }),
            pos(posX, posY),
            area(),
            scale(1),
            anchor('center'),
            outline(3, Color.fromHex(palette.yellowOrange.bright)),
            color(palette.blue.dark),
            layer('ui'),
        ]);

        btn.add([
            text(txt, fontStyleBold),
            anchor('center'),
            pos(4, -4),
            color(Color.fromHex(palette.yellowOrange.bright)),
            layer('ui'),
        ]);

        btn.onHoverUpdate(() => {
            btn.color = Color.fromHex(palette.cyan.dark);
            btn.scale = vec2(1.05);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = Color.fromHex(palette.blue.dark);
        });

        btn.onClick(() => {
            play('buttonClick');
            f();
        });
    }

    addButton(texte, () => {
        go(scene);
    });
}
