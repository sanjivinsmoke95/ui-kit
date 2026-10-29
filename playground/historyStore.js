import { useSyncExternalStore } from 'react';

/** Tiny persisted store shared by the Search and History pages. Storage failures are ignored (history then lasts for the session). */
const KEY = 'ui-kit.playground.history';
const ago = (min) => new Date(Date.now() - min * 60000).toISOString();

const seed = () => [
  { id: 's1', type: 'search', title: 'modal', subtitle: '3 results', at: ago(12) },
  { id: 'v1', type: 'visit', title: 'Modal, Drawer, ConfirmDialog', subtitle: 'Components · Overlays', at: ago(11) },
  { id: 'a1', type: 'action', title: 'Added project “Launch landing page”', subtitle: 'Dashboard', at: ago(95) },
  { id: 's2', type: 'search', title: 'dashboard', subtitle: '5 results', at: ago(180) },
  { id: 'v2', type: 'visit', title: 'Theming guide', subtitle: 'Docs', at: ago(24 * 60 + 30) },
  { id: 's3', type: 'search', title: 'dark theme', subtitle: '2 results', at: ago(24 * 60 + 45) },
  { id: 'a2', type: 'action', title: 'Switched theme to Paper Ink', subtitle: 'Settings', at: ago(24 * 60 + 90) },
  { id: 'v3', type: 'visit', title: 'DataTable', subtitle: 'Components · Tables', at: ago(3 * 24 * 60 + 20) },
  { id: 's4', type: 'search', title: 'cli install', subtitle: '1 result', at: ago(3 * 24 * 60 + 60) },
];

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(v) && v.every((x) => x && typeof x.id === 'string' && typeof x.title === 'string' && !Number.isNaN(Date.parse(x.at)))) return v;
  } catch { /* fall through to the seed */ }
  return seed();
}

let items = load();
const listeners = new Set();
const set = (next) => {
  items = next;
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  listeners.forEach((l) => l());
};

export const history = {
  get: () => items,
  subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  /** Adds an entry; a repeated search / visit moves to the top instead of duplicating. */
  add(entry) {
    const rest = items.filter((i) => !(i.type === entry.type && i.title.toLowerCase() === entry.title.toLowerCase() && entry.type !== 'action'));
    set([{ id: `h${Date.now()}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), ...entry }, ...rest]);
  },
  remove: (id) => set(items.filter((i) => i.id !== id)),
  clear: () => set([]),
  removeWhere: (fn) => set(items.filter((i) => !fn(i))),
};

export const useHistory = () => useSyncExternalStore(history.subscribe, history.get);
