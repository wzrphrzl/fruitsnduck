import { getRandomGrass } from './generators.js';

export function createMap() {
    const TILE_SIZE = 128;
    const TILES = 40; // 40 x 128 = 5120, couvre la map de 5040

    // "Cuire" toutes les tuiles aléatoires dans une seule Picture (un seul appel de rendu)
    beginPicture(new Picture());
    for (let y = 0; y < TILES; y++) {
        for (let x = 0; x < TILES; x++) {
            drawSprite({
                sprite: getRandomGrass(),
                pos: vec2(x * TILE_SIZE, y * TILE_SIZE),
            });
        }
    }
    const grassPicture = endPicture();

    // Game object sur la layer bg : son onDraw affiche la Picture en un seul appel
    const mapTile = add([
        layer("bg"),
    ]);

    mapTile.onDraw(() => {
        drawPicture(grassPicture, { pos: vec2(-1800, -2120) });
    });

    return mapTile;
}
