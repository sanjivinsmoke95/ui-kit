#!/usr/bin/env node
/**
 * Copy the kit (or just some components) into a project you own.
 *
 *   node bin/ui-kit.mjs init ../my-app/src/ui-kit          copy everything
 *   node bin/ui-kit.mjs add Button Modal Table ../my-app/src/ui-kit    copy only these (and what they import)
 *   node bin/ui-kit.mjs list                               show what is available
 *
 * Copying (rather than installing) means you can edit anything freely; re-run to pull updates.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const [cmd, ...args] = process.argv.slice(2);

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const components = () => walk(SRC).filter((f) => /\.(jsx|js)$/.test(f) && !f.endsWith('index.js') && !f.includes('styles')).map((f) => relative(SRC, f));

function deps(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  const text = readFileSync(join(SRC, file), 'utf8');
  for (const m of text.matchAll(/from\s+'(\.[^']+)'/g)) {
    const base = join(dirname(file), m[1]);
    const hit = ['.jsx', '.js', '/index.js', ''].map((e) => base + e).find((c) => existsSync(join(SRC, c)) && statSync(join(SRC, c)).isFile());
    if (hit) deps(hit, seen);
  }
  return seen;
}

function next(dest) {
  console.log(`\nCopied into ${dest}\n
Next steps:
  1. npm i clsx framer-motion lucide-react  (and tailwindcss@3 postcss autoprefixer if you have no Tailwind yet)
  2. tailwind.config.js:   import kit from '<path>/tailwind-preset.js';   export default { presets: [kit], content: ['./index.html', './src/**/*.{js,jsx}'] }
  3. In your entry CSS:    @import '<path>/styles/kit.css';   (it contains the @tailwind directives and all theme tokens)
  4. Optional fonts:       npm i @fontsource/anton @fontsource-variable/geist @fontsource-variable/geist-mono, then import '<path>/styles/fonts.css'
  5. Wrap your app:        <ThemeProvider><ToastProvider><LinkProvider component={RouterLink}>…</LinkProvider></ToastProvider></ThemeProvider>
`);
}

if (cmd === 'list') {
  console.log(components().join('\n'));
} else if (cmd === 'init') {
  const dest = resolve(args[0] || 'src/ui-kit');
  mkdirSync(dest, { recursive: true });
  cpSync(SRC, dest, { recursive: true });
  next(dest);
} else if (cmd === 'add') {
  const dest = resolve(args.at(-1));
  const names = args.slice(0, -1);
  if (!names.length || !args.at(-1)) { console.error('usage: ui-kit add <Name...> <destination>'); process.exit(1); }
  const all = components();
  const files = new Set();
  for (const n of names) {
    // match a file name (Modal) or any exported name (DataTable lives in Table.jsx)
    const exported = new RegExp(`export\\s+(?:default\\s+)?(?:function|const|class)\\s+${n}\\b`);
    const hit = all.find((f) => f.replace(/\.(jsx|js)$/, '').split('/').pop().toLowerCase() === n.toLowerCase())
      || all.find((f) => exported.test(readFileSync(join(SRC, f), 'utf8')));
    if (!hit) { console.error(`No component named "${n}". Run: ui-kit list`); process.exit(1); }
    deps(hit).forEach((f) => files.add(f));
  }
  for (const f of files) { mkdirSync(dirname(join(dest, f)), { recursive: true }); cpSync(join(SRC, f), join(dest, f)); }
  for (const extra of ['styles/kit.css', 'styles/fonts.css', 'tailwind-preset.js']) { mkdirSync(dirname(join(dest, extra)), { recursive: true }); cpSync(join(SRC, extra), join(dest, extra)); }
  console.log([...files].map((f) => `  + ${f}`).join('\n'));
  next(dest);
} else {
  console.log('usage: ui-kit init <dest> | add <Name...> <dest> | list');
}
