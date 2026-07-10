import { player } from '../entities/player.js';


export function virusStress(virus) {
    if (virus.isActive) return;
    // ARMOR MAKES THE PLAYER IMMUNE
    if (player.state.startsWith('armor')) return;

    virus.isActive = true;
    const previousState = player.state;
    player.enterState('stressRun');
    play('soundStress');
    wait(1.5, () => {
        player.enterState(previousState);
        virus.isActive = false;
    });
}
