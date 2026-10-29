#!/usr/bin/env node
/**
 * Copy the kit (or just some components) into a project you own.
 *
 *   ui-kit list                                   what is available, with the packages each file needs
 *   ui-kit init <dest>                            copy everything
 *   ui-kit add <Name...> <dest>                   copy only these components and the files they import
 *
 * Options:  --dry-run  show what would happen, write nothing      --force  overwrite files that already exist and differ
 *
 * Existing files are never overwritten silently: identical files are left alone, different ones are skipped
 * (and listed) unless you pass --force.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const EXTRAS = ['styles/kit.css', 'styles/fonts.css', 'tailwind-preset.js'];     // every install needs these
const PEER_HINT = { clsx: '^2.1.1', 'framer-motion': '^11', 'lucide-react': '^0.460.0', react: '^18', 'react-dom': '^18' };
const PROVIDERS = {
  'components/Toast.jsx': '<ToastProvider> around your app (needed by useToast / useNotify)',
  'hooks/useTheme.jsx': '<ThemeProvider> around your app (needed by useTheme / ThemeSwitcher)',
  'layout/CommandPalette.jsx': '<CommandPaletteProvider commands={[...]}> (needed by useCommandPalette)',
};
const USAGE = `usage:
  ui-kit list
  ui-kit init <destination> [--dry-run] [--force]
  ui-kit add <Name...> <destination> [--dry-run] [--force]

examples:
  ui-kit init src/ui-kit
  ui-kit add Button Modal DataTable src/ui-kit`;

const fail = (msg, code = 1) => { console.error(`error: ${msg}`); process.exit(code); };
const posix = (p) => p.split(sep).join('/');

/* ---------------------------------------------------------------- source analysis ---- */

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const allFiles = () => walk(SRC).map((f) => posix(relative(SRC, f)));
const isCode = (f) => /\.(jsx|js)$/.test(f) && f !== 'index.js' && !f.startsWith('styles/') && f !== 'tailwind-preset.js';
const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const cache = new Map();
/** { deps: relative files it imports, packages: external packages, exports: { default, named[] } } */
function analyze(file) {
  if (cache.has(file)) return cache.get(file);
  const text = stripComments(readFileSync(join(SRC, file), 'utf8'));
  const specs = [...text.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const deps = new Set();
  const packages = new Set();
  for (const spec of specs) {
    if (spec.startsWith('.')) {
      const base = posix(join(dirname(file), spec));
      const hit = [base, `${base}.jsx`, `${base}.js`, `${base}/index.js`].find((c) => existsSync(join(SRC, c)) && statSync(join(SRC, c)).isFile());
      if (hit) deps.add(hit);
    } else {
      packages.add(spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);
    }
  }
  const named = new Set([...text.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+([\w$]+)/g)].map((m) => m[1]));
  for (const m of text.matchAll(/export\s*\{([^}]+)\}/g)) m[1].split(',').forEach((s) => { const n = s.trim().split(/\s+as\s+/).pop(); if (n && n !== 'default') named.add(n); });
  const result = { deps: [...deps], packages: [...packages], exports: { default: /export\s+default\b/.test(text), named: [...named] } };
  cache.set(file, result);
  return result;
}

/** The file plus everything it imports, transitively. */
function closure(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  analyze(file).deps.forEach((d) => closure(d, seen));
  return seen;
}

const baseName = (f) => f.replace(/\.(jsx|js)$/, '').split('/').pop();

function resolveName(name) {
  const files = allFiles().filter(isCode);
  const lower = name.toLowerCase().replace(/\.(jsx|js)$/, '');
  const byPath = files.find((f) => f.replace(/\.(jsx|js)$/, '').toLowerCase() === lower);
  const byFile = files.find((f) => baseName(f).toLowerCase() === lower);
  const byExport = files.find((f) => analyze(f).exports.named.some((n) => n.toLowerCase() === lower));
  return byPath || byFile || byExport || null;
}

function suggest(name) {
  const lower = name.toLowerCase();
  const pool = new Map();
  for (const f of allFiles().filter(isCode)) { pool.set(baseName(f), f); analyze(f).exports.named.forEach((n) => pool.set(n, f)); }
  return [...pool.keys()].filter((k) => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()) || distance(k.toLowerCase(), lower) <= 2).slice(0, 5);
}
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/* ------------------------------------------------------------------------ copying ---- */

