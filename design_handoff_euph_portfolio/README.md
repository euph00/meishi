# Handoff: Euph Portfolio Website ("Stage" theme)

## Overview
A personal portfolio site for the artist **Euph**, themed as a theatrical stage: the site opens with ink curtains parting (bottom edge leading), a "playbill"-style editorial hero, a recent-artwork gallery ("Act I"), a blog index ("Act II — Notes from the Wings"), and a dark "Curtain Call" footer. **Mobile is the primary target; desktop must also work.** The design is minimalistic and editorial with playful motion, a warm neutral base and exactly one bold yellow accent. A recurring four-pointed-star motif and the artist's diamond emblem (watermark) tie the sections together. The site must support Japanese text alongside English.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing intended look and behavior, not production code to copy directly. `Euph Portfolio.dc.html` uses a proprietary streaming-component format (`<x-dc>` template + logic class); treat it as a readable spec, not an importable module. The task is to **recreate this design in the target codebase's environment** (Next.js, Astro, plain HTML/CSS, etc.) using its established patterns — or, if no environment exists yet, choose an appropriate lightweight framework (a static-site setup is a good fit; the only dynamic parts are animations, scroll reveals, and a blog index).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and animation timings are final and should be recreated pixel-perfectly. The artwork images and the three social URLs are placeholders (see Assets / Notes).

## Design Tokens

Colors:
- Paper (page background): `#ECE7DA`
- Ink (text, curtains, footer bg): `#17150F`
- Accent yellow (ONLY accent): `#FFD400`
- Link hover: `#B89600`
- Muted ink: `rgba(23,21,15,.6–.75)` for secondary text; `rgba(23,21,15,.25–.35)` for hairlines
- Paper-on-ink (footer text): `#ECE7DA`, muted `rgba(236,231,218,.55–.6)`
- Selection: yellow bg, ink text

Typography (Google Fonts):
- Display serif: **Instrument Serif** (400, italic used heavily), JP fallback **Shippori Mincho** (400/500/600)
- Sans: **Archivo** (400/500/600), JP fallback **Zen Kaku Gothic New** (400/500/700)
- Mono labels: `ui-monospace, Menlo, monospace`, 10–12px, letter-spacing .2–.3em, uppercase
- Font stacks must be written serif→JP-serif (`'Instrument Serif','Shippori Mincho',serif`) and sans→JP-sans (`Archivo,'Zen Kaku Gothic New',sans-serif`) so JP glyphs fall through correctly.

Spacing / misc:
- Section side padding: `clamp(24px, 5vw, 64px)`; section vertical padding: `clamp(64px,10vh,110px)`
- Hairline rules: 1px solid ink (full opacity in hero, .25–.35 alpha elsewhere)
- No border radius anywhere except pill buttons (none currently in final design); artwork frames are sharp-cornered with a 1px inset outline `rgba(23,21,15,.25)`
- Ticker strip: 44px tall, yellow bg

Four-pointed star (the core motif) — single SVG path, viewBox 0 0 100 100:
`M50 0C54.5 33.5 66.5 45.5 100 50C66.5 54.5 54.5 66.5 50 100C45.5 66.5 33.5 54.5 0 50C33.5 45.5 45.5 33.5 50 0Z`
Used at 8–14px as separators/bullets (ink or yellow fill) and 32–86px in the hero cluster (yellow).

## Screens / Views

