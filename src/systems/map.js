// Real actual map size : 5040 x 4000 px
// Tile map size generated in this pasge 5040 x 5040 px

const TILE_XY_SIZE = 128; // Tile size in pixels
const TILES_COUNT = 40; // 40 x 128 = 5120, covers the 5040 map



// RANDOM GRASS SELECTOR
function getRandomGrassTile() {
    const grassTileList = ['grass-1', 'grass-2', 'grass-3', 'grass-4', 'grass-5', 'grass-6', 'grass-7'];
    return grassTileList[Math.floor(Math.random() * grassTileList.length)];
}

export function addTiledMap() {

    // Bake all the random tiles into a single Picture (one render call)
    beginPicture(new Picture());
    // Generates one tile line per tile column 
    for (let y = 0; y < TILES_COUNT; y++) {
        for (let x = 0; x < TILES_COUNT; x++) {
            drawSprite({
                sprite: getRandomGrassTile(),
                pos: vec2(x * TILE_XY_SIZE, y * TILE_XY_SIZE),
            });
        }
    }
    const mapPicture = endPicture();

    // Game object on the bg layer: its onDraw renders the Picture in a single call
    const fullMap = add([
        layer('bg'),
    ]);

    fullMap.onDraw(() => {
        drawPicture(mapPicture, { pos: vec2(-1800, -2120) });
    });

    return fullMap;
}
