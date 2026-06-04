import { getRandomGrass } from './generators.js';

export function createMap() {
    const mapTile = add([
        pos(-1800, -2120),
        sprite(getRandomGrass(), {
            tiled: true,
            width: 5040,
            height: 5040,
        }),
        layer("bg"),
    ]);

    return mapTile;
}
