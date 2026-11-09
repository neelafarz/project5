// Sort engine core: the rules and state of one sorting round, with no DOM.
// The view (sortView.js) draws this state; tests drive it with fake time.
//
// Each item is shown alone with 10 seconds to tap a bin. A hint appears at 5 seconds.
// At 10 seconds the game sorts the item for the player and it scores 0.
// A wrong pick is final: it scores 0 and cannot be changed.
//
// Phases: 'pick' a timed item, 'result' the short feedback after it, 'done' every item sorted.

import { STEP_MS, stepPoints, finalScore } from './score.js';
import { PickClock } from './pickClock.js';

export const HINT_AT_MS = 5000; // the hint appears this long into an item
export const MOVE_MS = 400; // the item moves into its bin
export const FEEDBACK_MS = 800; // pause after an item so the player sees the outcome

export class SortRun {
  // `random` is injectable so tests can fix the item order.
  constructor(data, random = Math.random) {
    this.data = data;
    this.random = random;
    this.clock = new PickClock();
    this.phase = 'idle';
  }

  get item() {
    return this.order[this.index];
  }

  get total() {
    return this.order.length;
  }

  get paused() {
    return this.clock.paused;
  }

  start(now) {
    this.order = this.#shuffled(this.data.items);
    this.index = -1;
    this.points = [];
    this.correctCount = 0;
    this.#enterNextItem(now);
  }

  // Player taps a bin. The answer is final either way.
  tap(binId, now) {
    if (this.phase !== 'pick' || this.paused) return { ignored: true };
    const correct = binId === this.item.bin;
    const points = correct ? stepPoints(this.clock.elapsed(now)) : 0;
    this.#finishItem(now, { points, correct, chosenBin: binId, autoAnswered: false, moveDelayMs: 0 });
    return { correct, points };
  }

  // Called every frame. Returns 'hint' once at 5 seconds, 'timeout' at 10 seconds.
  tick(now) {
    if (this.phase !== 'pick' || this.paused) return null;
    const elapsed = this.clock.elapsed(now);
    if (elapsed >= STEP_MS) {
      this.#finishItem(now, { points: 0, correct: false, chosenBin: this.item.bin, autoAnswered: true, moveDelayMs: 0 });
      return 'timeout';
    }
    if (elapsed >= HINT_AT_MS && !this.hintShown) {
      this.hintShown = true;
      return 'hint';
    }
    return null;
  }

  pause(now) {
    return this.phase === 'pick' && this.clock.pause(now);
  }

  resume(now) {
    this.clock.resume(now);
  }

  remainingMs(now) {
    return Math.max(0, STEP_MS - this.clock.elapsed(now));
  }

  canAdvance(now) {
    return this.phase === 'result' && now >= this.readyAt;
  }

  next(now) {
    if (!this.canAdvance(now)) return false;
    this.#enterNextItem(now);
    return true;
  }

  score() {
    return finalScore(this.points);
  }

  #enterNextItem(now) {
    this.index += 1;
    if (this.index >= this.total) {
      this.phase = 'done';
      return;
    }
    this.phase = 'pick';
    this.hintShown = false;
    this.outcome = null;
    this.clock.start(now);
  }

  #finishItem(now, outcome) {
    this.points.push(outcome.points);
    if (outcome.correct) this.correctCount += 1;
    this.outcome = outcome;
    this.phase = 'result';
    this.readyAt = now + MOVE_MS + FEEDBACK_MS;
  }

  // Fisher-Yates shuffle of a copy.
  #shuffled(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(this.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
