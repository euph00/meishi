// Stage-sweep page transitions: an ink panel wipes up when moving deeper
// (index → post) and down when coming back. The departing page plays the
// cover animation, stores the direction in sessionStorage, and navigates;
// the arriving page starts covered (class set pre-paint by the inline head
// script) and reveals in the same direction. Links opt in via data-nav="fwd"
// or data-nav="back"; without JS or under prefers-reduced-motion they are
// plain links.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function wireSweep() {
  const sweep = document.querySelector('.sweep');
  const html = document.documentElement;
  if (!sweep || reduceMotion) {
    html.classList.remove('arriving', 'arriving-back');
    return;
  }

  // entrance: reveal the page the sweep is covering
  const dir = html.classList.contains('arriving-back')
    ? 'back'
    : html.classList.contains('arriving')
      ? 'fwd'
      : null;
  if (dir) {
    const cls = dir === 'back' ? 'sweep--reveal-down' : 'sweep--reveal-up';
    requestAnimationFrame(() => {
      sweep.classList.add(cls);
      sweep.addEventListener(
        'animationend',
        () => {
          html.classList.remove('arriving', 'arriving-back');
          sweep.classList.remove(cls);
        },
        { once: true }
      );
    });
  }

  // Browser back/forward can restore this page from the bfcache exactly as
  // it was left: frozen mid-exit with the sweep still covering the screen
  // (the cover animation fills forwards). Turn that stuck cover into the
  // matching reveal so the gesture reads as the designed transition —
  // returning after leaving forward reveals downward, and vice versa.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    html.classList.remove('arriving', 'arriving-back');
    const coveredBy = sweep.classList.contains('sweep--cover-up')
      ? 'up'
      : sweep.classList.contains('sweep--cover-down')
        ? 'down'
        : null;
    sweep.classList.remove('sweep--reveal-up', 'sweep--reveal-down');
    if (coveredBy) {
      // add the reveal before dropping the cover (same style recalc) so the
      // page is never shown uncovered for a frame in between
      const cls = coveredBy === 'up' ? 'sweep--reveal-down' : 'sweep--reveal-up';
      sweep.classList.add(cls);
      sweep.addEventListener('animationend', () => sweep.classList.remove(cls), { once: true });
    }
    sweep.classList.remove('sweep--cover-up', 'sweep--cover-down');
  });

  // exit: cover the page, then navigate
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[data-nav]');
    if (!link) return;
    e.preventDefault();
    const back = link.dataset.nav === 'back';
    try {
      sessionStorage.setItem('euph-nav', back ? 'back' : 'fwd');
    } catch { /* transition still plays; arrival is just uncovered */ }
    const href = link.href;
    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      location.assign(href);
    };
    sweep.classList.add(back ? 'sweep--cover-down' : 'sweep--cover-up');
    sweep.addEventListener('animationend', go, { once: true });
    setTimeout(go, 650); // fallback if animationend never fires
  });
}