/** Copies files, never overwriting a different existing file unless `force`. Returns counts and prints one line per file. */
function copyFiles(files, dest, { force, dryRun }) {
  const counts = { added: 0, unchanged: 0, skipped: 0, overwritten: 0 };
  for (const f of files) {
    const from = join(SRC, f);
    const to = join(dest, f);
    const content = readFileSync(from);
    let tag;
    if (!existsSync(to)) { tag = 'added'; console.log(`  + ${f}`); }
    else if (readFileSync(to).equals(content)) { tag = 'unchanged'; console.log(`  = ${f} (already up to date)`); }
    else if (force) { tag = 'overwritten'; console.log(`  ~ ${f} (overwritten)`); }
    else { tag = 'skipped'; console.log(`  ! ${f} exists and differs: skipped (use --force to overwrite)`); }
    counts[tag]++;
    if (!dryRun && (tag === 'added' || tag === 'overwritten')) { mkdirSync(dirname(to), { recursive: true }); writeFileSync(to, content); }
  }
  return counts;
}

function readProject() {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    return { found: true, deps: { ...pkg.devDependencies, ...pkg.dependencies } };
  } catch {
    return { found: false, deps: {} };
  }
}

function printNext(files, dest, wanted, { dryRun }) {
  const project = readProject();
  const packages = new Set(['clsx']);
  for (const f of files) if (isCode(f)) analyze(f).packages.forEach((p) => packages.add(p));
  packages.delete('react-dom');                                                 // always present next to react
  const missing = [...packages].filter((p) => !project.deps[p]).sort();
  const rel = posix(relative(process.cwd(), dest)) || '.';
  const here = rel.startsWith('.') ? rel : `./${rel}`;
  const tailwind = String(project.deps.tailwindcss || '');

  console.log(`\n${dryRun ? 'Dry run: nothing was written. ' : ''}Destination: ${dest}\n\nNext steps:`);
  let n = 1;
  const step = (text) => console.log(`  ${n++}. ${text}`);
  if (!project.found) console.log('  (no package.json in the current directory: run these from your project root so the checks below can see your dependencies)');
  if (missing.length) step(`npm i ${missing.join(' ')}`);
  if (!project.deps.tailwindcss) step('npm i -D tailwindcss@3 postcss autoprefixer   (the kit targets Tailwind 3.4)');
  else if (/^\D*4/.test(tailwind)) console.log(`  ! tailwindcss ${tailwind} is installed, but the kit's preset and @apply classes target Tailwind 3.4. Use tailwindcss@3.`);
  step(`tailwind.config.js:  import kit from '${here}/tailwind-preset.js';\n       export default { presets: [kit], content: ['./index.html', './src/**/*.{js,jsx}'] }   // the glob must cover ${here}`);
  step(`your entry CSS:  @import '${here}/styles/kit.css';   (contains the @tailwind directives and every theme token; needs postcss-import, which Vite includes)`);
  step(`optional fonts:  npm i @fontsource/anton @fontsource-variable/geist @fontsource-variable/geist-mono, then @import '${here}/styles/fonts.css';   (without them the kit falls back to system fonts)`);
  const providers = [...files].filter((f) => PROVIDERS[f]).map((f) => PROVIDERS[f]);
  if (providers.length) step(`wrap your app:  ${providers.join('; ')}`);
  if (files.includes('utils/link.jsx')) console.log('     optional: <LinkProvider component={RouterLink}> makes navigating components use your router instead of <a>.');
  if (wanted.length) {
    console.log('\nImports:');
    for (const { name, file } of wanted) {
      const ex = analyze(file).exports;
      const id = ex.named.find((x) => x.toLowerCase() === name.toLowerCase());
      const spec = `${here}/${file.replace(/\.(jsx|js)$/, '')}`;
      console.log(`  import ${id ? `{ ${id} }` : ex.default ? baseName(file) : `{ ${ex.named.join(', ')} }`} from '${spec}';`);
    }
  }
}

/* -------------------------------------------------------------------------- main ---- */

