import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const moduleUrl = new URL('../scripts/rollover-events.mjs', import.meta.url);
test('elapsed events move once to past, preserving full entries and other content', async () => {
  assert.ok(fs.existsSync(moduleUrl), 'event rollover implementation is missing');
  const { rolloverEvents } = await import(moduleUrl);
  const old = { title:'Ended', date:'2026-11-05', endsAt:'2026-11-05T23:00:00+09:00' };
  const overnight = { title:'Overnight', date:'2026-11-07', endDate:'2026-11-08', endsAt:'2026-11-08T05:00:00+09:00' };
  const input = { ticker:[old,overnight], pastEvents:[], posts:[], hero:{catchline:['unchanged']} };
  const result = rolloverEvents(input, new Date('2026-11-05T23:00:00+09:00'));
  assert.deepEqual(result.ticker,[overnight]);
  assert.deepEqual(result.pastEvents,[old]);
  assert.deepEqual(result.posts,[]);assert.deepEqual(result.hero,input.hero);
  assert.equal(input.ticker.length,2, 'input is not mutated');
  assert.deepEqual(rolloverEvents(result,new Date('2026-11-05T23:00:00+09:00')),result);
});

test('date-only and multi-day events remain until their final local day ends', async () => {
  const { rolloverEvents } = await import(moduleUrl);
  const jp={title:'Japan',date:'2026-11-07'};
  const sg={title:'Singapore',date:'2026-11-07',timeZone:'Asia/Singapore'};
  const range={title:'Overnight',date:'2026-11-07',endDate:'2026-11-08'};
  const input={ticker:[jp,sg,range],pastEvents:[]};
  const boundary=new Date('2026-11-08T00:00:00+09:00');
  assert.deepEqual(rolloverEvents(input,boundary).ticker,[sg,range]);
  assert.deepEqual(rolloverEvents(input,new Date('2026-11-08T00:00:00+08:00')).ticker,[range]);
  assert.deepEqual(rolloverEvents(input,new Date('2026-11-09T00:00:00+09:00')).ticker,[]);
});
test('malformed timing fails closed and duplicate archive entries are not added', async () => {
  const { rolloverEvents } = await import(moduleUrl);
  const now=new Date('2026-11-09T00:00:00Z');
  for (const bad of [{date:'2026-02-30'},{date:'2026-11-07',endsAt:'oops'},
    {date:'2026-11-07',endsAt:'2026-11-07T23:00:00'},
    {date:'2026-11-07',endDate:'2026-11-06'},
    {date:'2026-11-07',timeZone:'No/SuchZone'}]) {
    assert.throws(()=>rolloverEvents({ticker:[{title:'Bad',...bad}],pastEvents:[]},now));
  }
  assert.throws(()=>rolloverEvents({ticker:[],pastEvents:[]},new Date('bad')));
  const event={title:'Same',date:'2026-11-07'};
  assert.equal(rolloverEvents({ticker:[event],pastEvents:[event]},now).pastEvents.length,1);
});

test('CLI writes only elapsed-event changes and is idempotent', () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'event-rollover-'));
  try {
    const file=path.join(dir,'site.json');
    fs.writeFileSync(file,JSON.stringify({ticker:[{title:'Old',date:'2020-01-01'},{title:'Future',date:'2099-01-01'}],pastEvents:[],posts:[]}));
    const cli=new URL('../scripts/archive-events.mjs',import.meta.url);
    const first=spawnSync(process.execPath,[cli.pathname,'--file',file],{encoding:'utf8'});
    assert.equal(first.status,0,first.stderr);assert.match(first.stdout,/archived=1/);
    const result=JSON.parse(fs.readFileSync(file));assert.equal(result.ticker[0].title,'Future');assert.equal(result.pastEvents[0].title,'Old');
    const bytes=fs.readFileSync(file,'utf8');
    const second=spawnSync(process.execPath,[cli.pathname,'--file',file],{encoding:'utf8'});
    assert.equal(second.status,0,second.stderr);assert.match(second.stdout,/archived=0/);
    assert.equal(fs.readFileSync(file,'utf8'),bytes);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});

test('archiving the final upcoming event still renders a usable empty upcoming section', async () => {
  const { rolloverEvents } = await import(moduleUrl);
  const { renderContent } = await import('../scripts/render-content.js');
  const content=JSON.parse(fs.readFileSync(new URL('../content/site.json',import.meta.url)));
  const empty=rolloverEvents(content,new Date('2100-01-01T00:00:00Z'));
  assert.equal(empty.ticker.length,0);
  const html=renderContent(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),empty);
  assert.match(html,/No upcoming events\./);
  assert.doesNotMatch(html,/class="ticker__item"/);
  assert.match(html,/標 CROSS F@DE/);
});
