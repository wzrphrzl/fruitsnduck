/*
 * Sound effect helpers: pick a random clip from a set and play it.
 */

// PLAY A RANDOM SOUND FROM A LIST
function playRandom(soundList) {
    const random = Math.floor(Math.random() * soundList.length);
    play(soundList[random]);
}

export function kwak() {
    playRandom(['kwak-1', 'kwak-2', 'kwak-3', 'kwak-4', 'kwak-5']);
}

export function fart() {
    playRandom(['fart-1', 'fart-2', 'fart-3', 'fart-4', 'fart-5']);
}

export function treePops() {
    playRandom(['treePops-1', 'treePops-2', 'treePops-3', 'treePops-4', 'treePops-5']);
}
