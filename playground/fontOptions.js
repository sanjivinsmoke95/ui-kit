/** Font pairings to choose from. `display` is the headline / KPI-number face, `sans` is body and UI, `mono` is labels and numbers. */
export const FONT_OPTIONS = [
  { id: 'geist', name: 'Geist + Anton', note: 'Current: loud condensed caps headlines, neutral body', display: 'Anton', sans: 'Geist Variable', mono: 'Geist Mono Variable', weight: 400, transform: 'uppercase' },
  { id: 'inter-bricolage', name: 'Inter + Bricolage Grotesque', note: 'Characterful headlines, very legible UI', display: 'Bricolage Grotesque Variable', sans: 'Inter Variable', mono: 'JetBrains Mono Variable', weight: 700, transform: 'none' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', note: 'Friendly, modern and rounded; one family throughout', display: 'Plus Jakarta Sans Variable', sans: 'Plus Jakarta Sans Variable', mono: 'JetBrains Mono Variable', weight: 800, transform: 'none' },
  { id: 'dm-grotesk', name: 'DM Sans + Space Grotesk', note: 'Geometric and techy, fits the hard-edged Paper theme', display: 'Space Grotesk Variable', sans: 'DM Sans Variable', mono: 'Space Mono', weight: 700, transform: 'none' },
  { id: 'manrope-sora', name: 'Manrope + Sora', note: 'Wide, calm and premium; good for finance and SaaS', display: 'Sora Variable', sans: 'Manrope Variable', mono: 'JetBrains Mono Variable', weight: 700, transform: 'none' },
  { id: 'space', name: 'Space Grotesk + Space Mono', note: 'Quirky and engineered, a strong "tech" voice', display: 'Space Grotesk Variable', sans: 'Space Grotesk Variable', mono: 'Space Mono', weight: 700, transform: 'none' },
];

const KEY = 'ui-kit.playground.font';
const find = (id) => FONT_OPTIONS.find((f) => f.id === id);

export function savedFont() {
  try { return find(localStorage.getItem(KEY))?.id || FONT_OPTIONS[0].id; } catch { return FONT_OPTIONS[0].id; }
}

/** Applies a pairing by setting the CSS variables the Tailwind preset reads. Unknown ids are ignored. */
export function applyFont(id) {
  const f = find(id);
  if (!f) return false;
  const root = document.documentElement.style;
  const q = (n) => `"${n}"`;
  root.setProperty('--font-display', q(f.display));
  root.setProperty('--font-sans', q(f.sans));
  root.setProperty('--font-mono', q(f.mono));
  root.setProperty('--display-weight', String(f.weight));
  root.setProperty('--display-transform', f.transform);
  try { localStorage.setItem(KEY, f.id); } catch { /* storage unavailable */ }
  window.dispatchEvent(new CustomEvent('ui-kit:font', { detail: f.id }));
  return true;
}
