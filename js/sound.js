// Sound effects, synthesized with the Web Audio API so there are no audio files to license or load.
// Both engines call play('correct' | 'wrong' | 'timeout'). A page that blocks audio just stays silent.

let context = null;
let muted = false;
try { muted = localStorage.getItem('muted') === '1'; } catch { /* storage unavailable: sound stays on */ }

export function isMuted() { return muted; }
export function setMuted(value) {
  muted = value;
  try { localStorage.setItem('muted', value ? '1' : '0'); } catch { /* ignore */ }
}

// One short tone: frequency in Hz, start offset and length in seconds, oscillator shape, peak volume.
function tone(freq, start, length, shape = 'sine', volume = 0.2) {
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
  if (muted || !SOUNDS[name]) return;
  try {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume(); // phones start audio suspended until a tap
    SOUNDS[name]();
  } catch { /* no audio support: ignore */ }
}
