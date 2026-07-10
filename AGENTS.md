# EUPH portfolio — maintainer guide

One-page artist portfolio ("Stage" theme: paper/ink/yellow, four-pointed star
motif, EN+JP) plus generated blog post pages. Static Vite build, no framework.
Pushing `master` deploys to production via GitHub Actions → Firebase Hosting.

## The one rule

**Routine updates (artwork, posts, ticker, catchline, contact links) are edits
to `content/site.json` and image files only.** Templates, CSS, and JS are the
design — do not touch them for content changes, and do not restyle or retime
anything unless explicitly asked. The design is final; its tokens, spacing,
and animation timings are encoded in `src/style.css` (the original handoff
spec is in git history under `design_handoff_euph_portfolio/` if ever needed).

## How the site is built

```
content/site.json ──┐
index.html  ────────┼─→ scripts/render-content.js ─→ dist/index.html
post.html   ────────┘   (via vite.config.js plugin)  dist/posts/<slug>.html
src/*.css, src/*.js ──→ hashed bundles in dist/assets/
public/* ────────────→ copied verbatim (artwork, favicon, emblem)
```

- `index.html` / `post.html` are templates with `<!-- content:... -->` /
  `<!-- post:... -->` placeholders; the renderer fills them at build time.
- The renderer **validates everything and fails the build with a
  `content/site.json: ...` message** on bad data, so a broken edit cannot
  deploy. Always run `npm run build` after editing to see errors.
- All injected text is HTML-escaped; write plain text in site.json, not HTML.
- `posts/*.html` at the repo root is **generated build output** (gitignored).
  Never edit it — change `post.html` (layout) or `site.json` (content).

## content/site.json schema

| Key | Shape | Notes |
| --- | --- | --- |
| `hero.catchline` | array of strings | one string per line of the hero quote; plain text only — the renderer splits it into per-character animated spans automatically (JP chars wrap freely, Latin words stay whole, closing punctuation never starts a line, and a hidden plain copy is kept for screen readers) |
| `ticker` | array of strings | marquee items; JP items are auto-detected and get JP font styling + `lang="ja"` |
| `contacts` | `{label, href, icon}` | `icon`: `x` \| `mail` \| `branch`; rendered in hero **and** footer |
| `works` | `{title, date, image, alt?, meta?, link?}` | see below |
| `posts` | `{date, tag, title, excerpt, slug+body OR href}` | see below |

### works

- Array order = display order. The `NN` in the `NN — MM.YYYY` caption is the
  array position (auto-renumbers on add/remove); `date` is free-form,
  convention `MM.YYYY`; `meta` replaces the whole caption label if set.
- `image`: root-relative path under `public/` (e.g. `/artwork/piece.webp`).
  The frame takes the piece's own aspect ratio — dimensions are read at build
  time, any ratio works.
