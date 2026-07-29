import { addTiledMap } from '../lib/map.js';
import { scoreStats } from '../appInit.js';
import { createPlayer, playerStats } from '../entities/player.js';
import { createBoss } from '../entities/boss.js';
import { createVirus } from '../entities/virus.js';
import { createUI, healthPoints_UI } from '../systems/ui.js';
import { createTimer } from '../systems/timer.js';
import { palette } from '../lib/colorpalette.js';
import { addObject, addPlant } from '../systems/generators.js';
import { setPos, addRect, setXm, setYm } from '../lib/helpers.js';
import { bump } from '../lib/effects.js';
import { fruitCombo } from '../systems/fruitcombo.js';
import { objects } from '../systems/objects.js';

scene('game', () => {

    //debug.inspect = true;

    // MAP SETTINGS
    addRect(1440, 800, 0, 0, 0, palette.green.darker, 'bg', { fixed: true, area: false });
    addTiledMap();
    //OUTER BLACK FILL (extends far beyond the map, hides everything past the walls)
    /*TOP*/   addRect(9360, 1080, 0, -3960, -2728, '#000000', 'game', { area: true });
    /*RIGHT*/ addRect(1080, 9360, 0, 3280, -4280, '#000000', 'game', { area: true });
    /*BOTTOM*/addRect(9360, 1080, 0, -3960, 2448, '#000000', 'game', { area: true });
    /*LEFT*/  addRect(1080, 9360, 0, -2920, -4280, '#000000', 'game', { area: true });
    //WALLS
    /*TOP*/   addRect(5120, 512, 0, -1840, -2160, '#000000', 'game', { area: true, tiledSprite: 'moutainTop' });
    /*RIGHT*/ addRect(512, 4096, 0, 3280, -1648, '#000000', 'game', { area: true, tiledSprite: 'moutainRight' });
    /*BOTTOM*/addRect(5120, 512, 0, -1840, 2448, '#000000', 'game', { area: true, tiledSprite: 'moutainBottom' });
    /*LEFT*/  addRect(512, 4096, 0, -2352, -1648, '#000000', 'game', { area: true, tiledSprite: 'moutainLeft' });
    //CORNERS
    /*TOPLEFT*/    addRect(512, 512, 0, -2352, -2160, '#000000', 'game', { area: true, tiledSprite: 'moutainTopLeft' });
    /*TOPRIGHT*/   addRect(512, 512, 0, 3280, -2160, '#000000', 'game', { area: true, tiledSprite: 'moutainTopRight' });
    /*BOTTOMRIGHT*/addRect(512, 512, 0, 3280, 2448, '#000000', 'game', { area: true, tiledSprite: 'moutainBottomRight' });
    /*BOTTOMLEFT*/ addRect(512, 512, 0, -2352, 2448, '#000000', 'game', { area: true, tiledSprite: 'moutainBottomLeft' });





    // INITIALIZES THE GAME ELEMENTS
    const { score, box1, box2, box3 } = createUI();
    const player = createPlayer();

    const { boss, bossStats } = createBoss(player, score);

    // VIRUS WAVES : one extra virus every time a 50-point step is crossed (50, 100, 150...).
    // The counter only ever goes up, so losing points to a debuff and earning them back
    // doesn't re-trigger a step already paid for.
    const VIRUS_SCORE_STEP = 50;
    let virusesSpawned = 0;


    onUpdate(() => {
        const stepsReached = Math.floor(score.value / VIRUS_SCORE_STEP);
        // `while` and not `if` : a big combo can cross several steps in one go
        while (virusesSpawned < stepsReached) {
            virusesSpawned++;
            createVirus(player, setXm(player), setYm(player));
        }
    });

    healthPoints_UI();

    //
    // ADD THE FIRST TREE & OBJECTS
    //


    wait(0, () => {
            addObject('acorn', 920, player.pos.y + 24);
    });

    for (let i = 0; i < 2; i++) {

    }


    //
    // COLLISIONS 
    //

    fruitCombo({ player, score, boxes: [box1, box2, box3], boss, bossStats });

    player.onCollide('tree', (touchedTree) => {

        if (touchedTree.state == 'fruity') {

        for (let i = 0; i < 1 ; i++) {
            const spot = setPos(player, 140);
            addPlant('treeSmall', spot.x, spot.y);
        }
    
            play('treeHit');
            bump(touchedTree);

            for (let i = 0; i < 2; i++) {
                addObject('commonFruit');
            }
            for (let i = 0; i < 3; i++) {
                addObject('superFruitT1');

                addObject('sPiment1');
            }
            touchedTree.enterState('default');
        }
        else if (touchedTree.state == 'default') return

        wait(0, () => {
            const spot = setPos(player, 100);
            addObject('acorn', spot.x, spot.y);
        });
    });

    // PLANTS : the effect lives in each object's objectEvent (objects.js); destroy stays here
    ['thistle', 'dandelionChrono'].forEach((tag) => {
        player.onCollide(tag, (gameObject) => {
            objects[tag].objectEvent(gameObject);
            destroy(gameObject);
        });
    });



    
    // KNOCKBACK : pushes the player away from whatever just hit them.
    // Spread over a few frames (not a teleport) so walls and other solids still block it.
    const KNOCKBACK_DISTANCE = 175;    // total pixels travelled
    const KNOCKBACK_DURATION = 0.2;  // seconds
    let knockback = null;

    const applyKnockback = (dir) => {
        if (dir.len() === 0) return;   // attacker exactly on the player : no usable direction
        knockback = { dir: dir.unit(), timeLeft: KNOCKBACK_DURATION };
    };

    player.onUpdate(() => {
        if (!knockback) return;
        // Speed decays linearly to 0 (ease-out feel), total distance = KNOCKBACK_DISTANCE
        const speed = (2 * KNOCKBACK_DISTANCE / KNOCKBACK_DURATION) * (knockback.timeLeft / KNOCKBACK_DURATION);
        player.moveBy(knockback.dir.scale(speed * dt()));
        knockback.timeLeft -= dt();
        if (knockback.timeLeft <= 0) knockback = null;
    });

    ['boss', 'virus'].forEach((tag) => {
        player.onCollide(tag, (attacker) => {
            play('hitByVirus');
            scoreStats.savedScore = score.value;
            player.hp -= 1;
            applyKnockback(player.pos.sub(attacker.pos));  
        });
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
        healthPoints_UI(player.hp);   // POP THE HEART THAT JUST EMPTIED (player.hp already lowered)
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
        boss.paused = true;
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
