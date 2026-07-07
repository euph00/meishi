# EUPH — ユーフ

Personal portfolio / namecard site themed as a
theatrical stage: ink curtains part on load, a playbill-style hero with a
scrolling ticker, an artwork gallery, a blog with generated post pages, and a
dark Curtain Call footer. Mobile-first, English + Japanese, one bold yellow
accent, four-pointed stars throughout.

Built as a **static site with [Vite](https://vite.dev)** no framework.
Day-to-day maintenance is documented in [AGENTS.md](AGENTS.md); the original
design handoff spec is preserved in git history
(`design_handoff_euph_portfolio/`).

## How it works

All page content lives in one data file, `content/site.json`. At build time a
small Vite plugin ([vite.config.js](vite.config.js)) runs
[scripts/render-content.js](scripts/render-content.js), which validates the
JSON (bad content fails the build — nothing broken can deploy), HTML-escapes
it, and injects it into two templates:

- [index.html](index.html) — the main page (`<!-- content:... -->` slots for
  contacts, catchline, ticker, work cards, post rows)
- [post.html](post.html) — the blog post page (`<!-- post:... -->` slots);
  one static page is generated at `posts/<slug>.html` for every post with a
  `slug` (that directory is gitignored build output)

The dev server renders everything on the fly and live-reloads when content or
templates change; `vite build` emits fully static HTML to `dist/`, so the
deployed site needs no JavaScript to show content.

## File map

| Path | Role |
| --- | --- |
| [content/site.json](content/site.json) | **all editable content** (works, posts + bodies, ticker, catchline, contacts) |
| [index.html](index.html) / [post.html](post.html) | page templates |
| [scripts/render-content.js](scripts/render-content.js) | build-time renderer + content validation |
| [vite.config.js](vite.config.js) | wires the renderer into dev/build; generates post pages |
| [src/style.css](src/style.css) | design tokens, layout, all animation keyframes, reduced-motion rules |
| [src/main.js](src/main.js) | index page: ticker loop, curtain cleanup, replayable scroll reveals |
| [src/nav.js](src/nav.js) | stage-sweep page transitions (index ⇄ posts) |
| [src/post.js](src/post.js) | post page entry (transitions only) |
| [public/artwork/](public/artwork/) | web-ready artwork (≤1600px WebP) |
| `art-originals/` | full-resolution sources (gitignored, not deployed) |
| [.github/workflows/](.github/workflows/) | CI: build + deploy to Firebase Hosting |

## Motion & accessibility

Curtain intro on load (skippable via `?intro=0`), camera-dolly and staggered
rise-ins in the hero, a seamless marquee ticker, scroll reveals that replay
when elements re-enter the viewport, directional "stage sweep" transitions
between the index and post pages, and quiet idle motion (spinning badge
stars, bobbing scroll cue, breathing footer emblem, twinkling accent stars).
All of it is disabled under `prefers-reduced-motion`, and every page is fully
readable with JavaScript off.

## Performance

The whole index page is ~30KB of HTML/CSS/JS (gzipped) plus ~200KB of
artwork. Fonts load only the weights in use; artwork ships as ≤1600px WebP
with dimensions baked into the HTML (no layout shift) and lazy loading;
`firebase.json` sets long-lived caching for hashed assets and no-cache for
HTML.

## Develop

```bash
npm install
npm run dev       # dev server
npm run build     # validate content + build to dist/
npm run preview   # serve the production build
```

## Deploy

Pushing to `master` builds and deploys to Firebase Hosting (project
`meishi-site-f3315`) via GitHub Actions; pull requests get preview-channel
deploys. See the pre-deploy checklist in [CLAUDE.md](CLAUDE.md).
