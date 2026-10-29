import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { themes } from '../src/config/themes.js';
import { contrast } from '../src/utils/color.js';

const css = readFileSync(new URL('../src/styles/kit.css', import.meta.url), 'utf8');

/** Collects `--name: r g b;` triplets for a theme: :root first, then the theme's own block(s) on top. */
function tokens(id) {
  const out = {};
  const blocks = [...css.matchAll(/(^|\n)([^{}\n]*)\{([^{}]*)\}/g)].filter(([, , sel]) => (id === 'dark' ? /:root|\[data-theme='dark'\]/.test(sel) : sel.trim() === `[data-theme='${id}']`) || sel.trim() === ':root');
  for (const [, , , body] of blocks) for (const m of body.matchAll(/--([\w-]+):\s*(\d+) (\d+) (\d+)\s*;/g)) out[m[1]] = [+m[2], +m[3], +m[4]];
  return out;
}

const PAIRS = [
  // [foreground token, background token, minimum ratio, why]
  ['fg', 'bg', 7, 'body text'],
  ['fg', 'surface', 7, 'text on cards'],
  ['fg-2', 'surface', 4.5, 'secondary text on cards'],
  ['fg-2', 'bg', 4.5, 'secondary text on page'],
  ['fg-3', 'surface', 4.5, 'tertiary text / placeholders on cards'],
  ['fg-3', 'bg', 4.5, 'tertiary text on page'],
  ['accent-fg', 'accent', 4.5, 'primary button label'],
  ['accent-text', 'surface', 4.5, 'accent links on cards'],
  ['accent-text', 'bg', 4.5, 'accent links on page'],
  ['danger-fg', 'danger', 4.5, 'danger button label'],
  ['danger', 'surface', 3, 'danger text/icons on cards (large or icon)'],
  ['success', 'surface', 3, 'success text/icons on cards'],
  ['warning', 'surface', 3, 'warning text/icons on cards'],
];

for (const theme of themes) {
  test(`theme "${theme.id}" meets contrast targets`, () => {
    const t = tokens(theme.id);
    const failures = [];
    for (const [a, b, min, why] of PAIRS) {
      if (!t[a] || !t[b]) { failures.push(`${a}/${b} missing`); continue; }
      const ratio = contrast(t[a], t[b]);
      if (ratio < min) failures.push(`${why}: ${a} on ${b} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
    }
    assert.deepEqual(failures, []);
  });
}

test('every listed theme has a [data-theme] block (dark may live on :root)', () => {
  for (const { id } of themes) assert.ok(id === 'dark' || css.includes(`[data-theme='${id}']`), `${id} has no CSS block`);
});
