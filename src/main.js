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

  // The hero replays its entrance choreography when it comes back into
  // view: armed once fully off-screen, replayed at ~30% visible. The
  // original delays are tuned to follow the curtain intro, so replays
  // compress that lead-in out (keeping the stagger). Only entrance
  // animations replay — idle loops (ticker, shimmer, bob), the dolly, and
  // the scroll-driven dim are left untouched.
  const hero = document.querySelector('.hero');
  if (hero && hero.getAnimations) {
    const ENTRANCES = new Set(['rise', 'charIn', 'ruleDraw', 'contactChildIn', 'pop']);
    const INTRO_LEAD_MS = 1250; // earliest entrance delay (the title)
    const originalDelay = new WeakMap();
    let armed = false;
    const replayHero = () => {
      for (const a of hero.getAnimations({ subtree: true })) {
        if (!ENTRANCES.has(a.animationName)) continue;
        if (!originalDelay.has(a)) originalDelay.set(a, a.effect.getTiming().delay);
        a.effect.updateTiming({
          delay: Math.max(0, (originalDelay.get(a) - INTRO_LEAD_MS) * 0.8),
        });
        a.currentTime = 0;
        a.play();
      }
    };
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) armed = true;
          else if (armed && e.intersectionRatio >= 0.3) {
            armed = false;
            replayHero();
          }
        });
      },
      { threshold: [0, 0.3] }
    ).observe(hero);
  }
}