const argv = process.argv.slice(2);
const flagList = argv.filter((a) => a.startsWith('-'));
const args = argv.filter((a) => !a.startsWith('-'));
const unknown = flagList.filter((f) => !['--force', '--dry-run', '--help', '-h'].includes(f));
if (unknown.length) fail(`unknown option ${unknown.join(', ')}\n\n${USAGE}`);
const opts = { force: flagList.includes('--force'), dryRun: flagList.includes('--dry-run') };
const [cmd, ...rest] = args;

function checkDest(raw) {
  if (!raw) fail(`missing destination folder.\n\n${USAGE}`);
  const dest = resolve(raw);
  if (existsSync(dest) && !statSync(dest).isDirectory()) fail(`destination "${raw}" exists and is a file, not a folder.`);
  if (dest === ROOT || dest.startsWith(SRC + sep) || dest === SRC) fail('destination is inside the kit itself. Choose a folder in your own project, e.g. src/ui-kit.');
  return dest;
}

if (!cmd || cmd === 'help' || flagList.includes('--help') || flagList.includes('-h')) {
  console.log(USAGE);
} else if (cmd === 'list') {
  const files = allFiles().filter(isCode);
  const width = Math.max(...files.map((f) => f.length));
  let group = '';
  for (const f of files) {
    const g = f.split('/')[0];
    if (g !== group) { group = g; console.log(`\n${g}/`); }
    const a = analyze(f);
    const names = a.exports.named.length ? a.exports.named.join(', ') : a.exports.default ? `${baseName(f)} (default)` : '';
    const needs = a.packages.filter((p) => p !== 'react' && p !== 'react-dom');
    console.log(`  ${f.padEnd(width)}  ${names}${needs.length ? `   [needs: ${needs.join(', ')}]` : ''}`);
  }
  console.log('\nAdd any of these by file name or export name: ui-kit add Button DataTable src/ui-kit');
} else if (cmd === 'init') {
  if (rest.length !== 1) fail(`init takes exactly one destination folder, got ${rest.length}.\n\n${USAGE}`);
  const dest = checkDest(rest[0]);
  const files = allFiles();
  const counts = copyFiles(files, dest, opts);
  console.log(`\n${counts.added} added, ${counts.unchanged} unchanged, ${counts.overwritten} overwritten, ${counts.skipped} skipped.`);
  printNext(files, dest, [], opts);
  if (counts.skipped) process.exitCode = 2;
} else if (cmd === 'add') {
  if (rest.length < 2) {
    const only = rest[0];
    fail(only && resolveName(only) ? `missing destination folder. Did you mean:  ui-kit add ${only} src/ui-kit` : `usage: ui-kit add <Name...> <destination>\n\n${USAGE}`);
  }
  const names = rest.slice(0, -1);
  const destArg = rest.at(-1);
  if (resolveName(destArg) && !existsSync(resolve(destArg)) && !/[\\/]/.test(destArg)) {
    fail(`"${destArg}" looks like a component name, not a folder. Put the destination last:  ui-kit add ${rest.slice(0, -1).join(' ')} ${destArg} src/ui-kit`);
  }
  const dest = checkDest(destArg);
  const wanted = [];
  const bad = [];
  for (const n of names) { const file = resolveName(n); file ? wanted.push({ name: n, file }) : bad.push(n); }
  if (bad.length) {
    fail(bad.map((n) => { const s = suggest(n); return `no component named "${n}".${s.length ? ` Did you mean: ${s.join(', ')}?` : ''}`; }).join('\n') + '\nRun `ui-kit list` to see everything available. Nothing was copied.');
  }
  const files = new Set(EXTRAS);
  wanted.forEach(({ file }) => closure(file).forEach((f) => files.add(f)));
  const ordered = [...files].sort();
  const counts = copyFiles(ordered, dest, opts);
  console.log(`\n${counts.added} added, ${counts.unchanged} unchanged, ${counts.overwritten} overwritten, ${counts.skipped} skipped.`);
  printNext(ordered, dest, wanted, opts);
  if (counts.skipped) process.exitCode = 2;
} else {
  fail(`unknown command "${cmd}".\n\n${USAGE}`);
}
