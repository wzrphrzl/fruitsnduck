import { addTiledMap } from '../lib/map.js';
import { scoreStats } from '../appInit.js';
import { createPlayer, playerStats } from '../entities/player.js';
import { createEnemy } from '../entities/enemy.js';
import { createUI, healthPointsUI } from '../systems/ui.js';
import { createTimer } from '../systems/timer.js';
import { palette } from '../lib/colorpalette.js';
import { addTree, addObject, acornBonus, addDandelionChrono } from '../systems/generators.js';
import { setFreePos, addRect } from '../lib/helpers.js';
import { bump } from '../lib/effects.js';
import { fruitCombo } from '../systems/fruitcombo.js';

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

    // CREATES THE UI 
    const { score, box1, box2, box3 } = createUI();

    // CREATES THE FIRST ENTITIES
    const player = createPlayer();
    playerStats.speedKaplay = 600;
    const { enemy, enemyStats } = createEnemy(player, score);

    // INITIALIZES THE INVENTORY SYSTEM
    healthPointsUI();

    fruitCombo({ player, score, boxes: [box1, box2, box3], enemy, enemyStats });

    // COUNTDOWN TIMER : LOSES THE GAME AT 0
    const timer = createTimer(180, () => {
        scoreStats.gameTime = timer.elapsed;   // SNAPSHOT SURVIVAL TIME FOR THE END SCREEN
        player.enterState('lose');
        player.paused = true;
        enemy.paused = true;
        wait(2, () => {
            play('lose');
            go('lose');
        });
    });

    // COUNTDOWN WARNING : 'timerShort' EVERY 2s FROM 10s, THEN SPEEDS UP TO EVERY 1s IN THE LAST 5s
    loop(2, () => {
        if (!timer.stopped && timer.remaining <= 15 && timer.remaining > 5) {
            play('timerShort', {volume: .25 });
        }
    });
    loop(1, () => {
        if (!timer.stopped && timer.remaining <= 5) {
            play('timerShort', {volume: .25 });
        }
    });


    // ADD THE FIRST TREES
     
    wait(2, () => {
        addTree(920, player.pos.y);

/*         addDandelionChrono(920, player.pos.y + 144); 
        addThistle(920, player.pos.y + 220);  */
    });

    // GENERATE ACORNS FOR NEW TREES 
    loop(10, () => {
        const poppedAcorn = acornBonus();
        wait(10, () => { destroy(poppedAcorn); });
    });

            for (let i = 0; i < 0; i++) {
                addObject('superFruitT1');
            }

/*     wait(0, () => {
        for (let i = 0; i < 4; i++) {
            addObject('heartIngame');
        }

        for (let i = 0; i < 4; i++) {
            addObject('superHeart');
        }
    }); */


    // COLLISIONS 


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
            const spot = setFreePos(player, 140);
            addTree(spot.x, spot.y);
        });
    });

    player.onCollide('acorn', (acorn) => {
        const spot = setFreePos(player, 140);
        play('pickedAcorn'); 
        addTree(spot.x, spot.y);
        destroy(acorn);
    });
 
    player.onCollide('thistle', (thistle) => {
        player.hp -= 1;
        play('soundStress');
        destroy(thistle);
    });

    player.onCollide('dandelionChrono', (dandelionChrono) => {
        play('pickedDandelionChrono'); 
        timer.addTime(20);
        destroy(dandelionChrono);
        debug.log( 'TIME + 20')
    });

    player.onCollide('enemy', () => {
        scoreStats.savedScore = score.value;
        player.hp -= 1;
        play('hitByVirus');
        debug.log(player.hp);
    });
    
    //HP SYSTEM
    // ON HURT : flash red + refresh hearts; enter 'stressRun' for 5s, then revert — but never while in armor
    const ARMOR_STATES = ['armorRun', 'armorIdle', 'armorPoop'];
    let stressRevertState = null;
    let stressTimer = null;

    player.onHurt(() => {
        tween(RED, WHITE, .85, (p) => player.color = p);
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

        healthPointsUI(player.hp);   // POP THE HEART THAT JUST EMPTIED (player.hp already lowered)
    });

    player.onHeal(() => {
        healthPointsUI(player.hp - 1);   // POP THE HEART THAT JUST FILLED (player.hp already raised)
    });

    player.onDeath(() => {
        timer.stop();
        scoreStats.gameTime = timer.elapsed;   // SNAPSHOT SURVIVAL TIME FOR THE END SCREEN
 
        play('playerDeath'); 
        player.enterState('lose');
        player.paused = true;
        enemy.paused = true;
        wait(2, () => {
            play('lose');
            go('lose');
        });
    })

});
