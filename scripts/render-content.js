// Build-time content renderer: injects content/site.json into the
// `<!-- content:... -->` placeholders in index.html. Runs from vite.config.js
// for both `npm run dev` and `npm run build`, so the shipped HTML is fully
// static. Bad content fails the build with a pointed error instead of
// deploying a broken page.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const CONTENT_FILE = path.join(ROOT, 'content', 'site.json');

// icon glyph sizes per placement: hero contacts are larger for readability,
// footer contacts keep the handoff sizes
const ICONS = {
  x: { id: 'ic-x', size: { hero: 16, finale: 13 } },
  mail: { id: 'ic-mail', size: { hero: 17, finale: 14 } },
  branch: { id: 'ic-branch', size: { hero: 17, finale: 14 } },
};

// Hiragana, katakana, or CJK ideographs → JP ticker styling + lang="ja"
const JP_RE = /[぀-ヿ㐀-鿿]/;

const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function fail(msg) {
  throw new Error(`content/site.json: ${msg}`);
}

function needString(value, where) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${where} must be a non-empty string (got ${JSON.stringify(value)})`);
  }
  return value;
}

function needArray(value, where) {
  if (!Array.isArray(value)) fail(`${where} must be an array`);
  return value;
}

function star(color, size, extraClass = '') {
  const cls = `star star--${color}${extraClass ? ` ${extraClass}` : ''}`;
  return `<svg class="${cls}" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><use href="#star"/></svg>`;
}

function loadContent() {
  let raw;
  try {
    raw = fs.readFileSync(CONTENT_FILE, 'utf8');
  } catch {
    fail('file not found');
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    fail(`invalid JSON — ${e.message}`);
  }
}

function renderCatchline(hero) {
  const lines = needArray(hero?.catchline, 'hero.catchline');
  if (lines.length === 0) fail('hero.catchline needs at least one line');
  return lines.map((l, i) => esc(needString(l, `hero.catchline[${i}]`))).join('<br>');
}

function renderTickerGroup(items) {
  return items
    .map((text, i) => {
      needString(text, `ticker[${i}]`);
      const jp = JP_RE.test(text);
      const span = jp
        ? `<span class="ticker__jp" lang="ja">${esc(text)}</span>`
        : `<span class="ticker__en">${esc(text)}</span>`;
      return `${span}\n        ${star('ink', 12)}`;
    })
    .join('\n        ');
}

function renderTicker(items) {
  needArray(items, 'ticker');
  if (items.length === 0) fail('ticker needs at least one item');
  const group = renderTickerGroup(items);
  return [
    `<div class="ticker__group">\n        ${group}\n      </div>`,
    `<div class="ticker__group" aria-hidden="true">\n        ${group}\n      </div>`,
  ].join('\n      ');
}

function renderContacts(contacts, variant) {
  needArray(contacts, 'contacts');
  if (contacts.length === 0) fail('contacts needs at least one entry');
  const sep = variant === 'finale' ? star('yellow', 9, 'twinkle') : star('ink', 12);
  return contacts
    .map((c, i) => {
      needString(c?.label, `contacts[${i}].label`);
      needString(c?.href, `contacts[${i}].href`);
      const icon = ICONS[c?.icon];
      if (!icon) {
        fail(`contacts[${i}].icon must be one of: ${Object.keys(ICONS).join(', ')}`);
      }
      const size = icon.size[variant];
      return `<a class="contact" href="${esc(c.href)}">
        <svg class="contact__icon" viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true"><use href="#${icon.id}"/></svg>
        <span>${esc(c.label)}</span>
      </a>`;
    })
    .join(`\n      ${sep}\n      `);
}

function renderWorks(works) {
  needArray(works, 'works');
  return works
    .map((w, i) => {
      needString(w?.title, `works[${i}].title`);
      needString(String(w?.date ?? w?.year ?? ''), `works[${i}].date`);
      needString(w?.image, `works[${i}].image`);
      const file = path.join(ROOT, 'public', w.image);
      if (!w.image.startsWith('/') || !fs.existsSync(file)) {
        fail(`works[${i}].image — no file at public${w.image}`);
      }
      // frames take each piece's own aspect ratio; width/height are probed at
      // build time so the layout is reserved before the image loads
      let dim;
      try {
        dim = imageSize(fs.readFileSync(file));
      } catch {
        fail(`works[${i}].image — could not read dimensions of public${w.image}`);
      }
      // optional "link" turns the whole card into an external link (e.g. the
      // piece's Twitter post); flagged with ↗ in the meta label
      if (w.link !== undefined) {
        needString(w.link, `works[${i}].link`);
        if (!/^https?:\/\//.test(w.link)) {
          fail(`works[${i}].link must start with http:// or https://`);
        }
      }
      // NN is derived from position so adding/removing cards renumbers itself;
      // set "meta" to override the whole "NN — MM.YYYY" label
      const meta = w.meta ?? `${String(i + 1).padStart(2, '0')} — ${w.date ?? w.year}`;
      const alt = w.alt ?? w.title;
      const inner = `
      <div class="work-card__frame"><img src="${esc(w.image)}" alt="${esc(alt)}" width="${dim.width}" height="${dim.height}" loading="lazy" decoding="async"></div>
      <figcaption class="work-card__caption">
        <span class="work-card__title">${esc(w.title)}</span>
        <span class="work-card__meta">${esc(meta)}${w.link ? ' ↗' : ''}</span>
      </figcaption>`;
      return w.link
        ? `<a class="work-card" href="${esc(w.link)}" target="_blank" rel="noopener" data-reveal><figure class="work-card__fig">${inner}
    </figure></a>`
        : `<figure class="work-card" data-reveal>${inner}
    </figure>`;
    })
    .join('\n    ');
}

