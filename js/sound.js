// Sound effects (synthesized with the Web Audio API, so no audio files to license) and background music.
// Both engines call play('correct' | 'wrong' | 'timeout'). A page that blocks audio just stays silent.
// Volumes (0 to 1) are set by the sliders in Settings and remembered in localStorage.

let context = null;
const volumes = { sfx: 0.7, music: 0.5 };
for (const key of Object.keys(volumes)) {
  try {
    const saved = localStorage.getItem(`volume-${key}`);
    if (saved !== null) volumes[key] = Math.min(1, Math.max(0, Number(saved)));
  } catch { /* storage unavailable: defaults */ }
}

let music = null; // the looping <audio> element, once a soundtrack path is known

export function getVolume(kind) { return volumes[kind]; }
export function setVolume(kind, value) {
  volumes[kind] = value;
  try { localStorage.setItem(`volume-${kind}`, String(value)); } catch { /* ignore */ }
  if (kind === 'music' && music) music.volume = value;
}

// Sets the soundtrack (path from data/app.json; empty means none).
export function setMusic(path) {
  if (!path) return;
  music = new Audio(path);
  music.loop = true;
  music.volume = volumes.music;
  // Browsers block sound until the player taps something, so start at the first tap.
  document.addEventListener('pointerdown', startMusic, { once: true });
}

// The music plays through the whole app, from the first tap on. Pausing the game pauses it too.
export function startMusic() { music?.play().catch(() => {}); }
export function pauseMusic() { music?.pause(); }

// One short tone: frequency in Hz, start offset and length in seconds, oscillator shape, peak volume.
function tone(freq, start, length, shape = 'sine', volume = 0.2) {
  volume *= volumes.sfx;
  if (volume < 0.001) return;
  const t0 = context.currentTime + start;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = shape;
  osc.frequency.value = freq;
  // Quick attack and a fade-out avoid clicks.
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  osc.connect(gain).connect(context.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.05);
}

const SOUNDS = {
  correct: () => { tone(660, 0, 0.12); tone(880, 0.1, 0.2); },                       // rising two-note chime
  wrong: () => { tone(200, 0, 0.18, 'square', 0.12); tone(150, 0.14, 0.25, 'square', 0.12); }, // low falling buzz
  timeout: () => { tone(440, 0, 0.15, 'triangle'); tone(330, 0.17, 0.15, 'triangle'); tone(247, 0.34, 0.3, 'triangle'); }, // three falling notes
};

export function play(name) {
  if (volumes.sfx === 0 || !SOUNDS[name]) return;
  try {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume(); // phones start audio suspended until a tap
    SOUNDS[name]();
  } catch { /* no audio support: ignore */ }
}
