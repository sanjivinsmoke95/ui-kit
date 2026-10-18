import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, Bell, Boxes, Layers, MousePointerClick, PanelsTopLeft, Plus, Rows3, Sparkles, SquarePen, Star, Table2, Type } from 'lucide-react';
import {
  ActivityTimeline, Alert, Brand, AnimatedValue, AppShell, Avatar, Badge, BarChart, Banner, Breadcrumb, BurstToggle, Button, Card, Checkbox, Chip, ComparisonView,
  CommandPaletteProvider, ConfirmDialog, DataTable, DonutChart, Drawer, Dropdown, EmptyState, ErrorState, Field, FileGlyph, IconButton, Input, ItemCard,
  LevelBadge, LineChart, LoadingState, Marquee, MobileNav, Modal, PageHeader, Pagination, Pill, PriorityBars, ProgressBar, ProgressChart, ProgressCircle, RevealText,
  RotatingText, SearchInput, Section, Segmented, Select, Sidebar, Skeleton, Spinner, SpotlightCard, Sparkline, StatCard, StatGroup, StatusBadge, TabPanel, Tabs,
  TagInput, Textarea, ThemeSwitcher, Toggle, Tooltip, Topbar, useNotify,
} from '../src';

const NAV = [
  { id: 'buttons', label: 'Buttons', to: '#buttons', icon: MousePointerClick, mobile: true },
  { id: 'forms', label: 'Forms', to: '#forms', icon: SquarePen, mobile: true },
  { id: 'cards', label: 'Cards & KPIs', to: '#cards', icon: PanelsTopLeft, mobile: true },
  { id: 'feedback', label: 'Badges & alerts', to: '#feedback', icon: Bell, group: 'More' },
  { id: 'overlays', label: 'Overlays & menus', to: '#overlays', icon: Layers, group: 'More', mobile: true },
  { id: 'data', label: 'Tables', to: '#data', icon: Table2, group: 'More' },
  { id: 'charts', label: 'Charts', to: '#charts', icon: BarChart3, group: 'More', mobile: true },
  { id: 'effects', label: 'Effects & type', to: '#effects', icon: Sparkles, group: 'More' },
];

const ROWS = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: ['Two Sum', 'Course Schedule', 'Coin Change', 'Watermelon', 'Chat Room'][i % 5] + ` #${i + 1}`, level: ['Critical', 'High', 'Medium', 'Low'][i % 4], score: 20 + ((i * 37) % 80) }));

