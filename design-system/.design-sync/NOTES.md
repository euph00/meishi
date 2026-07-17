# design-sync notes — @euph/ui

Repo-specific gotchas for future syncs of this design system.

- **Where the DS lives.** `@euph/ui` is the `design-system/` subpackage of the
  `meishi` repo (the rest of the repo is the vanilla portfolio site). Run
  design-sync **from `design-system/`**, not the repo root — the root is not a
  component library and shape detection will refuse it.
- **Build before converting.** The converter reads `dist/euph-ui.js` +
  `dist/*.d.ts`. Run `npm run build` (buildCmd) first; a stale `dist/` syncs old
  components.
- **Render check needs Chromium + `libasound.so.2`.** Playwright resolves from
  the repo-root `node_modules` (1.61.1, matches the cached
  `chromium_headless_shell`). On this machine `libasound.so.2` is missing and
  `sudo` needs a password, so the render check can't launch Chromium out of the
  box. Permanent fix: `sudo apt install libasound2t64`. Interim workaround used
  this run: extract the deb locally and export
  `LD_LIBRARY_PATH=<dir-with-libasound.so.2>` when running
  `package-validate.mjs` / `package-capture.mjs` / `resync.mjs`.

## Known render warns
None. (10/10 authored previews render clean; `bad`/`thin`/`variantsIdentical` all 0.)

## Re-sync risks (what can silently go stale)
- **Charset-sensitive source.** `Ticker.tsx`'s JP-detection regex MUST stay
  `\u`-escaped (`/[぀-ヿ㐀-鿿]/`), never literal CJK. Literal
  CJK compiles fine but the shipped bundle throws
  `Invalid regular expression: Range out of order` when decoded as anything but
  UTF-8, which makes `window.EuphUI` undefined and every component fail
  `[BUNDLE_EXPORT]`. This bit us on the first sync.
- **Fonts are remote.** Brand fonts load via a Google Fonts `@import` at the top
  of `src/styles/tokens.css` → validate reports `[FONT_REMOTE]` (expected, not a
  problem). If the DS ever self-hosts woff2s, switch to `cfg.extraFonts` and drop
  the `@import`.
- **DisplayTitle preview drops `swipe`.** The yellow paint-and-depart swipe is a
  transient animation that static capture catches mid-flight (clips the word).
  The preview shows the resting state; the component still supports `swipe` and
  it's documented in prose. Don't "restore" swipe to the preview.
- **Grouping.** All 10 components are in group `general`. To split into
  Primitives / Components, add `cfg.docsMap` stubs with `category:` frontmatter —
  regrouping moves component paths (old paths would land in `upload.deletePaths`).
- **The `぀-ヿ㐀-鿿` range** is duplicated conceptually with the
  site's own `render-content.js` `JP_RE` (literal CJK there, but that runs in
  Node/UTF-8 so it's safe). Keep the library copy escaped.
