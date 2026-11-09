// The countdown shared by both engines: one timed pick that can be paused.
// Pausing freezes the elapsed time; the paused time never counts against the player.

export class PickClock {
  start(now) {
    this.startedAt = now;
    this.pausedAt = null;
  }

  get paused() {
    return this.pausedAt != null;
  }

  elapsed(now) {
    return (this.paused ? this.pausedAt : now) - this.startedAt;
  }

  pause(now) {
    if (this.paused) return false;
    this.pausedAt = now;
    return true;
  }

  resume(now) {
    if (!this.paused) return;
    this.startedAt += now - this.pausedAt;
    this.pausedAt = null;
  }
}

// The text shown for the countdown, for example "Time: 9 seconds".
export function timeLabel(remainingMs) {
  const seconds = Math.ceil(remainingMs / 1000);
  return `Time: ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
}
