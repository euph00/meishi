import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderContent, renderPastEvents } from '../scripts/render-content.js';
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = 'http://127.0.0.1:4175';
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
let server, browser;
before(async () => {
  server = spawn(process.execPath, [path.join(ROOT, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(ORIGIN)).ok) break; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ headless: true });
});
after(async () => { await browser?.close(); server?.kill('SIGTERM'); });

test('canonical upcoming and past lists are inline, ordered with upcoming expanded by default', () => {
  const html = renderContent(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
  assert.doesNotMatch(html, /<dialog|aria-haspopup="dialog"/);
  assert.ok(html.indexOf('id="upcoming-events"') < html.indexOf('id="past-events"'));
  for (const id of ['upcoming-events', 'past-events']) {
    assert.match(html, new RegExp(`<section id="${id}"[\\s\\S]*?<details class="event-section"${id === 'upcoming-events' ? ' open' : ''}>\\s*<summary`));
  }
  const upcoming = html.match(/<section id="upcoming-events"[\s\S]*?<\/section>/)[0];
  assert.equal((upcoming.match(/class="event-list__event"/g) ?? []).length, content.ticker.length);
  const expected = [...content.ticker].sort((a,b) => a.date.localeCompare(b.date));
  const titles = [...upcoming.matchAll(/class="event-list__title"[^>]*>([^<]+)</g)].map(x=>x[1]);
  assert.deepEqual(titles, expected.map(x=>x.title.replaceAll('&', '&amp;')));
  assert.match(upcoming, /datetime="2026-12-18"[\s\S]*?P_NIGHT!! vol\.27/);
  assert.doesNotMatch(upcoming, /vol\.26|UNDER＿B@R/);
  const past = renderPastEvents([{title:'Earlier',date:'2026-08-01'},{title:'Later',date:'2026-10-02'}]);
  assert.ok(past.indexOf('Later') < past.indexOf('Earlier'));
});

for (const width of [1280, 390]) {
  test(`event sections and ticker navigation work at ${width}px`, async () => {
    const ctx = await browser.newContext({ viewport: {width,height:844}, reducedMotion:'reduce' });
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}/?intro=0`);
    const upcoming = page.locator('#upcoming-events details');
    const past = page.locator('#past-events details');
    assert.equal(await upcoming.getAttribute('open'), '');
    assert.equal(await past.getAttribute('open'), null);
    await page.locator('.ticker__label').click();
    assert.equal(await upcoming.evaluate(x=>x.open), true);
    assert.equal(await past.evaluate(x=>x.open), false);
    assert.equal(await page.evaluate(()=>document.activeElement === document.querySelector('#upcoming-events summary')), true);
    assert.equal(await page.evaluate(()=>location.hash), '#upcoming-events');
    assert.ok(await page.locator('#upcoming-events').evaluate(x=>Math.abs(x.getBoundingClientRect().top)<80));
    assert.equal(await page.locator('#upcoming-events .event-list__event').count(), content.ticker.length);
    await upcoming.locator('summary').press('Enter');
    assert.equal(await upcoming.evaluate(x=>x.open), false);
    await past.locator('summary').click();
    assert.equal(await past.evaluate(x=>x.open), true);
    assert.equal(await page.locator('#past-events .event-list__event').count(), content.pastEvents.length);
    await page.locator('.ticker__viewport').focus();
    await page.keyboard.press('Enter');
    assert.equal(await upcoming.evaluate(x=>x.open), true);
    assert.equal(await past.evaluate(x=>x.open), true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth), true);
    await ctx.close();
  });
}

test('event headers replay the same title and divider animations as other sections', async () => {
  const ctx = await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.eventReveals = [];
    document.addEventListener('animationstart', e => {
      const id = e.target.closest?.('.act')?.id;
      if (id) window.eventReveals.push({id,name:e.animationName});
    });
  });
  await page.goto(`${ORIGIN}/?intro=0`);
  for (const id of ['upcoming-events','past-events']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForFunction(id => ['ruleDraw','actEmSwipe','revealFade'].every(name =>
      window.eventReveals.some(e => e.id===id && e.name===name)), id, {timeout:3000});
    await page.locator('#top').scrollIntoViewIfNeeded();
    await page.waitForFunction(id => document.querySelector(`#${id} .act__title`).classList.contains('js-reveal'), id);
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForFunction(id => window.eventReveals.filter(e=>e.id===id && e.name==='actEmSwipe').length >= 2, id);
  }
  await ctx.close();
});

