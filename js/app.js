// App shell: screen switching, the selection screen, scores, and the shared disclaimer.
// Each mode is data for an engine; this file never contains procedure content.

import { ProcedureView } from './procedureView.js';
import { SortView } from './sortView.js';

// Engines the shell can start, each with the screen it draws into.
// A mode whose engine is missing here reads "coming soon".
const ENGINES = {
  procedure: { View: ProcedureView, screen: 'game' },
  sort: { View: SortView, screen: 'sort' },
};

const STARS = 5;
const POINTS_PER_STAR = 100 / STARS; // provisional: 20% per star

const $ = (selector, root = document) => root.querySelector(selector);
const screens = Object.fromEntries(
  [...document.querySelectorAll('[data-screen]')].map((el) => [el.dataset.screen, el]),
);

let app = null; // contents of data/app.json
let current = null; // the mode being played: { mode, data }
let view = null; // the running engine view

function show(name) {
  for (const [key, el] of Object.entries(screens)) el.hidden = key !== name;
  if (name === 'selection') updateOverall();
}

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' }); // revalidate: a cached copy must never be stale
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

// ---- Saved best scores (localStorage). The game works if storage is blocked. ----
const bestKey = (modeId) => `going-chairside:best:${modeId}`;
function readBest(modeId) {
  try {
    const value = localStorage.getItem(bestKey(modeId));
    return value === null ? null : Number(value);
  } catch { return null; }
}
function saveBest(modeId, score) {
  try {
    const best = readBest(modeId);
    if (best === null || score > best) localStorage.setItem(bestKey(modeId), String(score));
  } catch { /* storage unavailable: ignore */ }
}

// Provisional rule: the average of the best score in each mode played so far.
function updateOverall() {
  const bests = app.modes.map((m) => readBest(m.id)).filter((b) => b !== null);
  const average = bests.length ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null;
  $('[data-slot="overall"]').textContent = average === null ? '--' : `${average}%`;
}

// ---- Screens ----
function fillSharedText() {
  document.querySelectorAll('[data-text]').forEach((el) => { el.textContent = app[el.dataset.text]; });
}

const isPlayable = (mode) => mode.built && ENGINES[mode.engine];

function buildCredits() {
  const list = $('[data-slot="credits"]');
  list.replaceChildren(...(app.credits ?? []).map((text) => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
}

function buildSelection() {
  const holder = $('[data-slot="modes"]');
  holder.replaceChildren();
  for (const mode of app.modes) {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.textContent = isPlayable(mode) ? mode.title : `${mode.title} (coming soon)`;
    tile.disabled = !isPlayable(mode);
    tile.addEventListener('click', () => openIntro(mode));
    holder.append(tile);
  }
}

// Provisional: the Procedures button lists the steps of each built procedure in order.
async function buildGuide() {
  const holder = $('[data-slot="guide"]');
  holder.replaceChildren();
  for (const mode of app.modes.filter((m) => isPlayable(m) && m.engine === 'procedure')) {
    const data = await loadJson(mode.data);
    const heading = document.createElement('h3');
    heading.textContent = mode.title;
    const list = document.createElement('ol');
    const label = (id) => data.tray.find((t) => t.id === id).label;
    for (const step of data.steps) {
      const item = document.createElement('li');
      item.textContent = step.pick ? label(step.pick) : step.result.message;
      list.append(item);
    }
    holder.append(heading, list);
  }
}

async function openIntro(mode) {
  const data = await loadJson(mode.data);
  current = { mode, data };
  document.querySelectorAll('[data-slot="mode-title"]').forEach((el) => { el.textContent = mode.title; });
  $('[data-slot="instructions"]', screens.intro).textContent = data.instructions ?? '';
  $('[data-slot="intro-note"]', screens.intro).textContent = data.note ?? '';
  show('intro');
}

function beginGame() {
  const { mode, data } = current;
  const { View, screen } = ENGINES[mode.engine];
  view = new View(screens[screen], data, finishGame, app.cast);
  show(screen);
  view.start();
}

function leaveGame() {
  view?.destroy();
  view = null;
  show('selection');
}

// `info` is optional: { detail, note } from engines that have more to say (the sort).
function finishGame(score, info = {}) {
  saveBest(current.mode.id, score);
  const end = screens.end;
  $('[data-slot="score"]', end).textContent = score;
  $('[data-slot="detail"]', end).textContent = info.detail ?? '';
  $('[data-slot="end-note"]', end).textContent = info.note ?? '';
  $('[data-slot="best"]', end).textContent = readBest(current.mode.id) ?? score;
  const earned = Math.floor(score / POINTS_PER_STAR);
  $('[data-slot="stars"]', end).replaceChildren(...Array.from({ length: STARS }, (_, i) => {
    const star = document.createElement('span');
    star.className = i < earned ? 'star filled' : 'star';
    star.textContent = '★';
    return star;
  }));
  view = null;
  show('end');
}

// ---- Buttons, wired by data-* so a redesigned screen only needs the same attributes ----
const actions = {
  'begin-game': beginGame,
  again: () => show('intro'), // the disclaimer screen comes before every game
  back: leaveGame,
  pause: () => view?.pause(),
  resume: () => view?.resume(),
};
document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-goto], [data-action]');
  if (!target) return;
  if (target.dataset.goto) show(target.dataset.goto);
  else actions[target.dataset.action]?.();
});

async function init() {
  app = await loadJson('data/app.json');
  fillSharedText();
  buildSelection();
  buildCredits();
  buildGuide().catch(() => {}); // the guide is optional; the game does not depend on it
  show('opening');
}
init();
