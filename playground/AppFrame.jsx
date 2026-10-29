import { Bell, BookOpen, FolderKanban, History as HistoryIcon, LayoutDashboard, Layers, Search } from 'lucide-react';
import { Avatar, AppShell, Brand, Dropdown, IconButton, InteractiveBackground, MobileNav, Sidebar, ThemeSwitcher, Topbar, useCommandPalette, useNotify } from '../src';

export const PAGE_NAV = [
  { id: 'dashboard', label: 'Dashboard', to: '?page=dashboard', icon: LayoutDashboard, mobile: true },
  { id: 'search', label: 'Search', to: '?page=search', icon: Search, mobile: true },
  { id: 'history', label: 'History', to: '?page=history', icon: HistoryIcon, mobile: true },
  { id: 'components', label: 'Components', to: '?page=components', icon: Layers, mobile: true },
  { id: 'site', label: 'Website', to: '?page=site', icon: BookOpen, group: 'More' },
  { id: 'projects', label: 'Projects', to: '?page=dashboard', icon: FolderKanban, group: 'More' },
];

/** The one shell every app page shares: same sidebar, topbar, theme switcher, notifications and interactive background. */
export default function AppFrame({ page, crumb, children }) {
  const palette = useCommandPalette();
  const notify = useNotify();
  const nav = PAGE_NAV.filter((n) => n.id !== 'projects');
  return (
    <>
      <InteractiveBackground className="fixed inset-0 z-0 opacity-60" />
      <AppShell className="relative z-10"
        sidebar={<Sidebar brand={<Brand name="Donezo" />} items={nav.map((n) => ({ ...n, group: n.id === 'site' ? 'More' : undefined }))} activePath={`?page=${page}`} user={{ name: 'Totok Michael', subtitle: 'tmichael20@mail.com' }} />}
        topbar={<Topbar brand={<Brand name="Donezo" />} breadcrumbs={[{ label: 'Workspace' }, { label: crumb }]} onSearch={palette.open}
          right={<><ThemeSwitcher />
            <Dropdown label="Notifications" width="w-72" trigger={({ open, ...p }) => <IconButton icon={Bell} label="Notifications" tooltip={!open} {...p} />}
              items={[{ heading: 'Notifications' }, { label: 'Edwin pushed to main', onClick: () => notify('Opened commit') }, { label: 'Meeting at 2:00 PM', onClick: () => notify('Added to calendar') }, { separator: true }, { label: 'Mark all as read', onClick: () => notify('All caught up') }]} />
            <Avatar name="Totok Michael" /></>} />}
        mobileNav={<MobileNav items={nav.filter((n) => n.mobile)} activePath={`?page=${page}`} />}>
        {children}
      </AppShell>
    </>
  );
}
