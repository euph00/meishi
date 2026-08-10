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

// The compact mobile program menu closes after choosing an in-page act.
const heroMenu = document.querySelector('.hero__menu');
const wideMenu = window.matchMedia('(min-width: 700px)');
const syncHeroMenu = () => {
  if (!heroMenu) return;
  heroMenu.toggleAttribute('open', wideMenu.matches);
};
syncHeroMenu();
wideMenu.addEventListener('change', syncHeroMenu);
heroMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (!wideMenu.matches) heroMenu.removeAttribute('open');
  });
});

// The native details remain independent, so zero, one, or several pieces can
// be expanded at every viewport size. JS adds reversible height transitions;
// without it, the complete native accordion remains available.
const workGrid = document.querySelector('.work-grid');
if (workGrid) {
  const cards = Array.from(workGrid.querySelectorAll('.work-card'));
  const cardStates = new WeakMap();

  const cleanContentStyles = (content) => {
    content.style.removeProperty('height');
    content.style.removeProperty('overflow');
  };

  const settleCard = (card, shouldOpen) => {
    const state = cardStates.get(card);
    // Hide a closing panel before releasing its filled animation, so its
    // natural height can never flash for a frame at the hand-off.
    if (!shouldOpen) card.open = false;
    if (state?.animation) {
      state.animation.onfinish = null;
      state.animation.cancel();
    }
    if (shouldOpen) card.open = true;
    card.classList.remove('is-collapsing');
    cleanContentStyles(card.querySelector('.work-card__content'));
    cardStates.delete(card);
  };

  const setCardOpen = (card, shouldOpen) => {
    const content = card.querySelector('.work-card__content');
    if (!content) return;

    const prior = cardStates.get(card);
    const startHeight = card.open ? content.getBoundingClientRect().height : 0;
    const computed = card.open ? getComputedStyle(content) : null;
    const startOpacity = computed ? computed.opacity : '0';
    const startTransform = computed ? computed.transform : 'translateY(10px)';
    if (prior?.animation) {
      prior.animation.onfinish = null;
      prior.animation.cancel();
    }

    cardStates.set(card, { target: shouldOpen, animation: null });
    card.classList.toggle('is-collapsing', !shouldOpen);
    if (shouldOpen) card.open = true;

    if (reduceMotion || !content.animate) {
      settleCard(card, shouldOpen);
      return;
    }

    const endHeight = shouldOpen ? content.scrollHeight : 0;
    content.style.height = `${startHeight}px`;
    content.style.overflow = 'clip';
    const animation = content.animate(
      [
        {
          height: `${startHeight}px`,
          opacity: startOpacity,
          transform: startTransform === 'none' ? 'translateY(0)' : startTransform,
        },
        {
          height: `${endHeight}px`,
          opacity: shouldOpen ? 1 : 0,
          transform: shouldOpen ? 'translateY(0)' : 'translateY(-8px)',
        },
      ],
      {
        duration: shouldOpen ? 480 : 420,
        easing: shouldOpen ? 'cubic-bezier(.16, 1, .3, 1)' : 'cubic-bezier(.4, 0, .2, 1)',
        fill: 'both',
      }
    );
    cardStates.set(card, { target: shouldOpen, animation });
    animation.onfinish = () => {
      settleCard(card, shouldOpen);
    };
  };

  cards.forEach((card) => {
    card.querySelector('summary')?.addEventListener('click', (event) => {
      event.preventDefault();
      const shouldOpen = !(cardStates.get(card)?.target ?? card.open);
      setCardOpen(card, shouldOpen);
    });
  });
}

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
  // view, mirroring the section-reveal state machine: once the hero is
  // fully off-screen its entrance animations are rewound to their hidden
  // from-state and PAUSED (invisible, since nothing is on screen), then
  // simply played when the hero is ~30% visible again — elements are
  // already hidden when they scroll in, so nothing visible ever blinks
  // out. The original delays are tuned to follow the curtain intro, so
  // replays compress that lead-in out (keeping the stagger). Excluded:
  // the ticker subtree (the marquee is continuously meaningful and is the
  // first thing visible when scrolling back up — it must never vanish),
  // the bob loop, the dolly, and the scroll-driven dim.
  //
  // shimmer IS included even though it's an idle loop: it sits after pop
  // in the cluster stars' animation list, so left running it overrides
  // the pop's opacity/scale and the replay degrades to a plain fade.
  // Rewound, its fill:none delay keeps it silent until the pop finishes —
  // the same hand-off as first load. (Within the hero, shimmer exists
  // only on the cluster stars.)
  const hero = document.querySelector('.hero');
  if (hero && hero.getAnimations) {
    const ENTRANCES = new Set(['rise', 'charIn', 'ruleDraw', 'contactChildIn', 'pop', 'shimmer']);
    const INTRO_LEAD_MS = 1250; // earliest entrance delay (the title)
    const originalDelay = new WeakMap();
    let armed = false;
    const entranceAnims = () =>
      hero.getAnimations({ subtree: true }).filter(
        (a) =>
          ENTRANCES.has(a.animationName) &&
          !(a.effect.target && a.effect.target.closest('.ticker'))
      );
    const rewindAndHold = () => {
      for (const a of entranceAnims()) {
        if (!originalDelay.has(a)) originalDelay.set(a, a.effect.getTiming().delay);
        a.effect.updateTiming({
          delay: Math.max(0, (originalDelay.get(a) - INTRO_LEAD_MS) * 0.8),
        });
        // pause() BEFORE rewinding: a pause is otherwise pending until the
        // next frame and the animation keeps advancing meanwhile, freezing
        // ~17ms into the entrance instead of at the hidden from-state;
        // setting currentTime on a pause-pending animation commits the
        // pause synchronously at exactly that time.
        a.pause();
        a.currentTime = 0;
      }
    };
    const playHeld = () => {
      for (const a of entranceAnims()) {
        if (a.playState === 'paused') a.play();
      }
    };
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) {
            armed = true;
            rewindAndHold();
          } else if (armed && e.intersectionRatio >= 0.3) {
            armed = false;
            playHeld();
          }
        });
      },
      { threshold: [0, 0.3] }
    ).observe(hero);
  }
}
