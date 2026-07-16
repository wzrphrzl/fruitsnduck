import { fontStyleRegular } from '../appInit.js';

// FORMAT A TIME IN SECONDS AS XX:XX (e.g. 60 → '01:00', 59 → '00:59')
export function formatTime(totalSeconds) {
    const clamped = Math.max(0, Math.ceil(totalSeconds));
    const minutes = Math.floor(clamped / 60);
    const seconds = clamped % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

export function createTimer(startSeconds, onTimeout) {

    // ALIGNED WITH THE SCORE (SAME Y / FONT SIZE), HORIZONTALLY CENTERED
    const timer = add([
        text(formatTime(startSeconds), fontStyleRegular),
        pos(width() / 2, 24),
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
            onTimeout();
            return;
        }

        timer.text = formatTime(timer.remaining);
    });

    return timer;
}
