import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// A production build does not fail on an undefined JSX component, only the browser does. Guard the playground files against that.
for (const file of ['Gallery.jsx', 'studyvexLanding.jsx', 'landing.jsx', 'main.jsx']) {
  test(`playground/${file}: every JSX component is imported or defined`, () => {
    const raw = readFileSync(new URL(`../playground/${file}`, import.meta.url), 'utf8');
    // ignore text inside comments, template-literal code samples and quoted strings
    const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/`(?:[^`\\]|\\.)*`/g, '``').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
    const used = [...new Set([...src.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((m) => m[1]))];
    const imported = new Set([...src.matchAll(/import\s*\{([^}]+)\}\s*from/gms)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop())));
    for (const m of src.matchAll(/import\s+([A-Z]\w*)\s+from/g)) imported.add(m[1]);
    const local = new Set([...src.matchAll(/^(?:export\s+)?(?:function|const|class)\s+([A-Z]\w*)/gm)].map((m) => m[1]));
    const missing = used.filter((u) => !imported.has(u) && !local.has(u) && u !== 'Render' && !/^(Component)$/.test(u));
    assert.deepEqual(missing, []);
  });
}

test('everything the playground imports from ../src is really exported by src/index.js', () => {
  const index = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8');
  const exported = new Set();
  for (const m of index.matchAll(/export\s*\{([^}]+)\}/g)) m[1].split(',').forEach((s) => exported.add(s.trim().split(/\s+as\s+/).pop()));
  for (const m of index.matchAll(/export\s*\{\s*default as (\w+)/g)) exported.add(m[1]);
  const src = readFileSync(new URL('../playground/Gallery.jsx', import.meta.url), 'utf8');
  const names = src.match(/import\s*\{([^}]+)\}\s*from\s*'\.\.\/src'/s)[1].split(',').map((s) => s.trim()).filter(Boolean);
  assert.deepEqual(names.filter((n) => !exported.has(n)), []);
});
