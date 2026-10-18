import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { themes as defaultThemes } from '../config/themes';

const ThemeContext = createContext(null);

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (rgb, target, amount) => rgb.map((c, i) => Math.round(c + (target[i] - c) * amount));

function readStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

/** Writes the theme (and an optional accent override) onto <html>. Colors live in styles/kit.css under [data-theme]. */
function applyTheme(themes, theme, accent) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (!accent) {
    ['--accent', '--accent-text'].forEach((v) => root.style.removeProperty(v));
    return;
  }
  const rgb = hexToRgb(accent);
  const isDark = themes.find((t) => t.id === theme)?.dark;          // on dark surfaces the raw accent is too dim for text, so lighten it
  const text = isDark ? mix(rgb, [255, 255, 255], 0.4) : mix(rgb, [0, 0, 0], 0.15);
  root.style.setProperty('--accent', rgb.join(' '));
  root.style.setProperty('--accent-text', text.join(' '));
}

/**
 * Theme + accent state, remembered in localStorage.
 *   <ThemeProvider defaultTheme="blue" storageKey="my-app.theme">…</ThemeProvider>
 * Pass `themes` to replace the preset list (each: { id, label, dark?, swatch? }; define matching [data-theme] blocks in your CSS).
 */
export function ThemeProvider({ children, defaultTheme = 'blue', defaultAccent = null, storageKey = 'ui-kit.theme', themes = defaultThemes }) {
  const stored = useMemo(() => readStored(storageKey), [storageKey]);
  const [theme, setTheme] = useState(stored.theme || defaultTheme);
  const [accent, setAccent] = useState(stored.accent ?? defaultAccent);

  useEffect(() => {
    applyTheme(themes, theme, accent);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ theme, accent }));
    } catch {
      /* storage unavailable: the theme still applies for this session */
    }
  }, [theme, accent, storageKey, themes]);

  const set = useCallback((t) => setTheme(t), []);
  const setAcc = useCallback((a) => setAccent(a), []);
  const value = useMemo(() => ({ theme, accent, setTheme: set, setAccent: setAcc, themes }), [theme, accent, set, setAcc, themes]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
