import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const walk = (d) => readdirSync(d).flatMap((f) => (['node_modules', 'dist'].includes(f) ? [] : statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = [...walk(join(root, 'src')), ...walk(join(root, 'playground'))].filter((f) => /\.(jsx|js)$/.test(f));

// Tailwind only generates colour-opacity steps in multiples of 5 (e.g. bg-accent/15). Anything else (bg-accent/12) silently produces no CSS,
// so the element falls back to browser defaults: a yellow <mark>, a transparent badge...
test('colour opacity modifiers use steps Tailwind generates', () => {
  const bad = [];
  for (const f of files) {
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      for (const m of line.matchAll(/\b(?:bg|text|border|ring|stroke|fill|shadow|from|to|via|divide|outline|decoration)-[a-z][a-z0-9-]*\/(\d+)\b/g)) {
        if (Number(m[1]) % 5 !== 0 || Number(m[1]) > 100) bad.push(`${f.replace(root, '')}:${i + 1} ${m[0]}`);
      }
    });
  }
  assert.deepEqual(bad, []);
});

test('no hard-coded Tailwind palette colours or white/black utilities in the kit (everything goes through tokens)', () => {
  const bad = [];
  for (const f of files.filter((x) => x.includes('/src/'))) {
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      const m = line.match(/\b(?:bg|text|border|ring|stroke|fill)-(?:white|black|(?:gray|slate|zinc|neutral|stone|red|green|blue|yellow|orange|purple|pink|indigo|teal|cyan|emerald|rose|amber|lime|sky|violet|fuchsia)-\d{2,3})\b/);
      if (m) bad.push(`${f.replace(root, '')}:${i + 1} ${m[0]}`);
    });
  }
  assert.deepEqual(bad, []);
});