- `link` (optional, must be `http(s)://…`): makes the whole card an external
  link (e.g. the piece's Twitter post), marked with ↗.
- `alt` defaults to `title`.

### posts

- `date` must be `YYYY.MM.DD`. The list displays newest-first automatically.
- Exactly one of:
  - `slug` (lowercase letters/digits/hyphens, unique) + `body` → a page is
    generated at `/posts/<slug>.html` and the row links to it with the
    stage-sweep transition;
  - `href` → the row is a plain link (external URL or `#notes` placeholder).
- `body` is an array of blocks:
  - `"plain string"` → paragraph
  - `{"h2": "…"}` → subheading (yellow star + serif)
  - `{"quote": "…"}` → pull quote

## Task recipes

### Add artwork
1. Downscale to ≤1600px on the long edge (Lanczos or similar) and encode as
   WebP quality ~90. Never ship the full-res original: multi-MB files are slow
   and the browser's fast downscaling visibly aliases fine lineart.
2. Keep the original in `art-originals/` (gitignored, not deployed).
3. Put the WebP in `public/artwork/` under a **new filename** (artwork is
   CDN-cached for 7 days — reusing a filename serves stale images).
4. Add the `works` entry (usually prepend — newest first by convention).
5. `npm run build` (validates), then `npm run preview` and check `/#work`.

### Add a blog post
1. Append a `posts` entry with `slug` and `body` (order doesn't matter —
   display is sorted by `date`).
2. `npm run build`, then check `/posts/<slug>.html` in the preview: title,
   meta line, body blocks, and the ← BACK link.
3. Check the row on the index page and its forward/back transition.

### Everything else
Ticker items, catchline lines, contact links: edit the arrays in place.
Remove any card/post/item by deleting its entry — numbering and sorting fix
themselves.

## Commands

- `npm run dev` — dev server; renders posts on the fly, reloads on
  `site.json` / `post.html` changes
- `npm run build` — validate content + build to `dist/`
- `npm run preview` — serve `dist/` locally

## Pre-deploy checklist

1. `npm run build` passes (content validation happens here).
2. `npm run preview`, then click through: curtain intro plays and the hero
   text ripples in letter-by-letter; ticker loops with no gap; scrolling
   draws the section rules and plays the yellow title swipes; artwork cards
   open their links in a new tab; a post row sweeps forward and ← BACK
   sweeps back to the notes list.
3. Narrow the window to ~390px: no horizontal scrolling anywhere.
4. No image in `public/` over ~400KB.

## Deploying

- **Any push to `master` deploys to production** (GitHub Actions →
  Firebase Hosting, project `meishi-site-f3315`). Commit freely; push only
  when the change should go live.
- Pull requests get a temporary preview-channel deploy automatically.
- Caching (set in `firebase.json`): HTML no-cache, `/assets/**` immutable
  (safe — Vite content-hashes them), `/artwork/**` 7 days, root SVGs 1 day.
  Consequence: never place unhashed files in `public/assets/` (that URL
  namespace is cache-immutable), and give updated artwork a new filename.

## Design system (change only when asked)

- Tokens (colors, fonts, spacing, easings) are CSS custom properties at the
  top of `src/style.css`.
- Motion inventory:
  - **Curtain intro** — full-viewport, once per external visit; `?intro=0`
    skips; curtains self-remove from the DOM after playing.
  - **Typographic entrances** — the hero title, subtitle, and catchline enter
    one character at a time (`charIn` overshoot-settle); contacts
    micro-stagger; hairline rules draw themselves in (`ruleDraw` — timed in
    the hero/post page, reveal-tied elsewhere); the star cluster pops
    (`pop`) then hands off to its shimmer loops.
  - **Section reveals** — replayable: elements reveal once they clear the
    bottom 15% of the viewport (`revealIO` in `src/main.js`) and re-arm only
    after leaving the screen entirely (`armIO`); `.is-revealed` is dropped on
    `revealMove` animationend so hover transitions aren't suppressed —
    **any reveal-tied animation must finish within .9s** or it gets cut.
    Section titles run the yellow paint-and-depart swipe (`actEmSwipe` +
    `actEmReveal`, kept in lockstep) on every reveal.
  - **Stage-sweep page transitions** — ink panel with yellow lining, up =
    into a post, down = back; bfcache restores handled via `pageshow`.
  - **Scroll-driven** — hero dims as you scroll past (`@supports
    (animation-timeline: view())`, no-op elsewhere). `.hero` must keep
    `overflow: clip` (NOT `hidden` — that creates a scroll container and
    freezes the `view()` timeline).
  - **Ticker marquee** — the renderer repeats the group at build time so wide
    screens never see the loop seam, scaling `--tick-duration` so speed stays
    one group per 16s; no runtime JS.
  - **Idle touches** — badge-star spin, SCROLL ↓ bob, footer emblem breathe,
    yellow star twinkle.
- **Every animation must stay disabled under `prefers-reduced-motion`.** Two
  safe patterns: (a) add the selector to the media block at the bottom of
  `style.css` with **matching specificity**, or (b) tie the animation to
  `.is-revealed` — main.js never applies reveal classes under reduced motion,
  so those selectors simply never match. Keyframes that animate *to* the
  element's natural state (like `ruleDraw`, `revealFade`) leave content
  correctly visible wherever they never run.
- Fonts are Google Fonts with only the used weights loaded (Archivo 400/600,
  Instrument Serif 400+italic, Shippori Mincho 400/500, Zen Kaku Gothic New
  400/500/700). If you use a new weight in CSS, add it to the `<link>` in
  **both** `index.html` and `post.html`; JP fallbacks in the font stacks
  (`--serif`, `--sans`, `--mono`) must stay.
- Scroll reveals and the sweep are progressive enhancement: content must
  remain fully visible and navigable with JS disabled.

## Gotchas

- **The hero title (`Euph`) and subtitle (`ユーフ`) are hand-split into
  per-character spans in `index.html`** (`.h1-l` / `.sub-ch`, with
  `aria-label` on the parent and `aria-hidden` spans). Changing either string
  means re-splitting the spans and updating the `aria-label`; the subtitle's
  stagger covers a 4th+ character via `:nth-child(n+4)`, but a much longer
  string deserves its own delay steps. The catchline needs none of this —
  its splitting is automatic in the renderer.
- The old Firestore message-board feature was removed from this repo, but the
  Firebase project may still hold its deployed rules/data — managing that is
  a Firebase-console task, not a repo task.
- `?intro=0` query param skips the curtain intro (useful for quick checks).
- The dev server and the built site behave identically for content, but only
  the build writes `posts/*.html` to disk.
- **Design-experiment branches** (`proto/*`) are kept on purpose — don't
  delete them. Unmerged material that can be revisited: multi-slat sweep and
  curtain yellow-trim in `proto/stage-transitions`; followspot, stardust,
  card hover sparkle, and footer-emblem parallax in `proto/ambient-stage`.
