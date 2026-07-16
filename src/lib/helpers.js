import { k, fontStyleBig } from '../appInit.js';
import { palette } from './colorpalette.js';

// GENERIC HELPERS

// GENERATE RANDOM POSITIONS FROM PLAYER
export function setXs(player) {
    if (Math.random() < 0.5) {
        return rand(player.pos.x - 600, player.pos.x - 64);
    } else {
        return rand(player.pos.x + 64, player.pos.x + 600);
    }
}

export function setYs(player) {
    if (Math.random() < 0.5) {
        return rand(player.pos.y - 348, player.pos.y - 64);
    } else {
        return rand(player.pos.y + 64, player.pos.y + 348);
    }
}

// SPAWNED-OBJECT TAGS CHECKED FOR OVERLAP WHEN PICKING A FREE SPOT
const SPAWN_TAGS = ['objectContainer', 'tree', 'thistle', 'acorn', 'dandelionChrono'];

// PICK A RANDOM POSITION NEAR THE PLAYER THAT IS AT LEAST minDist AWAY FROM
// EVERY SPAWNED OBJECT (rejection sampling : retry up to maxTries, then give up
// and accept the last candidate — never worse than the old fully-random spawn).
export function setFreePos(player, minDist = 96, maxTries = 10) {
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

    return k.add(rectangle);
}

// BUTTON CREATION
export function addButton(texte, posX, posY) {
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
            text(txt, fontStyleBig),
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
        go('game');
    });
}
