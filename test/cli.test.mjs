import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';

const CLI = fileURLToPath(new URL('../bin/ui-kit.mjs', import.meta.url));
let cwd;
before(() => {
  cwd = mkdtempSync(join(tmpdir(), 'ui-kit-cli-'));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ dependencies: { react: '^18', tailwindcss: '^3.4.0' } }));
});
after(() => rmSync(cwd, { recursive: true, force: true }));

const run = (...args) => {
  const r = spawnSync('node', [CLI, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const has = (p) => existsSync(join(cwd, p));

test('list shows grouped files with their exports and required packages', () => {
  const { code, out } = run('list');
  assert.equal(code, 0);
  assert.match(out, /components\/Table\.jsx\s+.*DataTable/);
  assert.match(out, /components\/Button\.jsx.*\[needs: lucide-react\]/);
});

test('add copies a component with its nested relative imports and the shared setup files', () => {
  const { code, out } = run('add', 'Modal', 'a/ui');
  assert.equal(code, 0);
  // Modal imports hooks/useOverlay, utils/cn and IconButton, which itself imports Tooltip
  for (const f of ['components/Modal.jsx', 'components/IconButton.jsx', 'components/Tooltip.jsx', 'hooks/useOverlay.js', 'utils/cn.js', 'styles/kit.css', 'tailwind-preset.js']) assert.ok(has(`a/ui/${f}`), `${f} missing`);
  assert.ok(!has('a/ui/components/Table.jsx'), 'unrelated components must not be copied');
  assert.match(out, /npm i clsx framer-motion lucide-react/);                  // only what is missing from package.json
  assert.doesNotMatch(out, /npm i -D tailwindcss/);                              // already installed
  assert.match(out, /import Modal from '\.\/a\/ui\/components\/Modal'/);
});

test('add resolves exports that live in another file (DataTable -> Table.jsx) case-insensitively', () => {
  const { code, out } = run('add', 'datatable', 'b/ui');
  assert.equal(code, 0);
  assert.ok(has('b/ui/components/Table.jsx'));
  assert.match(out, /import \{ DataTable \} from/);
});

test('add reports provider requirements', () => {
  const { out } = run('add', 'ToastProvider', 'c/ui');
  assert.match(out, /<ToastProvider>/);
});

test('an unknown name fails with a suggestion and copies nothing', () => {
  const { code, err } = run('add', 'Buton', 'Modal', 'd/ui');
  assert.equal(code, 1);
  assert.match(err, /no component named "Buton".*Button/);
  assert.ok(!has('d'), 'nothing may be written when any name is invalid');
});

test('a missing destination is explained, including the case where the last arg is a component', () => {
  assert.match(run('add', 'Button').err, /missing destination.*ui-kit add Button src\/ui-kit/);
  assert.match(run('add', 'Button', 'Modal').err, /looks like a component name/);
  assert.equal(run('init').code, 1);
});

test('existing different files are skipped by default, and overwritten only with --force', () => {
  run('add', 'Button', 'e/ui');
  const file = join(cwd, 'e/ui/components/Button.jsx');
  writeFileSync(file, '// my edits\n');
  const skip = run('add', 'Button', 'e/ui');
  assert.equal(skip.code, 2);
  assert.match(skip.out, /! components\/Button\.jsx exists and differs: skipped/);
  assert.equal(readFileSync(file, 'utf8'), '// my edits\n');
  const forced = run('add', 'Button', 'e/ui', '--force');
  assert.equal(forced.code, 0);
  assert.notEqual(readFileSync(file, 'utf8'), '// my edits\n');
});

test('re-running over identical files is a no-op', () => {
  run('add', 'Tooltip', 'f/ui');
  const again = run('add', 'Tooltip', 'f/ui');
  assert.equal(again.code, 0);
  assert.match(again.out, /0 added, \d+ unchanged, 0 overwritten, 0 skipped/);
});

test('--dry-run writes nothing', () => {
  const { code, out } = run('add', 'Table', 'g/ui', '--dry-run');
  assert.equal(code, 0);
  assert.match(out, /\+ components\/Table\.jsx/);
  assert.ok(!has('g'));
});

test('init copies the whole kit including the index barrel', () => {
  const { code } = run('init', 'h/ui');
  assert.equal(code, 0);
  for (const f of ['index.js', 'components/Button.jsx', 'layout/AppShell.jsx', 'charts/LineChart.jsx', 'hooks/useTheme.jsx', 'utils/color.js']) assert.ok(has(`h/ui/${f}`), `${f} missing`);
});

test('destination that is a file, unknown commands and unknown flags are rejected', () => {
  writeFileSync(join(cwd, 'afile'), 'x');
  assert.match(run('init', 'afile').err, /is a file/);
  assert.equal(run('wat').code, 1);
  assert.match(run('list', '--nope').err, /unknown option/);
});

test('every copied file only imports files that were also copied (no dangling relative imports)', () => {
  mkdirSync(join(cwd, 'z'), { recursive: true });
  for (const name of ['Table', 'Dropdown', 'StatCard', 'Sidebar', 'CommandPaletteProvider', 'ThemeSwitcher', 'TagInput', 'LineChart']) {
    const dest = `z/${name}`;
    assert.equal(run('add', name, dest).code, 0, name);
  }
  // build a quick import check over everything under z/
  const walk = (d) => spawnSync('find', [d, '-name', '*.js*'], { encoding: 'utf8' }).stdout.split('\n').filter(Boolean);
  for (const f of walk(join(cwd, 'z'))) {
    const text = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const m of text.matchAll(/from\s+'(\.[^']+)'/g)) {
      const base = join(f, '..', m[1]);
      assert.ok(['', '.js', '.jsx', '/index.js'].some((e) => existsSync(base + e)), `${f} imports missing ${m[1]}`);
    }
  }
});
