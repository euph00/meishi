# @euph/ui — the "Stage" design system

React components extracted from the [EUPH portfolio site](../README.md). Same
theatrical "Stage" language — paper / ink / one bold yellow, the four-pointed
star motif, bilingual EN + JP, editorial serif display type — packaged as
reusable, typed components you can drop into any React app.

The CSS is lifted **verbatim** from the site's `src/style.css` (tokens, spacing,
animations, reduced-motion rules), so the library and the site stay
pixel-identical. Component boundaries and prop shapes follow the original
Claude Design handoff that the site itself was built from.

## Install & use

```bash
npm install   # from this directory
```

```tsx
import { SectionHeader, DisplayTitle, WorkCard } from '@euph/ui';
import '@euph/ui/styles.css';           // tokens + all component styles

function Gallery() {
  return (
    <section className="euph">          {/* base layer: paper bg, ink text, default font */}
      <SectionHeader label="Illustrations" jp="近作" draw />
      <DisplayTitle swipe>Recent <em>Work</em></DisplayTitle>
      <WorkCard title="ぷろでゅーさー♡" meta="01 — 07.2026"
                image="/artwork/piece.webp" href="https://x.com/…" />
    </section>
  );
}
```

**Two things every consumer needs:**

1. **The stylesheet.** Import `@euph/ui/styles.css` once. It carries the design
   tokens (`:root { --paper … }`), the `.euph` base layer, shared keyframes, and
   every component's styles. Components render **unstyled** without it — the
   token custom properties live here, not in the JS.
2. **The fonts.** The system uses Google Fonts. Add this to your `<head>`
   (only the weights in use):

   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;600&family=Shippori+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">
   ```

   JP fallbacks are baked into the font stacks (`--serif`, `--sans`, `--mono`),
   so JP glyphs render even before/without the webfonts.

## The styling idiom

- **Tokens are CSS custom properties**, defined on `:root` in
  [`src/styles/tokens.css`](src/styles/tokens.css). Colour: `--paper`, `--ink`,
  `--yellow`, `--link-hover`, plus ink/paper alpha ramps (`--ink-25 … --ink-85`,
  `--paper-25 … --paper-60`). Type: `--serif`, `--jp-serif`, `--sans`,
  `--jp-sans`, `--mono`. Layout/motion: `--pad-x`, `--ease-spring`,
  `--ease-curtain`.
- **Component classes are prefixed `euph-`** and shipped as one stylesheet — you
  don't write them by hand; you use the components. Read
  [`src/styles/tokens.css`](src/styles/tokens.css) and any component's `.css`
  before restyling.
- **`.euph` is the opt-in base layer** — put it on a wrapping element to get the
  paper background, ink text, and default sans font (mirrors the site's `body`).
- **Entrance motion is opt-in per component** (`draw`, `swipe`, `spin`,
  `twinkle` props) and self-contained. The site's scroll-reveal orchestration
  (IntersectionObservers that replay these on scroll) is page-level and lives in
  the site's `src/main.js`, not in the components — see
  [Motion](#motion--accessibility). Every animation is disabled under
  `prefers-reduced-motion`.

## Components

| Component | Purpose | Key props |
| --- | --- | --- |
| `Star` | The four-pointed motif | `variant` (`ink`/`yellow`/`badge`), `size`, `spin`, `twinkle` |
| `Icon` | Contact line glyphs | `name` (`x`/`mail`/`branch`), `size` |
| `LabelMono` | Mono micro-label / eyebrow | `children`, `as`, `lang` |
| `Rule` | 1px hairline, optional draw-in | `tone`, `draw`, `origin`, `flex` |
| `Contact` | Icon + underlined link | `icon`, `label`, `href`, `tone` (`ink`/`on-ink`) |
| `SectionHeader` | Act eyebrow: star + label + rule + JP | `label`, `jp`, `draw` |
| `DisplayTitle` | Big serif heading w/ yellow `<em>` swipe | `children` (mark word with `<em>`), `as`, `swipe` |
| `WorkCard` | Framed artwork + caption | `title`, `meta`, `image`, `href`, `external` |
| `PostRow` | Blog index row | `date`, `tag`, `title`, `excerpt`, `href`, `draw` |
| `Ticker` | Yellow marquee, JP auto-styled | `items`, `secondsPerGroup`, `groupsPerHalf`, `absolute` |

Full typed signatures are in each component's `.d.ts` after `npm run build`, or
in the source under [`src/components/`](src/components/).

## Motion & accessibility

Components carry their **intrinsic** motion (badge-star spin, star twinkle, the
rule draw-in, the `DisplayTitle` yellow paint-and-depart swipe, `WorkCard` /
`PostRow` hover) and honour `prefers-reduced-motion` — animations that end in the
element's natural state simply leave content visible when they don't run.

The site's **replayable scroll reveals** (reveal once past the bottom 15% of the
viewport, re-arm on exit) and its **page-transition sweeps** are page-level
orchestration, not baked into the components. To reproduce them, drive the
`draw`/`swipe` props from your own IntersectionObserver (the site's approach in
`src/main.js`), or wrap groups in a small reveal component.

## Develop

```bash
npm run dev        # component gallery (localhost:5173)
npm run gallery    # build the gallery to dist-gallery/
npm run build      # build the library: dist/ (ESM + UMD + euph-ui.css + .d.ts)
npm run typecheck  # tsc --noEmit
```

The gallery ([`src/gallery/`](src/gallery/)) renders every component with example
props drawn from the real site content — it's the fastest way to eyeball a change.

## Build output & consuming as a package

`npm run build` emits to `dist/`:

- `euph-ui.js` (ESM) / `euph-ui.umd.cjs` (UMD, global **`EuphUI`**) — React /
  ReactDOM stay external (peer deps).
- `euph-ui.css` — the complete stylesheet (tokens + base + every component).
- `index.d.ts` + per-component `.d.ts` — the typed API contract.

## Path to claude.ai/design

This package is deliberately shaped for a later `/design-sync` into
**claude.ai/design** (the "package" shape): a compiled `dist/` that exports every
component to a global (`EuphUI.*`), a single reachable stylesheet whose `:root`
tokens and `.euph` layer style every design, and `.d.ts` types the design agent
codes against. When you're ready, run `/design-sync` from this directory — it
will convert `dist/` into the upload format and author usage docs per component.
Nothing here has been synced yet.
