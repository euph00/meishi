// Generates 1200×630 social-preview card images (one per post with a slug)
// into public/cards/<slug>.png, rendered in the site's "Stage" style via
// headless Chromium. Run manually after adding/retitling a post:
//
//   npm run cards        (first time: npx playwright install chromium)
//
// then commit the PNGs. The build does NOT run this — if a card is missing,
// the post still builds and its link preview is text-only (the renderer
// warns). Keep it that way: CI has no browser and must never need one.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = path.join(ROOT, 'public', 'cards');

const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
// strip the renderer's inline **bold** / *italic* markers
const plain = (s) =>
  String(s)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');

const STAR =
  'M50 0C54.5 33.5 66.5 45.5 100 50C66.5 54.5 54.5 66.5 50 100C45.5 66.5 33.5 54.5 0 50C33.5 45.5 45.5 33.5 50 0Z';
const star = (size, fill, extra = '') =>
  `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="${extra}"><path d="${STAR}" fill="${fill}"/></svg>`;

function cardHtml(post) {
  const title = esc(plain(post.title));
  const lede = esc(plain(post.excerpt));
  // adaptive title size so long titles keep breathing room
  const len = plain(post.title).length;
  const titleSize = len <= 40 ? 76 : len <= 70 ? 62 : 50;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Shippori+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #ECE7DA; color: #17150F;
    padding: 68px 84px;
    font-family: 'Instrument Serif', 'Shippori Mincho', serif;
  }
  .mono { font-family: ui-monospace, Menlo, 'Zen Kaku Gothic New', monospace; }
  .top { display: flex; align-items: center; gap: 20px; }
  .top .label { font-size: 16px; letter-spacing: .3em; font-weight: 500; }
  .top .rule { flex: 1; height: 1px; background: #17150F; }
  .top .jp { font-family: 'Shippori Mincho', serif; font-weight: 500; font-size: 18px; letter-spacing: .3em; }
  h1 {
    margin-top: 54px; font-weight: 400; font-size: ${titleSize}px; line-height: 1.12;
    max-width: 860px; letter-spacing: .01em;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }
  .lede {
    margin-top: 24px; font-style: italic; font-size: 30px; line-height: 1.35;
    color: rgba(23,21,15,.62); max-width: 780px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .meta {
    position: absolute; left: 84px; bottom: 74px;
    display: flex; align-items: center; gap: 16px;
    font-size: 17px; letter-spacing: .22em; font-weight: 500; color: rgba(23,21,15,.6);
  }
  .cluster { position: absolute; right: 96px; bottom: 92px; width: 150px; height: 130px; transform: skewX(-14deg); }
  .cluster svg { position: absolute; }
  .strip { position: absolute; left: 0; right: 0; bottom: 0; height: 16px; background: #FFD400; }
</style></head>
<body>
  <div class="top">
    <svg viewBox="0 0 100 100" width="24" height="24"><path d="${STAR}" fill="#FFD400" stroke="#17150F" stroke-width="4"/></svg>
    <span class="mono label">EUPH — NOTES</span>
    <span class="rule"></span>
    <span class="jp">徒然</span>
  </div>
  <h1>${title}</h1>
  <div class="lede">${lede}</div>
  <div class="meta mono">
    <span>${esc(post.date)}</span>
    ${star(14, '#FFD400')}
    <span>${esc(post.tag)}</span>
  </div>
  <div class="cluster">
    ${star(118, '#FFD400', 'left:0;top:6px')}
    ${star(58, '#FFD400', 'left:82px;top:0')}
    ${star(42, '#FFD400', 'left:82px;top:76px')}
  </div>
  <div class="strip"></div>
</body></html>`;
}

const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'site.json'), 'utf8'));
const posts = (site.posts ?? []).filter((p) => p.slug);
if (posts.length === 0) {
  console.log('no posts with slugs — nothing to generate');
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const post of posts) {
  await page.setContent(cardHtml(post), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const file = path.join(OUT_DIR, `${post.slug}.png`);
  await page.screenshot({ path: file });
  console.log(`✦ ${path.relative(ROOT, file)} (${Math.round(fs.statSync(file).size / 1024)}KB)`);
}
await browser.close();