// A post links out via an explicit `href`, or gets a generated page at
// /posts/<slug>.html when it has `slug` + `body` — exactly one of the two.
function validatePost(p, i) {
  needString(p?.date, `posts[${i}].date`);
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(p.date)) {
    fail(`posts[${i}].date must look like YYYY.MM.DD (got ${JSON.stringify(p.date)})`);
  }
  needString(p?.tag, `posts[${i}].tag`);
  needString(p?.title, `posts[${i}].title`);
  needString(p?.excerpt, `posts[${i}].excerpt`);
  if ((p.slug !== undefined) === (p.href !== undefined)) {
    fail(`posts[${i}] needs exactly one of "slug" (generated page) or "href" (plain link)`);
  }
  if (p.slug !== undefined) {
    needString(p.slug, `posts[${i}].slug`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) {
      fail(`posts[${i}].slug must be lowercase letters, digits, and hyphens (got ${JSON.stringify(p.slug)})`);
    }
    if (!Array.isArray(p.body) || p.body.length === 0) {
      fail(`posts[${i}].body must be a non-empty array of blocks when "slug" is set`);
    }
    return { ...p, href: `/posts/${p.slug}.html` };
  }
  needString(p.href, `posts[${i}].href`);
  return { ...p };
}

// body blocks: plain string → paragraph; {"h2": ...} → subheading;
// {"quote": ...} → pull quote
function renderPostBody(body, where) {
  return body
    .map((block, j) => {
      const at = `${where}[${j}]`;
      if (typeof block === 'string') {
        needString(block, at);
        return `<p>${esc(block)}</p>`;
      }
      if (block && typeof block === 'object') {
        const keys = Object.keys(block);
        if (keys.length === 1 && keys[0] === 'h2') {
          return `<h2>${star('yellow', 12)}<span>${esc(needString(block.h2, `${at}.h2`))}</span></h2>`;
        }
        if (keys.length === 1 && keys[0] === 'quote') {
          return `<blockquote>${esc(needString(block.quote, `${at}.quote`))}</blockquote>`;
        }
      }
      fail(`${at} must be a paragraph string, {"h2": ...}, or {"quote": ...}`);
    })
    .join('\n      ');
}

function renderPosts(posts) {
  needArray(posts, 'posts');
  const checked = posts.map((p, i) => validatePost(p, i));
  // newest first, regardless of array order
  const sorted = [...checked].sort((a, b) => b.date.localeCompare(a.date));
  return sorted
    .map(
      (p) => `<a class="post-row" href="${esc(p.href)}"${p.slug ? ' data-nav="fwd"' : ''} data-reveal>
      <div class="post-row__meta">
        <span>${esc(p.date)}</span>
        ${star('yellow', 8, 'twinkle')}
        <span>${esc(p.tag)}</span>
      </div>
      <div class="post-row__head">
        <span class="post-row__title">${esc(p.title)}</span>
        <span class="post-row__read">READ →</span>
      </div>
      <p class="post-row__excerpt">${esc(p.excerpt)}</p>
    </a>`
    )
    .join('\n    ');
}

// Renders post.html for every post with a slug → [{ fileName, html }].
// Used by vite.config.js for the build inputs and the dev middleware.
export function renderPostPages() {
  const c = loadContent();
  needArray(c.posts, 'posts');
  const template = fs.readFileSync(path.join(ROOT, 'post.html'), 'utf8');
  const seen = new Set();
  const pages = [];
  c.posts.forEach((raw, i) => {
    const p = validatePost(raw, i);
    if (!p.slug) return;
    if (seen.has(p.slug)) fail(`posts[${i}].slug "${p.slug}" is used more than once`);
    seen.add(p.slug);
    const slots = {
      'post:title': esc(p.title),
      'post:date': esc(p.date),
      'post:tag': esc(p.tag),
      'post:excerpt': esc(p.excerpt),
      'post:body': renderPostBody(p.body, `posts[${i}].body`),
    };
    let html = template;
    for (const [name, value] of Object.entries(slots)) {
      const marker = `<!-- ${name} -->`;
      if (!html.includes(marker)) {
        throw new Error(`post.html: missing placeholder ${marker}`);
      }
      html = html.replaceAll(marker, value);
    }
    pages.push({ fileName: `posts/${p.slug}.html`, html });
  });
  return pages;
}

export function renderContent(html) {
  const c = loadContent();
  const slots = {
    'content:catchline': () => renderCatchline(c.hero),
    'content:ticker': () => renderTicker(c.ticker),
    'content:contacts:hero': () => renderContacts(c.contacts, 'hero'),
    'content:contacts:finale': () => renderContacts(c.contacts, 'finale'),
    'content:works': () => renderWorks(c.works),
    'content:posts': () => renderPosts(c.posts),
  };
  for (const [name, render] of Object.entries(slots)) {
    const marker = `<!-- ${name} -->`;
    if (!html.includes(marker)) {
      throw new Error(`index.html: missing placeholder ${marker}`);
    }
    html = html.replace(marker, render());
  }
  return html;
}
