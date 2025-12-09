
import kaplay from "kaplay";
import "kaplay/global";


const k = kaplay();
let SPEED = 800;
let pvRolls = 5;


k.setBackground(173, 141, 202);

loadSound('ring', './sound/ring.mp3');
loadSound('rolls', './sound/rolls.mp3');
loadSound('pet-1', './sound/pet-1.mp3');
loadSound('pet-2', './sound/pet-2.mp3');
loadSound('pet-3', './sound/pet-3.mp3');
loadSound('pet-4', './sound/pet-4.mp3');
loadSound('pet-5', './sound/pet-5.mp3');


const listePets = ['pet-1', 'pet-2', 'pet-3', 'pet-4', 'pet-5'];

function prouter() {
	const random = Math.floor(Math.random() * listePets.length);
	play(listePets[random]);
}

loadSprite('speltur', './img/speltur.png', {

	sliceX: 10,
	anims: {
		'idle': {
			from: 0,
			to: 9,
			speed: 6,
			loop: true,
		}
	}
});

const joueur = k.add([
	sprite('speltur'),
	pos(center()),
	anchor('center'),
	area({ scale: .66 }),
	body(),
	'speltur',
]);

joueur.play('idle');


loadSprite('caca', './img/caca.png', {
	sliceX: 2,
	anims: {
		'idle': {
			from: 0,
			to: 1,
			speed: 4,
			loop: true,
		}
	}
});

//ROLLS
loadSprite('rolls', './img/rolls.png');

let ROLLS_SPEED = 100;
let taillerolls = 2.33;
const bruitRolls = play('rolls');

const rolls = add([
	sprite('rolls'),
	rotate(120),
	pos(width() + 80, height() + 80),
	area({ scale: .66 }),
	body(),
	scale(taillerolls),
	anchor('center'),
	state('move'),
	'rolls',
]);

rolls.onStateEnter('move', async () => {

	if (joueur.exists()) {
		const dir = joueur.pos.sub(rolls.pos).unit();
		rolls.move(dir.scale(ROLLS_SPEED));

		bruitRolls;
	}

	await wait(0);
	rolls.enterState('move');

});

rolls.onStateUpdate('move', () => {

	if (!joueur.exists()) return;
	const dir = joueur.pos.sub(rolls.pos).unit();
	rolls.move(dir.scale(ROLLS_SPEED));
	rolls.angle -= 120 * dt();

});

//CHIER
k.onKeyPress("space", () => {

	const caca = k.add([
		sprite('caca'),
		pos(joueur.pos.add(-20, 20)),
		anchor("bot"),
		area({ scale: 1 }),
		scale(1.5),
		z(-10),
		//body(),
		'caca',
	]);

	prouter();
	ROLLS_SPEED++;

	caca.play('idle');
	//joueur.moveTo(rand(0, width()), rand(0, height()));

});


rolls.onCollide('caca', (caca) => {
	pvRolls = pvRolls - 1;
	console.log(pvRolls);

	destroy(caca);


	rolls.color = RED;
	wait(.05, () => {
		rolls.color = null;
	});

	if (pvRolls == 0) {
		destroy(rolls);
	}

});




onKeyDown('left', () => { joueur.move(-SPEED, 0); });
onKeyDown('q', () => { joueur.move(-SPEED, 0); });
onKeyDown('right', () => { joueur.move(SPEED, 0); });
onKeyDown('d', () => { joueur.move(SPEED, 0); });
onKeyDown('up', () => { joueur.move(0, -SPEED); });
onKeyDown('z', () => { joueur.move(0, -SPEED); });
onKeyDown('down', () => { joueur.move(0, SPEED); });
onKeyDown('s', () => { joueur.move(0, SPEED); });

//debug.inspect = true