for (const width of [320,390,768,1280]) {
  test(`event disclosure spacing and geometry stay compact at ${width}px`, async () => {
    const ctx = await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
    const page = await ctx.newPage(); await page.goto(`${ORIGIN}/?intro=0`);
    for (const id of ['upcoming-events','past-events']) {
      const section = page.locator(`#${id}`);
      if (await section.locator('details').evaluate(d=>d.open)) await section.locator('summary').click();
      const geometry = await section.evaluate(s => {
        const summary=s.querySelector('summary'), title=s.querySelector('h2'), toggle=s.querySelector('.event-section__toggle');
        return {bottom:parseFloat(getComputedStyle(s).paddingBottom),top:parseFloat(getComputedStyle(s).paddingTop),
          trailing:s.getBoundingClientRect().bottom-summary.getBoundingClientRect().bottom,
          overlap:title.querySelector('em').getBoundingClientRect().right > toggle.getBoundingClientRect().left,
          summaryHeight:summary.getBoundingClientRect().height};
      });
      assert.ok(geometry.bottom<=32, `excess bottom padding: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.top<=44);
      assert.ok(geometry.trailing<=33);
      assert.equal(geometry.overlap,false);
      assert.ok(geometry.summaryHeight>=44);
      await section.locator('summary').click();
      assert.equal(await section.locator('details').evaluate(x=>x.open),true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      assert.deepEqual(await section.evaluate(s=>s.getAnimations({subtree:true}).map(a=>a.animationName)),[]);
      await section.locator('summary').press('Space');
      assert.equal(await section.locator('details').evaluate(x=>x.open),false);
    }
    const gapToNotes = await page.evaluate(() => document.querySelector('#notes .act__header').getBoundingClientRect().top - document.querySelector('#past-events summary').getBoundingClientRect().bottom);
    assert.ok(gapToNotes<=80, `excess inter-section whitespace before Notes: ${gapToNotes}px`);
    await ctx.close();
  });
}

for (const width of [320,390,1280]) {
  test(`event expansion and folding animate reversibly at ${width}px`, async () => {
    const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:'no-preference'});
    const page=await ctx.newPage();await page.goto(`${ORIGIN}/?intro=0`);
    for (const id of ['upcoming-events','past-events']) {
      const result=await page.locator(`#${id} details`).evaluate(d=>{
        const s=d.querySelector('summary');if(d.open){s.click();d.querySelector('.event-section__content').getAnimations()[0].finish();}s.click();
        const c=d.querySelector('.event-section__content');
        const a=c?.getAnimations()[0];
        if(!a)return {animated:false};
        a.pause();a.currentTime=a.effect.getTiming().duration/2;
        const halfway=c.getBoundingClientRect().height;
        const end=parseFloat(a.effect.getKeyframes().at(-1).height);
        s.click();const close=c.getAnimations()[0];close.pause();close.currentTime=close.effect.getTiming().duration/2;
        const duringClose={open:d.open,clipped:getComputedStyle(c).overflow,from:parseFloat(close.effect.getKeyframes()[0].height)};
        s.click();const reopen=c.getAnimations()[0];reopen.finish();
        return {animated:true,halfway,end,duringClose};
      });
      assert.equal(result.animated,true);
      assert.ok(result.halfway>0 && result.halfway<result.end);
      assert.ok(Math.abs(result.halfway-result.duringClose.from)<2);
      assert.equal(result.duringClose.open,true);
      assert.ok(['hidden','clip'].includes(result.duringClose.clipped));
      await page.waitForFunction(id=>{const c=document.querySelector(`#${id} .event-section__content`);return c.style.height===''&&c.getAnimations().length===0},id);
      const details=page.locator(`#${id} details`);
      assert.equal(await details.evaluate(d=>d.open),true);
      await details.locator('summary').evaluate(s=>s.click());
      await page.waitForFunction(id=>!document.querySelector(`#${id} details`).open,id);
      assert.equal(await details.locator('.event-section__content').getAttribute('style'),'');
      assert.equal(await details.locator('.event-section__content').evaluate(c=>c.inert),false);
    }
    await page.locator('.ticker__label').click();
    await page.waitForFunction(()=>document.querySelector('#upcoming-events .event-section__content').style.height==='');
    await page.setViewportSize({width:width===320?390:320,height:844});
    assert.equal(await page.locator('#upcoming-events .event-section__content').evaluate(c=>c.clientHeight>=c.scrollHeight),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await ctx.close();
  });
}