### 1. Hero (100dvh, paper bg)
Vertical flex column, padded `clamp(26px,3.4vh,44px)` top, 74px bottom (clears the 44px ticker), side padding per token. All content dollies in (see Interactions).
- **Top rule row**: 1px ink rules left/right of mono label `THE WORK OF` (10–12px, ls .26em).
- **Title block** (centered): `EUPH` in Instrument Serif, uppercase, `clamp(124px,19.5vw,260px)`, line-height .9. Below it the JP subtitle `ユーフ作品集` in Shippori Mincho 500, `clamp(15px,1.4vw,19px)`, letter-spacing .4em (compensate with equal padding-left).
- **Contacts row** (centered, wrapping, gap 13px): three links — Twitter, Email, GitHub — each `[icon] Label` in sans 13–15px, underlined (underline-offset 4px, thickness 1px), separated by 10px yellow-less ink stars. Icons are minimal line glyphs, stroke ink, round caps (viewBox 0 0 100 100): X mark = two crossed 45° strokes (`M28 28 L72 72 M72 28 L28 72`, sw 10); envelope = rect(16,26,68,48,r7) + flap `M20 32 L50 56 L80 32` (sw 8); git-branch = circles (30,25) (30,75) (71,37) r9 + `M30 34 L30 66 M71 46 C71 62 30 52 30 64` (sw 8).
- **Star cluster + quote** (fills remaining space, centered): container 106×92px, inner wrapper `skewX(-14deg)`. Three yellow stars, no outlines: 86px at (10,4), 44px at (60,0), 32px at (60,54) — the large one is the centerpiece, smaller two tuck into its upper-right / lower-right. Each star shimmers independently (see Animations). Below: italic serif quote, `clamp(19px,1.6vw,22px)`, 75% ink: `"An evening of images, interfaces, and the occasional plot twist."` (2 lines).
- **Footer rule row**: border-top 1px ink; mono 10–11px ls .22em; left `DOORS OPEN`, right `SCROLL ↓` (anchors to #work).
- **Yellow ticker** pinned to hero bottom (absolute, 44px): infinitely scrolling marquee, content duplicated for seamless loop, 22px gaps, 12px ink stars between items: `NOW SHOWING · 上演中 · SELECTED WORK 2020–2026 · 限定公演` (EN in Archivo 600 ls .14em; JP in Zen Kaku Gothic New 700 ls .2em). Loop: translateX 0 → −50%, 16s linear infinite.
- **Curtains** (intro): two absolute ink panels, each 75% wide, overhanging −23% left/right so skew never reveals gaps.

### 2. Act I — Recent Work (`#work`, paper bg)
- **Section header row**: 14px yellow star (4-unit ink outline) + mono `ACT I` + flexible 1px rule + JP `近作` (Shippori Mincho, ls .3em).
- **Section title**: `Recent *Work*` (Work italic), serif `clamp(44px,6vw,84px)`.
- **Grid**: `repeat(auto-fit, minmax(min(300px,100%),1fr))`, gaps `clamp(24px,3.4vw,44px)` × `clamp(20px,3vw,36px)` → 1 col at 390px, 3 cols on desktop. Six cards.
- **Card**: 4:5 image frame (1px inset outline) + caption row: italic serif title `clamp(19px,1.6vw,23px)` left, mono `NN — YYYY` right (10px, ls .16em, 60% ink). Hover lifts card −5px (500ms spring-ish ease).
- **Watermark**: ink emblem centered in section, `min(76vmin,80vw)`, opacity .045, upright, behind content, pointer-events none.

### 3. Act II — Notes (`#notes`, paper bg) — blog index
- Header identical pattern: `ACT II` + `日誌`; title `Notes from *the Wings*`.
- **Post list** (max-width 860px): each post is a full-row link, border-top hairline (35% ink), padding `clamp(20px,3vh,28px)` vertical; closing hairline after the last. Row content: mono meta line `YYYY.MM.DD ✦ TAG` (10px, 60% ink, 8px yellow star), then title row — serif `clamp(24px,2.6vw,34px)` left, mono `READ →` right — then one-line sans excerpt (13–15px/1.6, 65% ink, max-width 600px). Hover slides the whole row +8px right (500ms).
- **Watermark**: ink emblem centered, `min(60vmin,76vw)`, opacity .045.

### 4. Curtain Call — footer (ink bg `#17150F`, paper text)
- Centered column: mono kicker `CURTAIN CALL — カーテンコール` (60% paper), serif headline `Come backstage, *say hello.*` `clamp(34px,4.4vw,58px)`, contacts row reprised — same three links, paper text, **yellow icon strokes**, hover text → yellow (300ms), yellow 9px star separators.
- Bottom bar: border-top `rgba(236,231,218,.25)`, mono 10px: `© MMXXVI EUPH` left, `FIN — おわり` right.
- **Watermark**: yellow emblem centered, height 70% of footer, opacity .09.

## Interactions & Behavior

Animations (all timings final):
- **Curtain intro** (hero, plays once on load): both panels start covering the viewport, then part sideways with the *bottom edge leading*. Keyframes (left panel; right is mirrored): 0% `translateX(0) skewX(0)` → 35% `translateX(-14%) skewX(-11deg)` → 100% `translateX(-118%) skewX(-4deg)`. 1.7s, `cubic-bezier(.76,0,.24,1)`, 0.5s delay, fill forwards.
- **Camera dolly**: hero content scales .86 → 1 over 2.4s, `cubic-bezier(.16,1,.3,1)`, from load.
- **Rise-ins** (hero elements): opacity 0 + translateY(16px) → visible; .8–1s ease-out; staggered delays 1.25s / 1.4s / 1.55s / 1.75s / 1.9s / 2s (title → rules → contacts → cluster → footer row → ticker).
- **Star shimmer**: scale 1→.975, opacity 1→.93, brightness 1→1.07 and back; the three cluster stars run independent loops: 3.6s (delay 2.6s), 2.9s (delay 3.4s), 2.5s (delay 3s), ease-in-out infinite.
- **Ticker**: translateX −50% loop, 16s linear infinite; content rendered twice.
- **Scroll reveals** (both Acts + footer content, incl. each artwork card and each post row): elements below 92% of viewport start hidden (opacity 0, translateY 26px); an IntersectionObserver (threshold .12) reveals them once with `opacity .9s ease, transform .9s cubic-bezier(.16,1,.3,1)`. Progressive enhancement — content must be visible if JS fails.
- **Hovers**: artwork card translateY(-5px); post row translateX(8px); footer links color→yellow. Global link hover `#B89600`.
- `scroll-behavior: smooth`; `SCROLL ↓` anchors to `#work`.
- The prototype exposes a `playIntro` boolean (skip the curtain intro) — worth keeping as a query param or prefers-reduced-motion behavior. **Recommended: honor `prefers-reduced-motion` by skipping curtains/dolly and showing content immediately.**

## State Management
- No app state beyond: (1) one-shot intro animation, (2) IntersectionObserver reveal set, (3) blog posts as a data array `{date, tag, title, excerpt, href}`, (4) artworks as a data array `{title, meta, image}`.
- Blog rows currently link to `#notes` — wire to real post routes.

## Responsive Behavior
- Single responsive layout, no breakpoint forks: `clamp()` on all type/padding, auto-fit grid, wrapping flex rows. Verified at 390×844 (no horizontal overflow; hero fits one viewport incl. ticker) and desktop ~1280–1440.
- Title floor 124px at 390px wide; cap 260px on desktop.
- Hit targets ≥ 44px on mobile for links (pad the contact links / post rows accordingly).

## Assets
- `assets/logo-original.svg` — artist-supplied emblem (Hatsuboshi Gakuen diamond mark, original cream `#FFE7BF`).
- `assets/logo-ink.svg` / `assets/logo-yellow.svg` — recolored copies (`#17150F` / `#FFD400`) used as section watermarks. Recolor = replace the single `fill` value.
- Star motif + contact icons: inline SVG paths (see tokens / hero spec above) — no icon library needed.
- Artwork images: **placeholders**. The prototype uses drag-and-drop slots (`image-slot.js`, prototype-runtime only — do not port); production should render real image files (4:5 crop, `object-fit: cover`).
- Social URLs are placeholders: `https://twitter.com/euph`, `mailto:hi@euph.jp`, `https://github.com/euph`.

## Files
- `Euph Portfolio.dc.html` — the full design (template markup + logic class at the bottom of the file). All styles are inline on elements; keyframes and body resets are in the `<style>` block near the top.
- `image-slot.js` — prototype-only drag-and-drop image placeholder component (reference for slot sizing only).
- `assets/` — emblem SVGs (original, ink, yellow).
