# EUPH — ユーフ作品集

Personal portfolio / namecard site for the artist **Euph**, themed as a theatrical
stage: ink curtains part on load, a playbill-style hero, a recent-work gallery
(Act I), a blog index (Act II — Notes from the Wings), and a dark Curtain Call
footer. Mobile-first, one responsive layout, English + Japanese.

Built as a static site with [Vite](https://vite.dev) — no framework. The design
reference lives in [design_handoff_euph_portfolio/](design_handoff_euph_portfolio/).

## Structure

- [index.html](index.html) — all page content (hero, Act I artwork cards, Act II post rows, footer)
- [src/style.css](src/style.css) — design tokens, layout, keyframe animations, reduced-motion rules
- [src/main.js](src/main.js) — scroll-reveal (progressive enhancement; content stays visible without JS)
- [public/assets/](public/assets/) — emblem watermark SVGs (ink / yellow)
- [public/artwork/](public/artwork/) — placeholder artwork images

## Editing content

- **Artwork**: drop real images (4:5 crop) into `public/artwork/` and update the
  six `.work-card` figures in `index.html` (image `src`, `alt`, title, `NN — YYYY` meta).
- **Blog posts**: each post is a `.post-row` anchor in `index.html`
  (date, tag, title, excerpt). Point `href` at real post pages once they exist.
- **Social links**: the Twitter / Email / GitHub URLs appear twice (hero + footer)
  and are still the handoff placeholders.

## Develop

```bash
npm install
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

Append `?intro=0` to the URL to skip the curtain intro. The intro and all motion
are also skipped automatically under `prefers-reduced-motion`.

## Deploy

Pushing to `master` triggers GitHub Actions
([.github/workflows/](.github/workflows/)), which runs `npm ci && npm run build`
and deploys `dist/` to Firebase Hosting (project `meishi-site-f3315`). PRs get a
preview channel deploy.
