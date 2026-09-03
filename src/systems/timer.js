import { musicPlaying, fontStyleBold } from '../appInit.js';

// FORMAT A TIME IN SECONDS AS XX:XX (e.g. 60 → '01:00', 59 → '00:59')
export function formatTime(totalSeconds) {
    const clamped = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(clamped / 60);
    const seconds = clamped % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

// REFERENCE TO THE TIMER CREATED FOR THE CURRENT GAME, so other modules (e.g. objects.js)
// can affect it without it being passed around. Set by createTimer.
let currentTimer;

// ADD TIME TO THE CURRENT GAME'S TIMER (no-op if none / already stopped)
export function addGameTime(seconds) {
    currentTimer?.addTime(seconds);
}

export function createTimer(startSeconds, onTimeout) {

    // ALIGNED WITH THE SCORE (SAME Y / FONT SIZE), HORIZONTALLY CENTERED
    const timer = add([
        text(formatTime(startSeconds), { size: 88, font: 'monogram' }),
        pos(width() / 2, 0),
        fixed(),
        anchor('top'),
        layer('ui'),
        {
            remaining: startSeconds,
            elapsed: 0,
            stopped: false,
            addTime(seconds) {
                if (this.stopped) return;
                this.remaining += seconds;
            },
            stop() {
                this.stopped = true;
            },
        },
    ]);

    // COUNT DOWN WITH dt(), COUNT UP elapsed, REFRESH THE XX:XX LABEL EACH FRAME
    timer.onUpdate(() => {
        if (timer.stopped) return;

        timer.remaining -= dt();
        timer.elapsed += dt();

        if (timer.remaining <= 0) {
            timer.remaining = 0;
            timer.stopped = true;
            timer.text = formatTime(0);
            musicPlaying.speed = 1;
            onTimeout();
            return;
        }

        timer.text = formatTime(timer.remaining);

        // SPEED THE MUSIC UP IN THE LAST 15s (back to normal if time is won back)
        const targetSpeed = timer.remaining <= 15 ? 1.15 : 1;
        if (musicPlaying.speed !== targetSpeed) musicPlaying.speed = targetSpeed;
    });

    // COUNTDOWN WARNING : 'timerShort' EVERY 2s FROM 15s, THEN SPEEDS UP TO EVERY 1s IN THE LAST 5s
    loop(2, () => {
        if (!timer.stopped && timer.remaining <= 15 && timer.remaining > 5) {
            play('timerShort', { volume: .25 });
        }
    });
    loop(1, () => {
        if (!timer.stopped && timer.remaining <= 5) {
            play('timerShort', { volume: .25 });
        }
    });

    currentTimer = timer;
    return timer;
}
