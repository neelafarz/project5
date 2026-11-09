// Procedure engine core: the rules and state of one run, with no DOM.
// The view (procedureView.js) draws this state; tests drive it with fake time.
//
// Phases: 'pick'   a timed step waiting for the player's tap
//         'result' the scene change after a step (locked, cannot be skipped)
//         'done'   every step finished

import { STEP_MS, stepPoints, finalScore } from './score.js';
import { PickClock } from './pickClock.js';

export const FLY_MS = 500; // tool flies to the dentist's hand
export const BEAT_MS = 700; // pause after a result that has no duration of its own
export const HINT_MS = 1500; // timeout: show the correct tool before it is handed over

export class ProcedureRun {
  constructor(data) {
    this.data = data;
    this.clock = new PickClock();
    this.stepIndex = -1;
    this.phase = 'idle';
    this.points = []; // one entry per timed (pick) step
  }

  get step() {
    return this.data.steps[this.stepIndex];
  }

  get paused() {
    return this.clock.paused;
  }

  start(now) {
    this.points = [];
    this.stepIndex = -1;
    this.#enterNextStep(now);
  }

  // Player taps a tool. Wrong picks cost nothing but time (the clock keeps running).
  tap(toolId, now) {
    if (this.phase !== 'pick' || this.paused) return { ignored: true };
    if (toolId !== this.step.pick) return { correct: false, hint: this.step.hint };
    const points = stepPoints(this.clock.elapsed(now));
    this.points.push(points);
    this.#enterResult(now, { flyDelayMs: 0, timedOut: false });
    return { correct: true, points };
  }

  // Called every frame. Ends the step when the time runs out.
  tick(now) {
    if (this.phase === 'pick' && !this.paused && this.clock.elapsed(now) >= STEP_MS) {
      this.points.push(0);
      this.#enterResult(now, { flyDelayMs: HINT_MS, timedOut: true });
      return 'timeout';
    }
    return null;
  }

  // Only a timed pick can be paused, so results (waits, popups) are never interrupted.
  pause(now) {
    return this.phase === 'pick' && this.clock.pause(now);
  }

  resume(now) {
    this.clock.resume(now);
  }

  remainingMs(now) {
    return Math.max(0, STEP_MS - this.clock.elapsed(now));
  }

  dismissPopup() {
    this.popupPending = false;
  }

  // Waits and popups are enforced here, so no view can skip them.
  canAdvance(now) {
    return this.phase === 'result' && !this.popupPending && now >= this.readyAt;
  }

  next(now) {
    if (!this.canAdvance(now)) return false;
    this.#enterNextStep(now);
    return true;
  }

  score() {
    return finalScore(this.points);
  }

  #enterNextStep(now) {
    this.stepIndex += 1;
    if (this.stepIndex >= this.data.steps.length) {
      this.phase = 'done';
      return;
    }
    if (this.step.pick) {
      this.phase = 'pick';
      this.clock.start(now);
    } else {
      this.#enterResult(now, { flyDelayMs: 0, timedOut: false });
    }
  }

  #enterResult(now, { flyDelayMs, timedOut }) {
    const hasPick = Boolean(this.step.pick);
    const flyMs = hasPick ? FLY_MS : 0;
    const showMs = this.step.result.durationMs ?? BEAT_MS;
    this.phase = 'result';
    this.timedOut = timedOut;
    this.flyStartsAt = now + flyDelayMs;
    this.resultStartsAt = this.flyStartsAt + flyMs;
    this.readyAt = this.resultStartsAt + showMs;
    this.popupPending = Boolean(this.step.popup);
  }
}
