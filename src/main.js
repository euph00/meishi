// Scroll reveal — progressive polish on top of already-visible markup.
// Elements below 92% of the viewport at load are hidden, then revealed
// once as they enter the viewport. If JS never runs, nothing is hidden.

import { wireSweep } from './nav.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Returning from a post lands on the notes anchor: jump there instantly
// (the sweep overlay hides the jump) instead of smooth-scrolling the
// whole page, then let smooth scrolling back for in-page links.
if (document.documentElement.classList.contains('arriving-back') && location.hash) {
  document.documentElement.style.scrollBehavior = 'auto';
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView();
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = '';
  }, 400);
}
wireSweep();

// Curtains are a fixed full-viewport overlay; drop them from the DOM once the
// intro finishes so no invisible fixed layers stick around.
document.querySelectorAll('.curtain').forEach((el) => {
  el.addEventListener('animationend', () => el.remove(), { once: true });
});

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
  // elements already in view at load stay put (no entrance on first paint)
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > vh * 0.92) el.classList.add('js-reveal');
  });

  // Replayable reveals: entering past the 12% threshold plays the entrance;
  // leaving the viewport completely re-arms it (hidden again while
  // off-screen), so the animation plays each time the element comes back.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
        if (isIntersecting && intersectionRatio >= 0.12) {
          if (target.classList.contains('js-reveal')) {
            target.classList.remove('js-reveal');
            target.classList.add('is-revealed');
          }
        } else if (!isIntersecting) {
          target.classList.remove('is-revealed');
          target.classList.add('js-reveal');
        }
      });
    },
    { threshold: [0, 0.12] }
  );
  els.forEach((el) => io.observe(el));

  // A finished-but-filling entrance animation keeps owning `transform`,
  // which would suppress the card/row hover transitions (they'd jump
  // instead of easing). Drop the class once the entrance ends; the
  // observer re-arms it with .js-reveal when the element leaves view.
  document.addEventListener('animationend', (e) => {
    if (e.animationName === 'revealMove') e.target.classList.remove('is-revealed');
  });
}
