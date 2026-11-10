// Sort engine view: draws a SortRun into the sort screen.
// It owns no rules. Scoring, the hint, the auto-answer and final picks live in sortRun.js.

import { SortRun, MOVE_MS } from './sortRun.js';
import { timeLabel } from './pickClock.js';
import { flyTo } from './fly.js';
import { play } from './sound.js';

const GENERIC_HINT = 'Not sure? Think about how this tool is cleaned.';

export class SortView {
  // `screen` is the <section data-screen="sort"> element; `onFinish(score, info)` is called at the end.
  constructor(screen, data, onFinish) {
    this.screen = screen;
    this.data = data;
    this.onFinish = onFinish;
    this.run = new SortRun(data);
    this.frame = null;
    this.slot = (name) => screen.querySelector(`[data-slot="${name}"]`);
  }

  start() {
    this.slot('banner').textContent = this.data.banner;
    this.#buildBins();
    this.run.start(performance.now());
    this.#showItem();
    this.#loop();
  }

  destroy() {
    this.slot('pause').hidden = true;
    cancelAnimationFrame(this.frame);
    this.screen.querySelectorAll('.flying').forEach((el) => el.remove());
  }

  #buildBins() {
    const holder = this.slot('bins');
    holder.replaceChildren();
    for (const bin of this.data.bins) {
      const button = document.createElement('button');
      button.className = 'bin';
      button.dataset.bin = bin.id;
      button.setAttribute('aria-label', bin.label);
      const img = document.createElement('img');
      img.src = bin.image;
      img.alt = '';
      img.onerror = () => img.remove(); // placeholder art: the label still shows
      const label = document.createElement('span');
      label.textContent = bin.label;
      button.append(img, label);
      button.addEventListener('click', () => this.#onTap(bin.id));
      holder.append(button);
    }
  }

  #binButton(id) {
    return this.slot('bins').querySelector(`[data-bin="${id}"]`);
  }

  #setBinsEnabled(enabled) {
    this.slot('bins').querySelectorAll('.bin').forEach((b) => {
      b.disabled = !enabled;
      b.classList.remove('correct');
    });
  }

  #setMessage(text) {
    this.slot('message').textContent = text;
  }

  #updateCount() {
    this.slot('count').textContent = `${this.run.correctCount}/${this.run.total}`;
  }

  // Shows the item the run just moved to.
  #showItem() {
    const card = this.slot('item');
    const { item } = this.run;
    card.classList.remove('wrong', 'moved');
    card.dataset.item = item.id;
    card.replaceChildren();
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = '';
    img.onerror = () => img.remove(); // placeholder art: the label still shows
    const label = document.createElement('span');
    label.textContent = item.label;
    card.append(img, label);
    this.#setMessage(this.data.prompt);
    this.#setBinsEnabled(true);
    this.#updateCount();
  }

  #onTap(binId) {
    const outcome = this.run.tap(binId, performance.now());
    if (outcome.ignored) return;
    play(outcome.correct ? 'correct' : 'wrong');
    this.#setBinsEnabled(false);
    // A wrong pick is final: the item turns red and the round moves on.
    if (!outcome.correct) this.slot('item').classList.add('wrong');
    this.#setMessage(outcome.correct ? 'Correct' : 'Not quite');
    this.#moveItemTo(binId);
    this.#updateCount();
  }

  // Time ran out: the game sorts the item into the correct bin for the player.
  #onTimeout() {
    const binId = this.run.item.bin;
    play('timeout');
    this.#setBinsEnabled(false);
    this.#binButton(binId).classList.add('correct');
    this.#setMessage('Time is up. It goes here.');
    this.#moveItemTo(binId);
  }

  #moveItemTo(binId) {
    flyTo(this.slot('item'), this.#binButton(binId), this.screen, MOVE_MS);
    this.slot('item').classList.add('moved'); // hidden until the next item, so it reads as sorted
  }

  #loop = () => {
    const now = performance.now();
    const event = this.run.tick(now);
    if (event === 'hint') this.#setMessage(this.run.item.hint || GENERIC_HINT);
    if (event === 'timeout') this.#onTimeout();
    this.#updateTimer(now);
    if (this.run.canAdvance(now)) {
      this.run.next(now);
      if (this.run.phase === 'done') {
        this.destroy();
        this.onFinish(this.run.score(), {
          detail: `${this.run.correctCount} / ${this.run.total} correct`,
          note: this.data.note,
        });
        return;
      }
      this.#showItem();
    }
    this.frame = requestAnimationFrame(this.#loop);
  };

  #updateTimer(now) {
    const picking = this.run.phase === 'pick';
    this.slot('timer').textContent = picking ? timeLabel(this.run.remainingMs(now)) : '';
    this.screen.querySelector('[data-action="pause"]').disabled = !picking;
  }

  pause() {
    if (!this.run.pause(performance.now())) return false;
    this.slot('pause').hidden = false;
    return true;
  }

  resume() {
    this.run.resume(performance.now());
    this.slot('pause').hidden = true;
  }
}