function Block({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="t-section mb-4">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

const Row = ({ children, className = '' }) => <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;

export default function Gallery() {
  const notify = useNotify();
  const [hash, setHash] = useState(() => window.location.hash || '#buttons');
  useEffect(() => { const f = () => setHash(window.location.hash || '#buttons'); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);

  const [tab, setTab] = useState('one');
  const [seg, setSeg] = useState('month');
  const [tags, setTags] = useState(['hash map', 'two pointers']);
  const [on, setOn] = useState(true);
  const [check, setCheck] = useState(true);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const rows = ROWS.slice((page - 1) * pageSize, page * pageSize);
  const commands = useMemo(() => [
    ...NAV.map((n) => ({ id: n.id, group: 'Jump to', label: n.label, icon: n.icon, run: () => { window.location.hash = n.id; } })),
    { id: 'toast', group: 'Actions', label: 'Show a toast', icon: Bell, run: () => notify('Hello from the command palette') },
  ], [notify]);

  const spark = [3, 5, 4, 7, 6, 9, 8, 12, 10, 14];
  return (
    <CommandPaletteProvider commands={commands}>
      <Shell hash={hash}>
        <PageHeader title="UI Kit Gallery" description="Every component in the kit, live. Change the theme from the palette icon in the top bar; press Ctrl/⌘ K for the command palette."
          actions={<Button variant="primary" leftIcon={Plus} onClick={() => notify('Saved')}>Primary action</Button>} />
        <div className="space-y-16">
          <Block id="buttons" title="Buttons">
            <Row>{['primary', 'secondary', 'ghost', 'danger'].map((v) => <Button key={v} variant={v}>{v}</Button>)}<Button variant="primary" loading>Saving</Button><Button disabled>Disabled</Button></Row>
            <Row><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button>
              <IconButton icon={Star} label="Favourite" /><BurstToggle pressed={saved} onToggle={() => setSaved((s) => !s)} label="Save" activeLabel="Saved" /></Row>
          </Block>

          <Block id="forms" title="Forms">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Title" hint="Shown in lists">{(id) => <Input id={id} placeholder="Two Sum" />}</Field>
              <Field label="Platform" optional>{(id) => <Select id={id} options={['LeetCode', 'Codeforces', 'AtCoder']} />}</Field>
              <Field label="Email" error="Enter a valid email address">{(id) => <Input id={id} defaultValue="nope" aria-invalid="true" />}</Field>
              <Field label="Search">{() => <SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} />}</Field>
              <div className="md:col-span-2"><Field label="Notes">{(id) => <Textarea id={id} placeholder="What made it work?" />}</Field></div>
              <div className="md:col-span-2"><Field label="Tags" hint="Enter or comma to add">{(id) => <TagInput id={id} value={tags} onChange={setTags} suggestions={['hash map', 'two pointers', 'bfs', 'dp', 'greedy']} placeholder="Add a tag" />}</Field></div>
            </div>
            <Row><Checkbox label="Remind me" description="Send a nudge when a review is due" checked={check} onChange={setCheck} /><Toggle label="Dark mode" checked={on} onChange={setOn} />
              <Segmented label="Range" options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} value={seg} onChange={setSeg} /></Row>
          </Block>

          <Block id="cards" title="Cards & KPIs">
            <StatGroup fit>
              <StatCard to="#cards" tone="teal" label="Solved today" value={7} hint="3 yesterday · 21 this week" viz={{ type: 'spark', data: spark, tone: 'teal' }} />
              <StatCard to="#cards" tone="blue" label="Captured" value={142} hint="All active" viz={{ type: 'bars', data: [4, 6, 3, 8, 5, 9, 7], tone: 'blue' }} />
              <StatCard tone="red" label="Due for review" value={5} hint="4 of 5 overdue" viz={{ type: 'segments', filled: 4, total: 5, tone: 'red' }} />
              <StatCard tone="purple" label="Critical" value={3} hint="of 6 notes" viz={{ type: 'dots', active: 3, total: 6, tone: 'purple' }} />
              <StatCard tone="accent" label="Total solved" value={306} hint="203 on one site · 103 on another" viz={{ type: 'split', parts: [{ label: 'Easy', value: 99, tone: 'green' }, { label: 'Medium', value: 99, tone: 'orange' }, { label: 'Hard', value: 5, tone: 'red' }] }} />
            </StatGroup>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="p-5"><p className="t-eyebrow text-fg-3">Plain card</p><p className="t-h2 mt-2">A hairline border, almost transparent fill</p><p className="t-small mt-1 text-fg-2">The page shows through; tones are optional accents.</p><Row className="mt-4"><Pill tone="accent">Pill</Pill></Row></Card>
              <SpotlightCard className="p-5"><p className="t-eyebrow text-fg-3">Spotlight card</p><p className="t-h2 mt-2">Move your cursor here</p></SpotlightCard>
              <ItemCard glyph={BarChart3} ext="csv" badge={<Badge variant="success">Ready</Badge>} title="Quarterly report" meta={['12 pages', 'Updated today']} stats={[{ icon: Activity, label: '42 views' }]} to="#cards" />
              <Section title="Section" aside={<Button size="sm" variant="ghost">Action</Button>}><p className="t-small p-4 text-fg-2">Titled block with an aside.</p></Section>
            </div>
          </Block>

          <Block id="feedback" title="Badges, alerts & states">
            <Row>{['neutral', 'accent', 'success', 'warning', 'danger', 'info'].map((v) => <Badge key={v} variant={v}>{v}</Badge>)}<StatusBadge status="active" /><Chip tone="tag">tag</Chip><Chip tone="pattern" onRemove={() => {}}>pattern</Chip></Row>
            <Row><LevelBadge level="Critical" score={91} /><LevelBadge level="High" score={68} note="provisional" /><LevelBadge level="Medium" /><LevelBadge level="Low" /><PriorityBars level="High" /></Row>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{['info', 'success', 'warning', 'danger'].map((v) => <Alert key={v} variant={v} title={`${v} alert`}>Something worth knowing.</Alert>)}</div>
            <Banner tone="info" action={<Button size="sm" variant="secondary">Undo</Button>}>Inline banner with an action.</Banner>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card><EmptyState icon={Boxes} title="Nothing here yet" description="Create your first item to get started." action={<Button size="sm">Create</Button>} /></Card>
              <Card><ErrorState onRetry={() => notify('Retrying…')} /></Card>
              <Card className="p-4"><LoadingState rows={3} /><div className="mt-3 flex items-center gap-3"><Spinner /><Skeleton className="h-4 w-32" /></div></Card>
            </div>
          </Block>

          <Block id="overlays" title="Overlays, menus & tabs">
            <Row>
              <Button onClick={() => setModal(true)}>Open modal</Button><Button onClick={() => setDrawer(true)}>Open drawer</Button><Button variant="danger" onClick={() => setConfirm(true)}>Confirm delete</Button>
              <Dropdown label="Actions" trigger={({ open, ...p }) => <Button {...p}>Menu</Button>} items={[{ heading: 'Actions' }, { label: 'Edit', onClick: () => notify('Edit') }, { label: 'Duplicate' }, { separator: true }, { label: 'Delete', danger: true }]} />
              <Tooltip label="A short hint"><Button variant="ghost">Hover me</Button></Tooltip><ThemeSwitcher />
              <Button onClick={() => notify('Saved your changes')}>Toast</Button><Button onClick={() => notify('Could not save', 'error')}>Error toast</Button>
            </Row>
            <Tabs value={tab} onChange={setTab} items={[{ id: 'one', label: 'Overview' }, { id: 'two', label: 'Activity', count: 4 }, { id: 'three', label: 'Settings' }]} />
            <TabPanel value={tab} id="one"><p className="t-small text-fg-2">Overview panel.</p></TabPanel>
            <TabPanel value={tab} id="two"><p className="t-small text-fg-2">Activity panel.</p></TabPanel>
            <TabPanel value={tab} id="three"><p className="t-small text-fg-2">Settings panel.</p></TabPanel>
            <Breadcrumb items={[{ label: 'Workspace', to: '#overlays' }, { label: 'Library', to: '#overlays' }, { label: 'Details' }]} />
            <Avatar name="Ada Lovelace" />
          </Block>

          <Block id="data" title="Tables">
            <DataTable rowKey="id" rows={rows} initialSort={{ key: 'score', dir: 'desc' }}
              columns={[{ key: 'name', header: 'Problem', sortable: true }, { key: 'level', header: 'Priority', render: (r) => <LevelBadge level={r.level} /> }, { key: 'score', header: 'Score', sortable: true, align: 'right' }]}
              renderMobileRow={(r) => <div className="p-3"><p className="t-small font-medium">{r.name}</p><LevelBadge level={r.level} score={r.score} /></div>} />
            <Pagination page={page} pageCount={Math.ceil(ROWS.length / pageSize)} onChange={setPage} total={ROWS.length} pageSize={pageSize} />
          </Block>

          <Block id="charts" title="Charts">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="p-5"><p className="t-h3 mb-3">Line</p><LineChart data={spark.map((v, i) => ({ label: `D${i + 1}`, value: v }))} /></Card>
              <Card className="p-5"><p className="t-h3 mb-3">Bars</p><BarChart data={[{ label: 'Mon', value: 4 }, { label: 'Tue', value: 7 }, { label: 'Wed', value: 3 }, { label: 'Thu', value: 9 }, { label: 'Fri', value: 5 }]} /></Card>
              <Card className="flex items-center gap-6 p-5"><DonutChart data={[{ label: 'Easy', value: 99 }, { label: 'Medium', value: 99 }, { label: 'Hard', value: 5 }]} centerLabel="Solved" /><div className="space-y-3"><ProgressCircle value={72}><span className="t-h3">72%</span></ProgressCircle><Sparkline data={spark} className="h-8 w-28 text-accent-text" /></div></Card>
              <Card className="space-y-4 p-5"><ProgressChart items={[{ label: 'Arrays', value: 0.8 }, { label: 'Graphs', value: 0.45, tone: 'orange' }, { label: 'DP', value: 0.2, tone: 'red' }]} /><ProgressBar value={0.6} label="Upload" showValue /></Card>
              <Card className="p-5"><ComparisonView rows={[{ label: 'Solved', current: 21, previous: 14 }, { label: 'Reviews', current: 9, previous: 12 }]} /></Card>
              <Card className="p-5"><ActivityTimeline items={[{ id: 1, icon: Boxes, title: 'Captured “Two Sum”', time: new Date(Date.now() - 6e5).toISOString() }, { id: 2, icon: Rows3, title: 'Reviewed “Coin Change”', detail: 'Remembered', time: new Date(Date.now() - 36e5).toISOString() }]} /></Card>
            </div>
          </Block>

          <Block id="effects" title="Effects & typography">
            <p className="t-display !text-[clamp(2.5rem,8vw,5rem)]">Display</p>
            <p className="t-h1"><RevealText text="Reveal text on load" highlight={['text']} /></p>
            <p className="t-body">Rotating: <RotatingText items={['practice', 'revise', 'remember']} className="font-semibold text-accent-text" /> · animated number <AnimatedValue value={1280} /> · <span className="t-mono">t-mono</span> · <kbd className="kbd">⌘K</kbd></p>
            <Marquee className="text-fg-3"><span>Fast</span><span>Themeable</span><span>Accessible</span><span>Dependency-light</span></Marquee>
            <Row><Type className="h-4 w-4 text-fg-3" aria-hidden /><span className="t-eyebrow">Eyebrow</span><span className="t-h2">Heading 2</span><span className="t-h3">Heading 3</span><span className="t-small text-fg-2">Small</span><span className="t-caption text-fg-3">Caption</span></Row>
          </Block>
        </div>

        <Modal open={modal} onClose={() => setModal(false)} title="A modal" description="Focus is trapped; Esc closes it." footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { setModal(false); notify('Done'); }}>Confirm</Button></>}>
          <p className="t-body text-fg-2">Body content goes here.</p>
        </Modal>
        <Drawer open={drawer} onClose={() => setDrawer(false)} title="A drawer" description="Slides in from the side."><p className="t-body text-fg-2">Drawer content.</p></Drawer>
        <ConfirmDialog open={confirm} title="Delete this item?" confirmLabel="Delete" danger onConfirm={() => { setConfirm(false); notify('Deleted'); }} onCancel={() => setConfirm(false)}>This cannot be undone.</ConfirmDialog>
      </Shell>
    </CommandPaletteProvider>
  );
}

/** The kit's own frame, wired to the hash so the sidebar highlights the section in view. */
function Shell({ hash, children }) {
  return (
    <AppShell
      sidebar={<Sidebar brand={<Brand name="UI Kit" />} items={NAV} activePath={hash} actions={<Button variant="primary" className="flex-1" leftIcon={Plus}>New</Button>}
        user={{ name: 'Ada Lovelace', subtitle: 'ada@example.com' }} footer={<p className="t-caption text-fg-3">Press <kbd className="kbd">⌘K</kbd> to jump anywhere.</p>} />}
      topbar={<ShellTop hash={hash} />}
      mobileNav={<MobileNav items={NAV} activePath={hash} />}>
      {children}
    </AppShell>
  );
}

function ShellTop({ hash }) {
  const current = NAV.find((n) => n.to === hash);
  return <PaletteTop crumbs={[{ label: 'Gallery', to: '#buttons' }, { label: current?.label || 'Buttons' }]} />;
}

import { useCommandPalette } from '../src';
function PaletteTop({ crumbs }) {
  const palette = useCommandPalette();
  return <Topbar brand={<Brand name="UI Kit" />} breadcrumbs={crumbs} onSearch={palette.open} right={<ThemeSwitcher />} />;
}
