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

if (!reduceMotion && 'IntersectionObserver' in window) {
  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  const vh = window.innerHeight;
  // elements already in view at load stay put (no entrance on first paint)
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > vh * 0.92) el.classList.add('js-reveal');
  });

  // Replayable reveals, two observers with different roots:
  // - reveal fires only once the element has cleared the bottom 15% of the
  //   viewport, so entrances play where they can actually be seen instead
  //   of finishing at the screen's edge (thin rows/rules used to trigger
  //   the moment their top edge peeked in);
  // - re-arm uses the full viewport, so an element is only re-hidden once
  //   it has left the screen entirely (never a visible blink-out).
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting && target.classList.contains('js-reveal')) {
          target.classList.remove('js-reveal');
          target.classList.add('is-revealed');
        }
      });
    },
    { rootMargin: '0px 0px -15% 0px' }
  );
  const armIO = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) {
        target.classList.remove('is-revealed');
        target.classList.add('js-reveal');
      }
    });
  });
  els.forEach((el) => {
    revealIO.observe(el);
    armIO.observe(el);
  });

  // A finished-but-filling entrance animation keeps owning `transform`,
  // which would suppress the card/row hover transitions (they'd jump
  // instead of easing). Drop the class once the entrance ends; the
  // observer re-arms it with .js-reveal when the element leaves view.
  document.addEventListener('animationend', (e) => {
    if (e.animationName === 'revealMove') e.target.classList.remove('is-revealed');
  });
}
