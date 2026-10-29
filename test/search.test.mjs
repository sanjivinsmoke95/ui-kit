import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupByDay } from '../src/utils/dates.js';
import { highlightParts } from '../src/utils/text.js';
import { INDEX, search, suggest } from '../playground/searchData.js';

const joined = (parts) => parts.map((p) => (p.match ? `[${p.text}]` : p.text)).join('');

test('highlightParts marks every word, case-insensitively, and keeps the original casing', () => {
  assert.equal(joined(highlightParts('Modal and DRAWER dialogs', 'modal drawer')), '[Modal] and [DRAWER] dialogs');
  assert.equal(joined(highlightParts('abcabc', 'bc')), 'a[bc]a[bc]');
});

test('highlightParts treats the query as text, never as a regular expression', () => {
  assert.equal(joined(highlightParts('cost is $5 (net) [x] a.b', '(net) [x] $5 a.b')), 'cost is [$5] [(net)] [[x]] [a.b]');
  assert.equal(joined(highlightParts('anything', '.*')), 'anything');
  assert.doesNotThrow(() => highlightParts('x', '\\'));
});

test('highlightParts without a query returns the text untouched', () => {
  assert.deepEqual(highlightParts('hello', ''), [{ text: 'hello', match: false }]);
  assert.deepEqual(highlightParts(undefined, 'a'), []);
});

test('search ranks title matches first and requires every word to match', () => {
  const r = search('modal');
  assert.equal(r[0].title, 'Modal, Drawer, ConfirmDialog');
  assert.ok(search('dark theme').every((x) => /dark|theme/i.test(`${x.title} ${x.snippet} ${x.tags}`)));
  assert.deepEqual(search('zzzzqq'), []);
  assert.deepEqual(search('   '), []);
});

test('search can be narrowed by type and suggestions are capped', () => {
  assert.ok(search('a', 'person').every((x) => x.type === 'person'));
  assert.ok(suggest('o', 4).length <= 4);
  assert.equal(INDEX.length, new Set(INDEX.map((i) => i.id)).size, 'ids are unique');
});

test('groupByDay labels Today and Yesterday and sorts newest first', () => {
  const now = new Date(2026, 10, 10, 15, 0);
  const at = (d, h) => new Date(2026, 10, d, h).toISOString();
  const groups = groupByDay([{ id: 'a', at: at(8, 9) }, { id: 'b', at: at(10, 8) }, { id: 'c', at: at(9, 20) }, { id: 'd', at: at(10, 14) }], now);
  assert.deepEqual(groups.map((g) => g.label), ['Today', 'Yesterday', 'Sun, Nov 8']);
  assert.deepEqual(groups[0].items.map((i) => i.id), ['d', 'b']);
});
