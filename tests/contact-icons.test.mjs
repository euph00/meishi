import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { renderContent } from '../scripts/render-content.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('TwiPla contact uses a calendar icon in hero and footer', () => {
  const contact = content.contacts.find(({ label }) => label === 'TwiPla');
  assert.equal(contact.icon, 'calendar');
  const html = renderContent(template);
  assert.match(html, /<symbol id="ic-calendar"[^>]*>[\s\S]*?<\/symbol>/);
  assert.equal((html.match(/<use href="#ic-calendar"\/>/g) ?? []).length, 2);
  assert.equal((html.match(/href="https:\/\/twipla\.jp\/users\/e_uph00"/g) ?? []).length, 2);
});

test('Discord contact uses its recognizable mark in hero and footer', () => {
  const contact = content.contacts.find(({ label }) => label === 'Discord');
  assert.equal(contact.icon, 'discord');
  const html = renderContent(template);
  assert.match(html, /<symbol id="ic-discord"[^>]*>[\s\S]*?<\/symbol>/);
  assert.equal((html.match(/<use href="#ic-discord"\/>/g) ?? []).length, 2);
  assert.equal((html.match(/href="https:\/\/discordapp\.com\/users\/249821918784389120"/g) ?? []).length, 2);
});
