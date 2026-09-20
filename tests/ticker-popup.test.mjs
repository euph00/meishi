import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

import { renderContent, renderPastEvents } from '../scripts/render-content.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = 4175;
const ORIGIN = `http://127.0.0.1:${PORT}`;
let server;
let browser;

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`${ORIGIN}/?intro=0`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError ?? new Error('Vite test server did not become ready');
}

before(async () => {
  server = spawn(
    process.execPath,
    [path.join(ROOT, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  await waitForServer();
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  if (server && !server.killed) server.kill('SIGTERM');
});

test('ticker data and rendered markup expose a semantic event programme', () => {
  const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
  assert.equal(content.ticker.length, 9);
  for (const [index, event] of content.ticker.entries()) {
    assert.equal(typeof event, 'object', `ticker[${index}] should be structured`);
    assert.equal(typeof event.title, 'string');
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/);
    if (event.endDate) assert.match(event.endDate, /^\d{4}-\d{2}-\d{2}$/);
  }

  const template = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const html = renderContent(template);
  assert.match(html, /<button[^>]+class="ticker__label"[^>]+aria-haspopup="dialog"/);
  assert.match(html, /<dialog[^>]+id="ticker-events"[^>]+aria-labelledby="ticker-events-title"/);
  assert.equal((html.match(/class="ticker-dialog__event"/g) ?? []).length, 9);
  const tickerDialogHtml = html.match(/<ol class="ticker-dialog__list">([\s\S]*?)<\/ol>/)?.[1] ?? '';
  assert.deepEqual(
    [...tickerDialogHtml.matchAll(/<time[^>]+datetime="([^"]+)"/g)].map((match) => match[1]),
    ['2026-09-21', '2026-09-22', '2026-09-23', '2026-11-07', '2026-11-07', '2026-11-08', '2026-12-13', '2026-12-20', '2026-12-27', '2026-12-29', '2026-12-31', '2027-02-20']
  );
  assert.match(html, /初後夜祭 in 岩手（DJイベント）/);
  assert.match(html, /Hatsuboshi DJ FESTIVAL #HDF episode\.3「共鳴」/);
  assert.match(html, /春咲暖1st Live『Light in Bloom』昼公演/);
  assert.match(html, /<small>09\.2026<\/small>/);
  assert.match(html, /<small>02\.2027<\/small>/);
  assert.doesNotMatch(html, /<small>[A-Z]{3} \d{4}<\/small>/);
});

test('past events are canonical, numeric, and rendered most-recent-first', () => {
  const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
  assert.deepEqual(content.pastEvents, [
    { title: 'あおわん・カンナヒカル（仮）夜の部', date: '2026-09-20' },
  ]);
  assert.equal(content.ticker.some((event) => event.title.includes('カンナヒカル（仮）夜の部')), false);

  const archive = renderPastEvents([
    { title: 'Earlier event', date: '2026-08-01' },
    { title: 'Latest event', date: '2026-10-02' },
    { title: 'Kanna event', date: '2026-09-20' },
  ]);
  assert.deepEqual(
    [...archive.matchAll(/class="past-events__title"[^>]*>([^<]+)</g)].map((match) => match[1]),
    ['Latest event', 'Kanna event', 'Earlier event']
  );

  const template = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const html = renderContent(template);
  assert.match(html, /<section id="past-events" class="act act--past-events">/);
  assert.equal((html.match(/class="past-events__event"/g) ?? []).length, 1);
  assert.match(html, /<time datetime="2026-09-20">20<\/time><small>09\.2026<\/small>/);
  assert.match(html, /あおわん・カンナヒカル（仮）夜の部/);
});

test('ticker opens and dismisses the event programme accessibly', async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${ORIGIN}/?intro=0`);

  const trigger = page.locator('.ticker__label');
  const dialog = page.locator('#ticker-events');
  await assert.doesNotReject(() => trigger.waitFor({ state: 'visible' }));
  assert.equal(await dialog.isVisible(), false);

  await trigger.click();
  assert.equal(await dialog.isVisible(), true);
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(await dialog.locator('.ticker-dialog__event').count(), 9);

  await dialog.locator('.ticker-dialog__close').click();
  assert.equal(await dialog.isVisible(), false);
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.ticker__label')), true);

  await page.locator('.ticker__viewport').click({ position: { x: 120, y: 20 } });
  assert.equal(await dialog.isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await dialog.isVisible(), false);
  await page.close();
});

test('event programme remains usable at a 390px mobile viewport', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${ORIGIN}/?intro=0`);
  await page.locator('.ticker__label').click();

  const dialog = page.locator('#ticker-events');
  assert.equal(await dialog.isVisible(), true);
  assert.equal(await dialog.locator('.ticker-dialog__close').isVisible(), true);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    true
  );
  const box = await dialog.boundingBox();
  assert.ok(box && box.width <= 390, `dialog width ${box?.width} should fit the viewport`);
  await page.close();
});
