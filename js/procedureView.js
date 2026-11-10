// Procedure engine view: draws a ProcedureRun into the game screen.
// It owns no rules. Scoring, waits and popups are enforced by procedureRun.js.

import { ProcedureRun, FLY_MS, HINT_MS } from './procedureRun.js';
import { timeLabel } from './pickClock.js';
import { flyTo } from './fly.js';
import { play } from './sound.js';

export class ProcedureView {
  // `screen` is the <section data-screen="game"> element; `onFinish(score)` is called at the end.
  // `cast` (from data/app.json) lists the patients and hands shared by every procedure.
  constructor(screen, data, onFinish, cast) {
    this.screen = screen;
    this.data = data;
    this.onFinish = onFinish;
    this.cast = { patients: [], openHands: [], workingHand: '', drillHand: '', glasses: '', ...cast };
    this.run = new ProcedureRun(data);
    this.timeouts = [];
    this.frame = null;
    this.slot = (name) => screen.querySelector(`[data-slot="${name}"]`);
  }

  start() {
    this.#buildTray();
    this.#chooseCast();
    this.#setScene(this.data.startScene);
    this.run.start(performance.now());
    this.#showStep();
    this.#loop();
  }

  // Stops all timers so a finished or abandoned run leaves nothing running.
  destroy() {
    this.slot('pause').hidden = true;
    this.slot('popup').hidden = true;
    cancelAnimationFrame(this.frame);
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    this.screen.querySelectorAll('.flying').forEach((el) => el.remove());
  }

