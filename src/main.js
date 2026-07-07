// Scroll reveal — progressive polish on top of already-visible markup.
// Elements below 92% of the viewport at load are hidden, then revealed
// once as they enter the viewport. If JS never runs, nothing is hidden.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Ticker: the -50% loop is only seamless while half the track is at least as
// wide as the screen. One group is ~640px, so the two static groups cover
// phones but leave the right side of wide desktops empty near the loop point.
// Clone the group until half the track clears 4K, and stretch the duration by
// the same factor so the speed stays at one group per 16s.
const track = document.querySelector('.ticker__track');
if (track && track.children.length === 2) {
  const GROUPS = 12; // half = 6 groups ≈ 3800px+
  const group = track.firstElementChild;
  for (let i = track.children.length; i < GROUPS; i++) {
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }
  track.style.setProperty('--tick-duration', `${(16 * GROUPS) / 2}s`);
}

if (!reduceMotion && 'IntersectionObserver' in window) {
  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  const vh = window.innerHeight;
  const hidden = els.filter((el) => el.getBoundingClientRect().top > vh * 0.92);

  hidden.forEach((el) => el.classList.add('js-reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        reveal(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  hidden.forEach((el) => io.observe(el));
}

function reveal(el) {
  el.classList.add('is-revealed');
  // Once the entrance transition finishes, drop the reveal classes so
  // hover transitions (card lift, row slide) run at their own timing.
  const cleanup = () => {
    el.classList.remove('js-reveal', 'is-revealed');
    el.removeEventListener('transitionend', onEnd);
    clearTimeout(timer);
  };
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === 'transform') cleanup();
  };
  el.addEventListener('transitionend', onEnd);
  const timer = setTimeout(cleanup, 1100);
}