test('in-flight event motion settles cleanly on resize or reduced-motion changes', async () => {
  const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const page=await ctx.newPage();await page.goto(`${ORIGIN}/?intro=0`);
  await page.locator('#upcoming-events summary').evaluate(s=>{
    if(s.parentElement.open){s.click();s.parentElement.querySelector('.event-section__content').getAnimations()[0].finish();}
    s.click();s.parentElement.querySelector('.event-section__content').getAnimations()[0].pause();
  });
  await page.setViewportSize({width:320,height:844});
  await page.waitForFunction(()=>document.querySelector('#upcoming-events .event-section__content').style.height==='');
  assert.equal(await page.locator('#upcoming-events details').evaluate(d=>d.open),true);
  await page.locator('#upcoming-events summary').evaluate(s=>{
    s.click();s.parentElement.querySelector('.event-section__content').getAnimations()[0].pause();
  });
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('#upcoming-events details').open);
  assert.equal(await page.locator('#upcoming-events .event-section__content').evaluate(c=>c.getAnimations().length),0);
  await page.locator('#upcoming-events summary').press('Enter');
  assert.equal(await page.locator('#upcoming-events details').evaluate(d=>d.open),true);
  assert.equal(await page.locator('#upcoming-events .event-section__content').evaluate(c=>c.getAnimations().length),0);
  await page.evaluate(() => {
    window.eventScrollCalls = [];
    const nativeScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(options) {
      if (this.matches('#upcoming-events, #past-events')) window.eventScrollCalls.push({id:this.id, options});
      return nativeScrollIntoView.call(this, options);
    };
  });
  await page.locator('.ticker__label').click();
  assert.deepEqual(await page.evaluate(()=>window.eventScrollCalls.at(-1)), {
    id:'upcoming-events', options:{behavior:'instant',block:'start'}
  });
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('.ticker__label').click();
  assert.deepEqual(await page.evaluate(()=>window.eventScrollCalls.at(-1)), {
    id:'upcoming-events', options:{behavior:'smooth',block:'start'}
  });
  await page.evaluate(()=>{ location.hash='#past-events'; });
  await page.waitForFunction(()=>window.eventScrollCalls.at(-1)?.id==='past-events');
  assert.deepEqual(await page.evaluate(()=>window.eventScrollCalls.at(-1)), {
    id:'past-events', options:{behavior:'smooth',block:'start'}
  });
  await ctx.close();
});

test('native sections remain usable without JavaScript', async () => {
  const ctx = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = await ctx.newPage(); await page.goto(`${ORIGIN}/?intro=0`);
  assert.equal(await page.locator('#upcoming-events details').getAttribute('open'), '');
  await page.locator('#upcoming-events summary').click();
  assert.equal(await page.locator('#upcoming-events details').getAttribute('open'), null);
  await page.locator('#upcoming-events summary').click();
  assert.equal(await page.locator('#upcoming-events .event-list__event').count(), content.ticker.length);
  await ctx.close();
});

test('direct event anchors expand their section and rail click navigates without a modal', async () => {
  const page = await browser.newPage({reducedMotion:'reduce'});
  await page.goto(`${ORIGIN}/?intro=0#past-events`);
  assert.equal(await page.locator('#past-events details').evaluate(x=>x.open), true);
  await page.locator('.ticker__viewport').click({position:{x:100,y:20}});
  assert.equal(await page.locator('#upcoming-events details').evaluate(x=>x.open), true);
  assert.equal(await page.locator('dialog').count(), 0);
  await page.close();
});

for (const width of [320,390,1280]) {
  test(`event month and year are prominent and fit at ${width}px`, async () => {
    const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
    const page=await ctx.newPage();await page.goto(`${ORIGIN}/?intro=0`);
    for(const id of ['upcoming-events','past-events']) {
      const section=page.locator(`#${id}`);
      if(!await section.locator('details').evaluate(d=>d.open))await section.locator('summary').click();
      const dates=await section.locator('.event-list__date small').evaluateAll(els=>els.map(e=>{
        const s=getComputedStyle(e),r=e.getBoundingClientRect(),p=e.closest('.event-list__date').getBoundingClientRect();
        return {size:parseFloat(s.fontSize),color:s.color,ink:getComputedStyle(document.body).color,fits:r.right<=p.right+1,overflow:e.scrollWidth>e.clientWidth};
      }));
      assert.ok(dates.length>0);
      for(const d of dates){assert.ok(d.size>=13,JSON.stringify(d));assert.equal(d.color,d.ink);assert.equal(d.fits,true);assert.equal(d.overflow,false);}
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await ctx.close();
  });
}
