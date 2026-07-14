/*
 * Sound effect helpers: pick a random clip from a set and play it.
 */

// PLAY A RANDOM SOUND FROM A LIST
function playRandom(soundList, options) {
    const random = Math.floor(Math.random() * soundList.length);
    play(soundList[random], options);
}

export function kwak() {
    playRandom(['kwak-1', 'kwak-2', 'kwak-3', 'kwak-4', 'kwak-5']);
}

export function fart() {
    playRandom(['fart-1', 'fart-2', 'fart-3', 'fart-4', 'fart-5']);
}

export function treeGrows() {
    playRandom(['treePops-1', 'treePops-2', 'treePops-3', 'treePops-4', 'treePops-5']);
}

export function armorWalks() {
    playRandom(['armor-footstep-1', 'armor-footstep-2', 'armor-footstep-3'], { volume: .6 });
}
