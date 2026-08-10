# EUPH — ユーフ

Personal portfolio / namecard site themed as a
theatrical stage: ink curtains part on load, a playbill-style hero with a
fixed-label event marquee, a program-style accordion artwork gallery, a blog
with generated post pages, and a dark Curtain Call footer. Mobile-first,
English + Japanese, one bold yellow accent, four-pointed stars throughout.

Built as a **static site with [Vite](https://vite.dev)** — no framework.
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

Artwork rows use committed generated assets: `npm run washes` reduces each
complete artwork—not a crop—to a pre-blurred 96×24 WebP color field. The build
derives its filename from `works[].image` and fails if it is missing, the wrong
size, or over 4KB. CI validates these files but never generates them.

## File map

| Path | Role |
| --- | --- |
| [content/site.json](content/site.json) | **all editable content** (works, posts + bodies, ticker, catchline, contacts) |
| [index.html](index.html) / [post.html](post.html) | page templates |
| [scripts/render-content.js](scripts/render-content.js) | build-time renderer + content validation (incl. per-character catchline splitting, ticker source markup, per-post OG/Twitter meta) |
| [scripts/artwork-washes.mjs](scripts/artwork-washes.mjs) | shared wash filename, dimension, and byte-limit contract |
| [scripts/generate-cards.mjs](scripts/generate-cards.mjs) | renders 1200×630 social-preview cards per post (`npm run cards`, local-only) |
| [scripts/generate-washes.mjs](scripts/generate-washes.mjs) | renders tiny pre-blurred accordion color fields (`npm run washes`, local-only) |
| [public/cards/](public/cards/) | committed link-preview card images, one per post |
| [vite.config.js](vite.config.js) | wires the renderer into dev/build; generates post pages |
| [src/style.css](src/style.css) | design tokens, layout, all animation keyframes, reduced-motion rules |
| [src/main.js](src/main.js) | index page: native-scroll ticker, gallery/menu interactions, curtain cleanup, replayable scroll reveals |
| [src/nav.js](src/nav.js) | stage-sweep page transitions (index ⇄ posts) |
| [src/post.js](src/post.js) | post page entry (transitions only) |
| [public/artwork/](public/artwork/) | web-ready artwork (≤1600px WebP) |
| [public/artwork/previews/](public/artwork/previews/) | committed 96×24 WebP color washes, derived from the complete artworks |
| `art-originals/` | full-resolution sources (gitignored, not deployed) |
| [.github/workflows/](.github/workflows/) | CI: build + deploy to Firebase Hosting |

## Motion & accessibility

Curtain intro on load (skippable via `?intro=0`), then a typographic
overture: the title, subtitle, and catchline enter one character at a time
with an overshoot-settle, hairline rules draw themselves in, and the star
cluster pops before settling into its shimmer. Scrolling brings replayable
reveals (triggered once elements clear the bottom 15% of the viewport,
re-armed when they fully leave), section titles unveiled by a yellow
paint-and-depart swipe, a hero that dims as you scroll past it
(CSS scroll-driven, progressively enhanced), a continuous seamless event
marquee across mobile and desktop,
directional yellow-lined "stage sweep" transitions between the index and
post pages (browser back/forward included), and quiet idle motion
(spinning badge stars, breathing footer emblem, twinkling accent stars). All
of it is disabled under
`prefers-reduced-motion`, and every page is fully readable with
JavaScript off.

## Artwork workflow

Add the optimized full artwork under `public/artwork/`, add its `works` entry
to `content/site.json`, then run `npm run washes`. Commit both the full artwork
and generated file under `public/artwork/previews/`. The accordion uses only
the tiny wash in its closed row; the initially expanded artwork loads eagerly,
while other full images stay lazy until their panels are relevant.

The wash generator uses the repository's existing Playwright dependency. Run
`npx playwright install chromium` once on an authoring machine. It is not a CI
step: both Firebase workflows run `npm ci && npm run build` against committed
assets. See [AGENTS.md](AGENTS.md) for the complete add/remove checklist and
local Chromium dependency note.

## Link previews

Post pages ship Open Graph / Twitter Card metadata with canonical URLs and a
per-post 1200×630 card image in the site's visual style (generated by
`npm run cards` and committed; if a card is missing the build warns and the
preview falls back to text-only). The homepage uses
`public/social-preview.png`. Post bodies support a deliberately tiny
markup set — `**bold**`, `*italic*`, `{"pull": …}` standout quotes, and an
excerpt that doubles as the lede and preview description.

## Performance

The index HTML/CSS/JS shell is roughly 14KB gzipped before fonts and artwork.
Fonts load only the weights in use; artwork ships as ≤1600px WebP with
dimensions baked into the HTML (no layout shift) and lazy loading. Accordion
rows use ≤4KB pre-blurred derivatives, with no runtime filters or need to fetch
closed panels' full artwork. The current four washes total 2,680 bytes and
decode to 36KB. `firebase.json` sets long-lived caching for hashed assets and
no-cache for HTML.

## Develop

```bash
npm install
npx playwright install chromium  # once; only for cards/washes authoring
npm run dev       # dev server
npm run build     # validate content + build to dist/
npm run washes    # regenerate artwork-row color washes
npm run cards     # regenerate generated-post social cards
npm run preview   # serve the production build
```

## Deploy

Pushing to `master` builds and deploys to Firebase Hosting (project
`meishi-site-f3315`) via GitHub Actions; pull requests get preview-channel
deploys. See the pre-deploy checklist in [AGENTS.md](AGENTS.md).
