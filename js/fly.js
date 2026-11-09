// The "pass the tool" animation shared by both engines: a copy of the tapped
// element flies from where it is to the target, then removes itself.

export function flyTo(source, target, host, durationMs) {
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const clone = source.cloneNode(true);
  clone.classList.add('flying');
  Object.assign(clone.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px` });
  host.append(clone);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  clone.animate(
    [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0.9 }],
    { duration: durationMs, easing: 'ease-in-out', fill: 'forwards' },
  ).finished.then(() => clone.remove(), () => clone.remove());
}
