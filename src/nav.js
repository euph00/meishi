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
