import { addButton } from './generators.js';

scene('menu', () => {

    // ANIMATED BACKGROUND (inspired by Kaplay's logo demo)
    // A checkerboard of fruit tiles scrolls diagonally over a solid background.
    const bgColor = '#0C3131';
    const bgWidth = 1440;  // background rectangle size
    const bgHeight = 800;
    const tileSize = 120;  // grid spacing between fruits
    const fruitSize = 128; // fruit render size (kept constant, independent of spacing)
    const tilesSpeed = 40;
    const fruits = ['banana', 'tomato', 'pear'];
    let tilesOffset = 0;   // current sub-tile offset, kept in [0, tileSize)
    let tilesScrolled = 0; // how many whole tiles have scrolled (for seamless wrapping)

    // Deterministic fruit per WORLD cell: stable across frames, and identical
    // before/after a wrap, so the infinite scroll stays seamless (no flicker).
    function fruitAt(col, row) {
        const h = Math.abs(Math.sin(col * 12.9898 + row * 78.233) * 43758.5453);
        return fruits[Math.floor((h % 1) * fruits.length)];
    }

    // Draw a scrolling checkerboard of tiles (only even cells), bounded to the rect
    function drawPattern() {
        for (let y = -1; y < bgHeight / tileSize + 2; y++) {
            for (let x = -1; x < bgWidth / tileSize + 2; x++) {
                if ((x + y) % 2 === 0) {
                    // World coords cancel out tilesScrolled in the checkerboard,
                    // but drive a stable fruit choice that follows the scroll.
                    const worldCol = x - tilesScrolled;
                    const worldRow = y + tilesScrolled;
                    drawSprite({
                        sprite: fruitAt(worldCol, worldRow),
                        anchor: 'center',
                        height: fruitSize,
                        pos: vec2(
                            x * tileSize + tilesOffset,   // scrolls right
                            y * tileSize - tilesOffset,   // scrolls up
                        ),
                        color: BLACK,
                        opacity: 0.1,
                    });
                }
            }
        }
    }

    // Background rectangle (1440x800) on the 'bg' layer: holds the whole animation
    const bgPattern = add([
        rect(bgWidth, bgHeight),
        pos(0, 0),
        color(bgColor),
        anchor('topleft'),
        fixed(),
        layer('bg'),
    ]);

    // Draw the scrolling fruit pattern inside the rectangle
    bgPattern.onDraw(() => {
        tilesOffset += tilesSpeed * dt();
        // When a full tile has scrolled, wrap the offset and bump the tile counter
        while (tilesOffset >= tileSize) {
            tilesOffset -= tileSize;
            tilesScrolled++;
        }
        drawPattern();
    });

    const logoX = width() / 2;

    const logo = add([
        sprite('titleScreen'),
        pos(logoX, 40),
        scale(.9),
        anchor('top'),
        animate(),
        layer('game'),
    ]);

    // Scale pulsing (0.9 → 1.0 → 0.9)
    logo.animate('scale', [vec2(.96), vec2(1.0), vec2(.96)], {
        duration: 2.5,
        easing: easings.easeInOutQuad,
    });

    addButton('Start', width() / 2, 488);

    add([
        sprite('gameRules'),
        pos(width() / 2, height()-40),
        scale(1),
        anchor('bot'),
        layer('ui'),
    ]);

    add([
        text('V 0.9.5', { size: 16 }),
        color(Color.fromHex('#D3FC7E')),
        pos(width() - 40, 40),
        anchor('center'),
        anchor('right'),
        layer('ui'),
    ]);
});
