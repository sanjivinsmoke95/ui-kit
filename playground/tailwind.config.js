import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import kit from '../src/tailwind-preset.js';

// Tailwind resolves relative globs from the cwd, so anchor them to this folder (and skip node_modules / dist).
const here = dirname(fileURLToPath(import.meta.url));
export default { presets: [kit], content: [join(here, 'index.html'), join(here, '*.{js,jsx}'), join(here, '../src/**/*.{js,jsx}')] };
