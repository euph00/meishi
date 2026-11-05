import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { rolloverEvents } from './rollover-events.mjs';
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--file')) throw new Error('Usage: archive-events.mjs [--file path]');
const file = args[1] ?? fileURLToPath(new URL('../content/site.json', import.meta.url));
const source = JSON.parse(fs.readFileSync(file, 'utf8'));
const result = rolloverEvents(source);
const count = source.ticker.length - result.ticker.length;
if (count) {
  const temp = `${file}.rollover-tmp`;
  try { fs.writeFileSync(temp, JSON.stringify(result, null, 2) + '\n', {flag:'wx'}); fs.renameSync(temp,file); }
  finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
console.log(`archived=${count}`);
