import { addButton } from './generators.js';

scene('menu', () => {

    // ANIMATED animatedBackground (inspired by Kaplay's logo demo)
    // A CHECKERBOARD OF FRUIT TILES SCROLLS DIAGONALLY OVER A SOLID animatedBackground.
    const bgColor = '#0C3131';
    const bgWidth = 1440;  
    const bgHeight = 800;
    const tileSize = 120; 
    const fruitSize = 128;
    const tilesSpeed = 40;
    const fruits = ['banana', 'tomato', 'pear'];
    let tilesOffset = 0;   // CURRENT SUB-TILE OFFSET, KEPT IN [0, TILESIZE)
    let tilesScrolled = 0; // HOW MANY WHOLE TILES HAVE SCROLLED (FOR SEAMLESS WRAPPING)


    // LOGO
    const logo = add([
        sprite('titleScreen'),
        pos(width() / 2, 40),
        scale(.9),
        anchor('top'),
        animate(),
        layer('game'),
    ]);

    // LOHO ANIMATION
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

    // BACKGROUND FRAME DEFINITION
    const animatedBackground = add([
        rect(bgWidth, bgHeight),
        pos(0, 0),
        color(bgColor),
        anchor('topleft'),
        fixed(),
        layer('bg'),
    ]);

    // DETERMINISTIC FRUIT PER WORLD CELL.
    function fruitAt(col, row) {
        const h = Math.abs(Math.sin(col * 12.9898 + row * 78.233) * 43758.5453);
        return fruits[Math.floor((h % 1) * fruits.length)];
    }

    // DRAW A SCROLLING CHECKERBOARD OF TILES (ONLY EVEN CELLS), BOUNDED TO THE RECT
    function drawPattern() {
        for (let y = -1; y < bgHeight / tileSize + 2; y++) {
            for (let x = -1; x < bgWidth / tileSize + 2; x++) {
                if ((x + y) % 2 === 0) {
                    // WORLD COORDS CANCEL OUT TILESSCROLLED IN THE CHECKERBOARD,
                    // BUT DRIVE A STABLE FRUIT CHOICE THAT FOLLOWS THE SCROLL.
                    const worldCol = x - tilesScrolled;
                    const worldRow = y + tilesScrolled;
                    drawSprite({
                        sprite: fruitAt(worldCol, worldRow),
                        anchor: 'center',
                        height: fruitSize,
                        pos: vec2(
                            x * tileSize + tilesOffset,   // SCROLLS RIGHT
                            y * tileSize - tilesOffset,   // SCROLLS UP
                        ),
                        color: BLACK,
                        opacity: 0.1,
                    });
                }
            }
        }
    }

    // DRAW THE SCROLLING FRUIT PATTERN INSIDE THE RECTANGLE
    animatedBackground.onDraw(() => {
        tilesOffset += tilesSpeed * dt();
        // WHEN A FULL TILE HAS SCROLLED, WRAP THE OFFSET AND BUMP THE TILE COUNTER
        while (tilesOffset >= tileSize) {
            tilesOffset -= tileSize;
            tilesScrolled++;
        }
        drawPattern();
    });

});
