import { k, fontStyleMed } from '../appInit.js';

// GENERIC HELPERS

// GENERATE RANDOM POSITIONS FROM PLAYER
export function setXs(player) {
    if (Math.random() < 0.5) {
        return rand(player.pos.x - 720, player.pos.x - 96);
    } else {
        return rand(player.pos.x + 96, player.pos.x + 720);
    }
}

export function setYs(player) {
    if (Math.random() < 0.5) {
        return rand(player.pos.y - 400, player.pos.y - 96);
    } else {
        return rand(player.pos.y + 96, player.pos.y + 400);
    }
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
            outline(3, Color.fromHex('#FFEB57')),
            color('#00396D'),
            layer('ui'),
        ]);

        btn.add([
            text(txt, fontStyleMed),
            anchor('center'),
            pos(0, -4),
            color(Color.fromHex('#FFEB57')),
            layer('ui'),
        ]);

        btn.onHoverUpdate(() => {
            btn.color = Color.fromHex('#0D79BC');
            btn.scale = vec2(1.05);
            setCursor('pointer');
        });

        btn.onHoverEnd(() => {
            btn.scale = vec2(1);
            btn.color = Color.fromHex('#00396D');
        });

        btn.onClick(f);
    }

    addButton(texte, () => {
        go('game');
    });
}
