import { addTiledMap } from '../lib/map.js';
import { scoreStats } from '../appInit.js';
import { createPlayer, playerStats } from '../entities/player.js';
import { createEnemy } from '../entities/enemy.js';
import { createUI, healthPoints_UI } from '../systems/ui.js';
import { createTimer } from '../systems/timer.js';
import { palette } from '../lib/colorpalette.js';
import { addTree, addObject, addPlant, addExplosion } from '../systems/generators.js';
import { setPos, addRect } from '../lib/helpers.js';
import { bump } from '../lib/effects.js';
import { fruitCombo } from '../systems/fruitcombo.js';
import { objects } from '../systems/objects.js';

scene('game', () => {

    //debug.inspect = true;

    // MAP SETTINGS
    addRect(1440, 800, 0, 0, 0, palette.green.darker, 'bg', { fixed: true, area: false });
    addTiledMap();
    //WALLS
    /*TOP*/   addRect(9360, 1080, 0, -3960, -2680, '#000000', 'ui', { area: true });
    /*RIGHT*/ addRect(1080, 9360, 0, 3240, -4280, '#000000', 'ui', { area: true });
    /*BOTTOM*/addRect(9360, 1080, 0, -3960, 2400, '#000000', 'ui', { area: true });
    /*LEFT*/  addRect(1080, 9360, 0, -2880, -4280, '#000000', 'ui', { area: true });

    // INITIALIZES THE GAME ELEMENTS
    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();
    const { enemy, enemyStats } = createEnemy(player, score);
    healthPoints_UI();

    //
    // ADD THE FIRST TREE & OBJECTS
    //
    wait(2, () => {
        addTree(920, player.pos.y);
        addObject('acorn')

        for (let i = 0; i < 3; i++) {
            const spot = setPos(player, 140);
            addPlant('treeSmall', spot.x, spot.y);
        }
    });

    for (let i = 0; i < 0; i++) {
        addObject('superFruitT1');
    }


    //
    // COLLISIONS 
    //

    fruitCombo({ player, score, boxes: [box1, box2, box3], enemy, enemyStats });

    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state == 'fruity') {

            play('treeHit');
            bump(touchedTree);

            for (let i = 0; i < 5; i++) {
                addObject('commonFruit');
            }
            for (let i = 0; i < 2; i++) {
                addObject('superFruitT1');
            }
            touchedTree.enterState('default');
        }
        else if (touchedTree.state == 'default') return

        wait(1, () => {
            const spot = setPos(player, 140);
            addTree(spot.x, spot.y);
        });
    });

    // PLANTS : the effect lives in each object's objectEvent (objects.js); destroy stays here
    ['thistle', 'dandelionChrono'].forEach((tag) => {
        player.onCollide(tag, (gameObject) => {
            objects[tag].objectEvent(gameObject);
            destroy(gameObject);
        });
    });

    player.onCollide('enemy', () => {
        play('hitByVirus');
        scoreStats.savedScore = score.value;
        player.hp -= 1;
    });

    //
    // PLAYER STATES
    //
    playerStats.speedKaplay = 600;    
    // HP SYSTEM
    // ON HURT : flash red + refresh hearts; enter 'stressRun' for 5s, then revert — but never while in armor
    const ARMOR_STATES = ['armorRun', 'armorIdle', 'armorPoop'];
    let stressRevertState;
    let stressTimer;

    player.onHurt(() => {
        tween(Color.fromHex(palette.red.bright), WHITE, .85, (p) => player.color = p);
        // ARMOR ABSORBS THE HIT WITHOUT STRESS
        if (ARMOR_STATES.includes(player.state)) return;
        // REMEMBER WHERE TO RETURN TO (skip if already stressed, so we never capture 'stressRun')
        if (!player.state.startsWith('stress')) stressRevertState = player.state;

        player.enterState('stressRun');

        // STRESS LASTS 5s, THEN REVERT (unless the player already left the stress state, e.g. via a perk)
        if (stressTimer) stressTimer.cancel();
        stressTimer = wait(0.85, () => {
            stressTimer = null;
            if (player.state.startsWith('stress')) player.enterState(stressRevertState);
        });

        healthPoints_UI(player.hp);   // POP THE HEART THAT JUST EMPTIED (player.hp already lowered)
    });

    player.onHeal(() => {
        healthPoints_UI(player.hp - 1);   // POP THE HEART THAT JUST FILLED (player.hp already raised)
    });

    //
    // GAME ENDING AND TIMER
    //
    function gameEnds() {
        play('playerDeath'); 
        scoreStats.gameTime = timer.elapsed;   // SNAPSHOT SURVIVAL TIME FOR THE END SCREEN
        player.enterState('lose');
        player.paused = true;
        enemy.paused = true;
        wait(2, () => {
            play('lose');
            go('lose');
        });
    }

    const timer = createTimer(180, () => {
        gameEnds();
    });

    player.onDeath(() => {
        timer.stop();
        gameEnds(); 
    })

});
