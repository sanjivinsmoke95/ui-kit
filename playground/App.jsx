import { useCallback, useEffect, useState } from 'react';
import { Brand, Button, InteractiveBackground, LandingPage, Segmented, ThemeSwitcher } from '../src';
import DashboardPage from './DashboardPage';
import Gallery from './Gallery';
import { studyvexPage } from './studyvexLanding';

const EMBED = new URLSearchParams(window.location.search).has('embed');
const PAGES = ['site', 'dashboard', 'components'];
const readPage = () => { const p = new URLSearchParams(window.location.search).get('page'); return PAGES.includes(p) ? p : 'site'; };

/** Root of the playground: three views of the same kit (marketing site, dashboard, component workbench) joined by one switcher. */
export default function App() {
  const [page, setPage] = useState(readPage);

  const go = useCallback((next) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', next);
    url.hash = '';
    window.history.pushState(null, '', url);
    setPage(next);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const pop = () => setPage(readPage());
    // any <a href="?page=…"> in the app switches view without a reload
    const click = (e) => {
      const a = e.target.closest?.('a[href^="?page="]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(new URLSearchParams(a.getAttribute('href').slice(1)).get('page'));
    };
    window.addEventListener('popstate', pop);
    document.addEventListener('click', click);
    return () => { window.removeEventListener('popstate', pop); document.removeEventListener('click', click); };
  }, [go]);

  useEffect(() => { document.title = { site: 'StudyVex site', dashboard: 'Dashboard', components: 'UI Kit Workbench' }[page]; }, [page]);

  const site = {
    ...studyvexPage,
    nav: {
      links: [...studyvexPage.nav.links, { label: 'Dashboard', href: '?page=dashboard' }, { label: 'Components', href: '?page=components' }],
      actions: <><ThemeSwitcher /><Button variant="outline" size="sm" as="a" href="?page=dashboard">Open dashboard</Button><Button variant="primary" size="sm" as="a" href="?page=components">Browse components</Button></>,
    },
    hero: { ...studyvexPage.hero, background: <InteractiveBackground variant="network" /> },
  };

  return (
    <>
      {page === 'site' && <LandingPage brand={<Brand name="studyvex" />} {...site} />}
      {page === 'dashboard' && <DashboardPage />}
      {page === 'components' && <Gallery />}
      {!EMBED && (
        <nav aria-label="Switch view" className="fixed bottom-20 left-1/2 z-toast -translate-x-1/2 lg:bottom-5">
          <Segmented label="View" value={page} onChange={go} className="bg-surface shadow-pop"
            options={[{ value: 'site', label: 'Site' }, { value: 'dashboard', label: 'Dashboard' }, { value: 'components', label: 'Components' }]} />
        </nav>
      )}
    </>
  );
}
