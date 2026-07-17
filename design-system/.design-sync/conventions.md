# EUPH "Stage" UI — how to build with it

A small, opinionated editorial system: warm **paper** ground, near-black **ink**,
exactly **one** accent **yellow**, a four-pointed **star** motif, bilingual EN + JP,
Instrument Serif display type. Keep it minimal — one yellow, lots of paper, sharp
1px hairlines, no border radius.

## Wrapping & setup

Wrap the page (or any section) in the base layer so it gets the paper canvas,
ink text, and default sans font:

```jsx
<div className="euph">
  {/* your composition */}
</div>
```

`className="euph"` sets `background: var(--paper)`, `color: var(--ink)`, and the
sans font. Individual components already style themselves from the tokens on
`:root`, so they render correctly anywhere — but put `euph` on the container to
get the on-brand canvas. Fonts (Instrument Serif, Archivo, Shippori Mincho, Zen
Kaku Gothic New) are pulled in by the stylesheet's own `@import`; nothing else to
add.

## The styling idiom — tokens, not utility classes

There is **no utility-class system** and component internals use `euph-`-prefixed
classes you should **not** write by hand — compose the exported components and
style your *own* layout glue with the CSS custom properties:

| Group | Tokens |
|---|---|
| Colour | `--paper` `--ink` `--yellow` `--link-hover`; ink ramp `--ink-25/-35/-60/-65/-75/-85`; paper ramp `--paper-25/-55/-60` |
| Type | `--serif` (display) `--jp-serif` `--sans` `--jp-sans` `--mono` (labels) |
| Layout / motion | `--pad-x` (section padding) `--ease-spring` `--ease-curtain` |

```jsx
<section className="euph" style={{ padding: 'var(--pad-x)' }}>
  <SectionHeader label="Illustrations" jp="近作" draw />
  <DisplayTitle>Recent <em>Work</em></DisplayTitle>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px,100%), 1fr))',
    gap: 'clamp(24px,3vw,44px)',
  }}>
    <WorkCard title="ぷろでゅーさー♡" meta="01 — 07.2026" image="/art/piece.webp"
              href="https://x.com/…" />
  </div>
</section>
```

Idiomatic patterns worth keeping:

- **Emphasis** in a `DisplayTitle` is the italic `<em>` word — it carries the
  yellow paint-and-depart swipe. Mark exactly one word per title.
- **Stars** are the connective motif: `<Star variant="ink|yellow|badge" />` as
  bullets/separators (8–14px) and accents. `badge` = yellow with an ink outline.
- **Bilingual** is intentional: labels, section headers, and tickers pair short
  English with a JP tag (`jp="近作"`). JP text is auto-styled where relevant.
- **One accent.** Yellow is for emphasis, stars, and the ticker only — never a
  second accent colour or a border radius.

## Where the truth lives

- `styles.css` (and its `@import` closure) — every token and component style.
- `components/<Name>/<Name>.d.ts` — the exact props for each component.
- `components/<Name>/<Name>.prompt.md` — per-component usage and examples.

## Components

`Star` · `Icon` (x/mail/branch) · `LabelMono` · `Rule` (draw-in hairline) ·
`Contact` (tone `ink`/`on-ink`) · `SectionHeader` · `DisplayTitle` ·
`WorkCard` · `PostRow` · `Ticker`. Dark sections (footer/"Curtain Call") use the
`on-ink` tone: paper text, yellow icons.