  #later(fn, ms) {
    this.timeouts.push(setTimeout(fn, ms));
  }

  #buildTray() {
    const tray = this.slot('tray');
    tray.replaceChildren();
    // Tools with layout data lie where the data puts them; otherwise the tray is a plain grid.
    tray.classList.toggle('free', this.data.tray.every((tool) => tool.layout));
    for (const tool of this.data.tray) {
      const button = document.createElement('button');
      button.className = 'tool';
      button.dataset.tool = tool.id;
      button.setAttribute('aria-label', tool.label);
      const img = document.createElement('img');
      img.src = tool.image;
      img.alt = '';
      // A real tray has no captions. The label is spoken by screen readers (aria-label) and
      // only shown as a stand-in when a tool's image is missing.
      const label = document.createElement('span');
      label.className = 'tool-label';
      label.textContent = tool.label;
      label.hidden = true;
      img.onerror = () => { img.remove(); label.hidden = false; };
      button.append(img, label);
      if (tool.layout) this.#place(button, tool.layout);
      button.addEventListener('click', () => this.#onTap(tool.id));
      tray.append(button);
    }
  }

  // Lays a tool on the tray: center (x, y) and length (h) in % of the tray, tilted by rot degrees.
  #place(button, { x, y, h, rot }) {
    button.classList.add('positioned');
    Object.assign(button.style, { left: `${x}%`, top: `${y}%`, height: `${h}%`, rotate: `${rot}deg` });
  }

  #toolButton(id) {
    return this.slot('tray').querySelector(`[data-tool="${id}"]`);
  }

  #setTrayEnabled(enabled) {
    this.slot('tray').querySelectorAll('.tool').forEach((b) => {
      b.disabled = !enabled;
      b.classList.remove('hint', 'wrong');
    });
  }

  // Each run picks a patient at random (provisional). The dentist's hand is the opposite skin tone:
  // the lists are ordered so that patient N pairs with the next hand in the list (wrapping around).
  #chooseCast() {
    const { patients, openHands, glasses } = this.cast;
    const patientIndex = Math.floor(Math.random() * patients.length);
    this.openHand = openHands.length ? openHands[(patientIndex + 1) % openHands.length] : '';
    const patient = this.screen.querySelector('.patient');
    patient.hidden = patients.length === 0;
    if (!patient.hidden) patient.src = patients[patientIndex];
    // Sunglasses go over the patient's face (they share the patient's canvas and size).
    const shades = this.screen.querySelector('.glasses');
    shades.hidden = patient.hidden || !glasses;
    if (!shades.hidden) shades.src = glasses;
    this.#setHand('open');
  }

  // The open hand waits for a tool; the working hand shows while the dentist works.
  // `variant` 'drill' (a step's result.hand) shows the hand holding the drill, used for drilling and polishing.
  #setHand(state, variant) {
    const hand = this.slot('hand');
    const working = variant === 'drill' && this.cast.drillHand ? this.cast.drillHand : this.cast.workingHand;
    const src = state === 'open' ? this.openHand : working;
    hand.hidden = !src;
    if (src) hand.src = src;
    hand.classList.toggle('working', state === 'working');
  }

  #setScene(scene) {
    const art = this.screen.querySelector('.scene-art');
    art.hidden = false;
    art.onerror = () => { art.hidden = true; }; // no image yet: the placeholder shows
    art.src = `assets/scenes/${scene}.png`;
    this.screen.querySelector('.scene-label').textContent = scene;
  }

  #setMessage(text) {
    this.slot('message').textContent = text;
  }

  // Sets up the screen for the step the run just entered.
  #showStep() {
    this.#setMessage('');
    if (this.run.phase === 'pick') {
      this.#setHand('open');
      this.#setTrayEnabled(true);
    } else if (this.run.phase === 'result') {
      this.#setTrayEnabled(false);
      this.#later(() => this.#showResult(), this.run.resultStartsAt - performance.now());
    }
  }

  #onTap(toolId) {
    const outcome = this.run.tap(toolId, performance.now());
    if (outcome.ignored) return;
    play(outcome.correct ? 'correct' : 'wrong');
    if (!outcome.correct) {
      const button = this.#toolButton(toolId);
      button.classList.remove('wrong');
      void button.offsetWidth; // restart the shake
      button.classList.add('wrong');
      this.#setMessage(outcome.hint || 'Not that one. Think about what comes next.');
      return;
    }
    this.#setTrayEnabled(false);
    this.#flyToHand(toolId);
    this.#later(() => this.#showResult(), FLY_MS);
  }

  // The tool flies from the tray to the dentist's hand.
  #flyToHand(toolId) {
    flyTo(this.#toolButton(toolId), this.slot('hand'), this.screen, FLY_MS);
  }

  #showResult() {
    const { result, popup } = this.run.step;
    this.#setHand('working', result.hand);
    this.#setScene(result.scene);
    this.#setMessage(result.message || '');
    if (popup) this.#showPopup(popup);
  }

  #showPopup(text) {
    const box = this.slot('popup');
    box.querySelector('p').textContent = text;
    box.hidden = false;
    box.querySelector('button').onclick = () => {
      box.hidden = true;
      this.run.dismissPopup();
    };
  }

  #loop = () => {
    const now = performance.now();
    if (this.run.tick(now) === 'timeout') this.#onTimeout();
    this.#updateTimer(now);
    if (this.run.canAdvance(now)) {
      this.run.next(now);
      if (this.run.phase === 'done') {
        this.destroy();
        this.onFinish(this.run.score());
        return;
      }
      this.#showStep();
    }
    this.frame = requestAnimationFrame(this.#loop);
  };

  // Time ran out: point at the correct tool, then hand it over for the player.
  #onTimeout() {
    const { pick, hint } = this.run.step;
    play('timeout');
    this.#setTrayEnabled(false);
    this.#toolButton(pick).classList.add('hint');
    this.#setMessage(hint || 'Time is up. This is the next tool.');
    this.#later(() => this.#flyToHand(pick), HINT_MS);
    this.#later(() => this.#showResult(), HINT_MS + FLY_MS);
  }

  #updateTimer(now) {
    const picking = this.run.phase === 'pick';
    this.slot('timer').textContent = picking ? timeLabel(this.run.remainingMs(now)) : '';
    // Only a timed pick can be paused (see ProcedureRun.pause).
    this.screen.querySelector('[data-action="pause"]').disabled = !picking;
  }

  // Freezes the countdown and covers the tray, so the player cannot tap while paused.
  pause() {
    if (!this.run.pause(performance.now())) return;
    this.slot('pause').hidden = false;
  }

  resume() {
    this.run.resume(performance.now());
    this.slot('pause').hidden = true;
  }
}
