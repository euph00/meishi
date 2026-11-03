import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { renderContent, renderPostPages } from '../scripts/render-content.js';

test('unpublished notes show a non-link empty placeholder and generate no post pages', () => {
  const content = JSON.parse(fs.readFileSync(new URL('../content/site.json', import.meta.url), 'utf8'));
  assert.deepEqual(content.posts, []);
  const full = renderContent(fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8'));
  const html = full.match(/<section id="notes"[\s\S]*?<\/section>/)[0];
  assert.match(html, /<p[^>]*>No posts yet\.<\/p>/);
  assert.doesNotMatch(html, /<a\b|post-row|Photocopy Machine/);
  assert.deepEqual(renderPostPages(), []);
});
