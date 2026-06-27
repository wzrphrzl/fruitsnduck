import { addTiledMap } from '../systems/map.js';
import { scoreStats } from '../appInit.js';
import { createPlayer, playerStats } from '../entities/player.js';
import { createEnemy } from '../entities/enemy.js';
import { createUI, createHearts } from '../systems/ui.js';
import { addTree, addObject, acornBonus } from '../systems/generators.js';
import { setXs, setYs, addRect } from '../lib/helpers.js';
import { bump } from '../lib/effects.js';
import { setupInventory } from '../systems/inventory.js';

scene('game', () => {

    //debug.inspect = true;

    // MAP SETTINGS
    addRect(1440, 800, 0, 0, 0, '#134C4C', 'bg', { fixed: true, area: false });
    addTiledMap();
    //WALLS
    /*TOP*/   addRect(9360, 1080, 0, -3960, -2680, '#000000', 'ui', { area: true });
    /*RIGHT*/ addRect(1080, 9360, 0, 3240, -4280, '#000000', 'ui', { area: true });
    /*BOTTOM*/addRect(9360, 1080, 0, -3960, 2400, '#000000', 'ui', { area: true });
    /*LEFT*/  addRect(1080, 9360, 0, -2880, -4280, '#000000', 'ui', { area: true });

    // CREATES THE UI 
    const { score, box1, box2, box3 } = createUI();

    // CREATES THE FIRST ENTITIES
    const player = createPlayer();
    playerStats.speed = 400;
    const { enemy, enemyStats } = createEnemy(player, score);

    // HP HEART BAR (REFLECTS player.hp)
    createHearts(player);

    // INITIALIZES THE INVENTORY SYSTEM
    setupInventory({ player, score, boxes: [box1, box2, box3], enemy, enemyStats });


    // ADD THE FIRST TREE
    addTree( 880, player.pos.y);

    // GENERATE ACORNS FOR NEW TREES 
    loop(10, () => {
        const poppedAcorn = acornBonus();
        wait(5, () => { destroy(poppedAcorn); });
    });


    // COLLISIONS 

    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state == 'fruity') {

            play('treeHit');

            bump(touchedTree);

            for (let i = 0; i < 3; i++) {
                addObject('defaultObject');
            }
            touchedTree.enterState('default');
        }
        else if (touchedTree.state == 'default') return

        addTree(setXs(player), setYs(player));
    });

    player.onCollide('acorn', (acorn) => {
        addTree(setXs(player), setYs(player));
        destroy(acorn);
    });

    debug.log(player.hp);
 
    player.onCollide('enemy', () => {
        scoreStats.savedScore = score.value;
        //player.maxHP += 1;
        debug.log(player.hp);
    });
    
    //HP SYSTEM
    player.onHurt(() => {
        tween(RED, WHITE, 0.3, (p) => player.color = p);
    });

    player.onDeath(() => {
        player.enterState('lose');
        player.paused = true;
        enemy.paused = true; 
        wait(2, () => {
            play('lose');
            go('lose');
        });
    })

});
