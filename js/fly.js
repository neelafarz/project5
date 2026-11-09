// The "pass the tool" animation shared by both engines: a copy of the tapped
// element flies from where it is to the target, then removes itself.
// The copy keeps the element's size and tilt, so a tool lying at an angle flies at that angle.

export function flyTo(source, target, host, durationMs) {
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const centerX = from.left + from.width / 2;
  const centerY = from.top + from.height / 2;
  const width = source.offsetWidth; // the layout size, before any tilt
  const height = source.offsetHeight;

  const clone = source.cloneNode(true);
  clone.classList.remove('positioned');
  clone.classList.add('flying');
  clone.style.cssText = '';
  Object.assign(clone.style, {
    left: `${centerX - width / 2}px`,
    top: `${centerY - height / 2}px`,
    width: `${width}px`,
    height: `${height}px`,
    rotate: getComputedStyle(source).rotate,
  });
  host.append(clone);

  const dx = to.left + to.width / 2 - centerX;
  const dy = to.top + to.height / 2 - centerY;
  clone.animate(
    [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity: 0.9 }],
    { duration: durationMs, easing: 'ease-in-out', fill: 'forwards' },
  ).finished.then(() => clone.remove(), () => clone.remove());
}
