import { useCallback, useEffect, useMemo, useState } from 'react';
import { Brand, Button, CommandPaletteProvider, InteractiveBackground, LandingPage, ThemeSwitcher } from '../src';
import { BookOpen, History, LayoutDashboard, Layers, Search } from 'lucide-react';
import DashboardPage from './DashboardPage';
import Gallery from './Gallery';
import HistoryPage from './HistoryPage';
import SearchPage from './SearchPage';
import { studyvexPage } from './studyvexLanding';

const PAGES = ['site', 'dashboard', 'search', 'history', 'components'];
const TITLES = { site: 'StudyVex site', dashboard: 'Dashboard', search: 'Search', history: 'History', components: 'UI Kit Workbench' };
const readPage = () => { const p = new URLSearchParams(window.location.search).get('page'); return PAGES.includes(p) ? p : 'site'; };

/** Root of the playground: five views of the same kit sharing one theme, one shell and one history, joined by plain `?page=` links. */
export default function App() {
  const [page, setPage] = useState(readPage);

  /** Go to any "?page=…[&q=…][#anchor]" link without a reload. */
  const go = useCallback((href) => {
    const url = new URL(href, window.location.href);
    if (!PAGES.includes(url.searchParams.get('page'))) return;
    const samePage = url.searchParams.get('page') === new URLSearchParams(window.location.search).get('page');
    window.history.pushState(null, '', url);
    setPage(readPage());
    if (url.hash) setTimeout(() => document.querySelector(url.hash)?.scrollIntoView({ block: 'start' }), 80);
    else if (!samePage) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const pop = () => setPage(readPage());
    const click = (e) => {
      const a = e.target.closest?.('a[href^="?page="]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(a.getAttribute('href'));
    };
    window.addEventListener('popstate', pop);
    document.addEventListener('click', click);
    return () => { window.removeEventListener('popstate', pop); document.removeEventListener('click', click); };
  }, [go]);

  useEffect(() => { document.title = TITLES[page]; }, [page]);

  const commands = useMemo(() => [
    { id: 'p-dashboard', group: 'Go to', label: 'Dashboard', icon: LayoutDashboard, run: () => go('?page=dashboard') },
    { id: 'p-search', group: 'Go to', label: 'Search', icon: Search, run: () => go('?page=search') },
    { id: 'p-history', group: 'Go to', label: 'History', icon: History, run: () => go('?page=history') },
    { id: 'p-components', group: 'Go to', label: 'Components', icon: Layers, run: () => go('?page=components') },
    { id: 'p-site', group: 'Go to', label: 'Website', icon: BookOpen, run: () => go('?page=site') },
  ], [go]);
  const onQuery = useCallback((text) => ({ id: 'q', group: 'Search', label: `Search for “${text}”`, icon: Search, run: () => go(`?page=search&q=${encodeURIComponent(text)}`) }), [go]);

  const site = {
    ...studyvexPage,
    nav: {
      links: [...studyvexPage.nav.links, { label: 'Dashboard', href: '?page=dashboard' }, { label: 'Search', href: '?page=search' }, { label: 'Components', href: '?page=components' }],
      actions: <><ThemeSwitcher /><Button variant="outline" size="sm" as="a" href="?page=history">History</Button><Button variant="primary" size="sm" as="a" href="?page=dashboard">Open dashboard</Button></>,
    },
    hero: { ...studyvexPage.hero, background: <InteractiveBackground variant="network" /> },
  };

  if (page === 'components') return <Gallery />;                       // the workbench has its own command palette
  return (
    <CommandPaletteProvider commands={commands} onQuery={onQuery} placeholder="Jump to a page or search…">
      {page === 'site' && <LandingPage brand={<Brand name="studyvex" />} {...site} />}
      {page === 'dashboard' && <DashboardPage />}
      {page === 'search' && <SearchPage />}
      {page === 'history' && <HistoryPage />}
    </CommandPaletteProvider>
  );
}
