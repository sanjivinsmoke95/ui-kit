import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, BarChart3, Bell, Boxes, Check, Copy, Download, Layers, LayoutDashboard, MousePointerClick, PanelsTopLeft, Palette, Plus, RotateCcw, Rows3, Smartphone,
  Sparkles, SquarePen, Star, Table2, Type,
} from 'lucide-react';
import {
  ActivityTimeline, Alert, AnimatedValue, AppShell, Avatar, Badge, Banner, BarChart, Brand, Breadcrumb, BurstToggle, Button, Card, Checkbox, Chip, CommandPaletteProvider,
  ChartLegend, ComparisonView, ConfirmDialog, DataTable, DonutChart, Drawer, GapChart, LandingPage, MetricCard, Dropdown, EmptyState, ErrorState, Field, IconButton, Input, ItemCard, LevelBadge, LineChart, LoadingState,
  Marquee, MobileNav, Modal, PageHeader, Pagination, Pill, PriorityBars, ProgressBar, ProgressChart, ProgressCircle, RevealText, RotatingText, SearchInput, Section, Segmented,
  Select, Sidebar, Skeleton, Sparkline, SpotlightCard, Spinner, StatCard, StatGroup, StatusBadge, TabPanel, Tabs, TagInput, Textarea, ThemeSwitcher, Toggle, Tooltip, Topbar,
  accentPresets, themes, useCommandPalette, useNotify, useTheme,
} from '../src';
import { studyvexPage } from './studyvexLanding';

/* ----------------------------------------------------------------------------------------------------------------------------
   Workbench chrome: demo frame, copyable code, page controls. Everything inside a demo is a real, exported kit component.
   ---------------------------------------------------------------------------------------------------------------------------- */

const EMBED = new URLSearchParams(window.location.search).has('embed');

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {                       // plain-http fallback (e.g. a phone on the LAN)
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    ok ? resolve() : reject(new Error('copy failed'));
  });
}

function CodeBlock({ code }) {
  const notify = useNotify();
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await copyText(code);
      setDone(true);
      notify('JSX copied to clipboard');
      setTimeout(() => setDone(false), 1500);
    } catch {
      notify('Copy blocked by the browser: select the code manually', 'error');
    }
  };
  return (
    <div className="relative border-t border-line bg-surface-2/40">
      <Button size="sm" variant="outline" className="absolute right-3 top-3 bg-surface" leftIcon={done ? Check : Copy} onClick={copy} aria-label="Copy JSX snippet">{done ? 'Copied' : 'Copy'}</Button>
      <pre className="t-mono scrollbar-thin overflow-x-auto p-4 pr-28 leading-relaxed text-fg-2" tabIndex={0} aria-label="JSX snippet"><code>{code}</code></pre>
    </div>
  );
}

/** One component demo: header (name, kind, description), live preview, and a collapsible copyable snippet. */
function Demo({ demo }) {
  const [showCode, setShowCode] = useState(false);
  const Render = demo.render;
  return (
    <article id={`demo-${demo.id}`} className="card scroll-mt-24 overflow-hidden" aria-labelledby={`demo-${demo.id}-t`}>
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="min-w-0">
          <h3 id={`demo-${demo.id}-t`} className="t-h3">{demo.name}</h3>
          <p className="t-caption mt-1 text-fg-3">{demo.desc}</p>
        </div>
        <Badge variant={demo.kind === 'composition' ? 'accent' : 'neutral'}>{demo.kind}</Badge>
      </header>
      <div className={demo.bare ? '' : 'space-y-5 p-5'}><Render /></div>
      <div className="border-t border-line px-5 py-2">
        <button type="button" aria-expanded={showCode} onClick={() => setShowCode((s) => !s)} className="t-eyebrow -mx-1 rounded-sm px-1 py-2 text-fg-3 transition hover:text-fg">
          {showCode ? 'Hide JSX' : 'Show JSX'}
        </button>
      </div>
      {showCode && <CodeBlock code={demo.code} />}
    </article>
  );
}

const Row = ({ children, className = '' }) => <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
const Label = ({ children }) => <p className="t-eyebrow mb-2 text-fg-3">{children}</p>;

/* ----------------------------------------------------------------------------------------------------------------------------
   Demos that need their own state
   ---------------------------------------------------------------------------------------------------------------------------- */

function FormsDemo() {
  const [q, setQ] = useState('');
  const [name, setName] = useState('');
  const bad = name.length > 0 && name.length < 3;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Project name" hint="At least 3 characters" error={bad ? 'Too short: use at least 3 characters' : undefined}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hackathon demo" />
        </Field>
        <Field label="Track" optional><Select options={['Web', 'Mobile', 'AI / ML', { value: 'hw', label: 'Hardware' }]} /></Field>
        <Field label="Disabled"><Input disabled defaultValue="Can't edit this" /></Field>
        <Field label="Read-only"><Input readOnly defaultValue="Copy me" /></Field>
        <Field label="Search"><SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Search components" /></Field>
        <Field label="With icon"><Input icon={Star} placeholder="Starred only" /></Field>
        <div className="md:col-span-2"><Field label="Notes"><Textarea placeholder="What should the judges know?" /></Field></div>
      </div>
    </>
  );
}

function ControlsDemo() {
  const [check, setCheck] = useState(true);
  const [small, setSmall] = useState('Week');
  const [on, setOn] = useState(true);
  const [range, setRange] = useState('month');
  return (
    <>
      <Row className="gap-8">
        <Checkbox label="Email me updates" description="One message per week" checked={check} onChange={(e) => setCheck(e.target.checked)} />
        <Checkbox label="Disabled option" disabled checked={false} onChange={() => {}} />
        <Toggle label="Notifications" checked={on} onChange={setOn} />
        <Toggle label="Locked" disabled checked={false} onChange={() => {}} />
      </Row>
      <Row>
        <Segmented label="Range" options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} value={range} onChange={setRange} />
        <Segmented label="Range, small" size="sm" options={['Day', 'Week', 'Month']} value={small} onChange={setSmall} />
      </Row>
      <p className="t-caption text-fg-3">Segmented is a single tab stop: Tab into it, then use the arrow keys, Home and End.</p>
    </>
  );
}

function TabsDemo() {
  const [tab, setTab] = useState('overview');
  return (
    <>
      <Tabs idPrefix="demo-tabs" value={tab} onChange={setTab} label="Project sections" items={[{ id: 'overview', label: 'Overview' }, { id: 'activity', label: 'Activity', count: 4 }, { id: 'settings', label: 'Settings' }]} />
      <TabPanel idPrefix="demo-tabs" id={tab}><p className="t-small text-fg-2">Showing the <strong className="text-fg">{tab}</strong> panel. Arrow keys, Home and End move between tabs.</p></TabPanel>
    </>
  );
}

function OverlaysDemo() {
  const notify = useNotify();
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [title, setTitle] = useState('');
  return (
    <>
      <Row>
        <Button onClick={() => setModal(true)}>Open modal</Button>
        <Button onClick={() => setDrawer(true)}>Open drawer</Button>
        <Button variant="danger" onClick={() => setConfirm(true)}>Confirm delete</Button>
      </Row>
      <Modal open={modal} onClose={() => setModal(false)} title="Create project" description="Focus is trapped. Esc, the scrim and × all close it."
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { setModal(false); notify(`Created ${title || 'project'}`); }}>Create</Button></>}>
        <Field label="Name"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type here: focus must stay in the field" /></Field>
      </Modal>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters" description="Slides in from the side."><p className="t-body text-fg-2">Drawer content goes here.</p></Drawer>
      <ConfirmDialog open={confirm} title="Delete this project?" confirmLabel="Delete" danger onConfirm={() => { setConfirm(false); notify('Deleted'); }} onCancel={() => setConfirm(false)}>This cannot be undone.</ConfirmDialog>
    </>
  );
}

const ROWS = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: ['Two Sum', 'Course Schedule', 'Coin Change', 'Watermelon', 'Chat Room'][i % 5] + ` #${i + 1}`, level: ['Critical', 'High', 'Medium', 'Low'][i % 4], score: 20 + ((i * 37) % 80) }));

function TableDemo() {
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState('data');
  const pageSize = 6;
  const rows = mode === 'empty' ? [] : ROWS.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <Segmented label="Table state" size="sm" options={[{ value: 'data', label: 'Data' }, { value: 'loading', label: 'Loading' }, { value: 'empty', label: 'Empty' }]} value={mode} onChange={setMode} />
      <DataTable caption="Practice problems" rowKey="id" rows={rows} loading={mode === 'loading'} initialSort={{ key: 'score', dir: 'desc' }}
        empty={<EmptyState icon={Boxes} title="No problems yet" description="Add one to see it here." action={<Button size="sm">Add problem</Button>} />}
        columns={[{ key: 'name', header: 'Problem', sortable: true }, { key: 'level', header: 'Priority', render: (r) => <LevelBadge level={r.level} /> }, { key: 'score', header: 'Score', sortable: true, align: 'right' }]}
        renderMobileRow={(r) => <div className="flex items-center justify-between gap-3 p-3"><p className="t-small font-medium">{r.name}</p><LevelBadge level={r.level} score={r.score} /></div>} />
      <Pagination page={page} pageCount={Math.ceil(ROWS.length / pageSize)} onChange={setPage} total={ROWS.length} pageSize={pageSize} />
    </>
  );
}

function TagsDemo() {
  const [tags, setTags] = useState(['hash map', 'two pointers']);
  return <Field label="Tags" hint="Enter or comma adds, Backspace removes, arrows pick a suggestion">{(p) => <TagInput {...p} value={tags} onChange={setTags} suggestions={['hash map', 'two pointers', 'bfs', 'dp', 'greedy']} placeholder="Add a tag" />}</Field>;
}

const SPARK = [3, 5, 4, 7, 6, 9, 8, 12, 10, 14];
const GAPS = [1, 2.2, 3, 1.4, 1.1, 1.5, 1, 0.4, 2.8, 0.8, 1.2, 3.1, -0.6, 0.9, 0.5, 5.4, 1.6, 3.6, 12, -2.4, -9, -5.2, -5.8, -4, -1.5, -3, -4, -4.4, -2, -6, -3, -2.5, 1.2, 2.9].slice(-30);

/* ----------------------------------------------------------------------------------------------------------------------------
   The catalogue. `kind`: primitive building block, or composition (several primitives wired together). `code` is the snippet shown.
   ---------------------------------------------------------------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: 'foundations', label: 'Foundations', icon: Palette, demos: [
      { id: 'tokens', name: 'Colour tokens', kind: 'primitive', keywords: 'color theme surface accent semantic css variables', desc: 'Every colour is a CSS variable; switching theme or accent re-colours everything below.',
        code: `<div className="bg-surface text-fg border border-line">\n  <span className="text-fg-2">secondary</span>\n  <span className="text-accent-text">accent</span>\n  <span className="text-success">success</span>\n</div>`,
        render: () => (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[['bg', 'bg-bg'], ['surface', 'bg-surface'], ['surface-2', 'bg-surface-2'], ['line', 'bg-line'], ['fg', 'bg-fg'], ['fg-2', 'bg-fg-2'], ['fg-3', 'bg-fg-3'], ['accent', 'bg-accent'], ['accent-text', 'bg-accent-text'], ['success', 'bg-success'], ['warning', 'bg-warning'], ['danger', 'bg-danger']].map(([n, c]) => (
              <div key={n}><div className={`${c} h-12 rounded-md border border-line`} /><p className="t-mono mt-1.5 text-fg-2">{n}</p></div>
            ))}
          </div>
        ) },
      { id: 'type', name: 'Typography', kind: 'primitive', keywords: 'font heading text display mono eyebrow', desc: 'Utility classes for the type scale. Display (Anton) is for the loudest text only.',
        code: `<h1 className="t-h1">Heading</h1>\n<p className="t-body">Body copy</p>\n<span className="t-eyebrow">Eyebrow</span>\n<span className="t-mono">1,280</span>`,
        render: () => (
          <div className="space-y-3">
            <p className="t-display !text-[clamp(2.5rem,8vw,4.5rem)]">Display</p>
            <p className="t-h1">Heading one</p>
            <Row><span className="t-section">Section</span><span className="t-h2">Heading 2</span><span className="t-h3">Heading 3</span></Row>
            <p className="t-body text-fg-2">Body copy at a comfortable measure for reading: <span className="t-small">small</span>, <span className="t-caption">caption</span>.</p>
            <Row><Type className="h-4 w-4 text-fg-3" aria-hidden /><span className="t-eyebrow text-fg-3">Eyebrow</span><span className="t-mono">t-mono 1,280.50</span><kbd className="kbd">⌘K</kbd></Row>
          </div>
        ) },
    ],
  },
  {
    id: 'actions', label: 'Buttons & actions', icon: MousePointerClick, demos: [
      { id: 'button', name: 'Button', kind: 'primitive', keywords: 'variant size loading disabled link icon block', desc: 'Five variants, three sizes, loading and disabled states. `as` renders a link with button styles.',
        code: `<Button variant="primary" leftIcon={Plus}>Create</Button>\n<Button variant="danger" loading>Deleting</Button>\n<Button as="a" href="/docs" variant="outline">Docs</Button>\n<Button block size="lg">Full width</Button>`,
        render: () => (
          <>
            {['sm', 'md', 'lg'].map((s) => (
              <div key={s}><Label>size {s}</Label>
                <Row>{['primary', 'secondary', 'outline', 'ghost', 'danger'].map((v) => <Button key={v} variant={v} size={s}>{v}</Button>)}</Row></div>
            ))}
            <div><Label>states</Label>
              <Row><Button variant="primary" loading>Saving</Button><Button variant="primary" disabled>Disabled</Button><Button variant="primary" leftIcon={Plus}>Left icon</Button><Button rightIcon={Download}>Right icon</Button><Button as="a" href="#actions" variant="outline">As a link</Button></Row></div>
            <Button block variant="secondary">Block button</Button>
          </>
        ) },
      { id: 'iconbutton', name: 'IconButton + BurstToggle', kind: 'primitive', keywords: 'icon tooltip toggle favourite', desc: '`label` is required: it becomes the aria-label and the tooltip. Targets grow to 44px on touch screens.',
        code: `<IconButton icon={Star} label="Favourite" />\n<IconButton icon={Bell} label="Alerts" variant="outline" size="sm" />\n<BurstToggle pressed={saved} onToggle={toggle} label="Save" activeLabel="Saved" />`,
        render: function IconDemo() {
          const [saved, setSaved] = useState(false);
          return <Row><IconButton icon={Star} label="Favourite" /><IconButton icon={Bell} label="Alerts" variant="outline" /><IconButton icon={Plus} label="Add" variant="outline" size="sm" /><IconButton icon={Star} label="Disabled" disabled /><BurstToggle pressed={saved} onToggle={() => setSaved((s) => !s)} label="Save" activeLabel="Saved" /></Row>;
        } },
      { id: 'dropdown', name: 'Dropdown', kind: 'primitive', keywords: 'menu popover actions', desc: 'Keyboard menu: arrows, Home, End, Esc returns focus to the trigger, Tab dismisses.',
        code: `<Dropdown label="Actions"\n  trigger={({ open, ...p }) => <Button {...p}>Menu</Button>}\n  items={[{ heading: 'Actions' }, { label: 'Edit', onClick: edit }, { separator: true }, { label: 'Delete', danger: true }]} />`,
        render: function DropDemo() {
          const notify = useNotify();
          return <Row>
            <Dropdown label="Actions" align="left" trigger={({ open, ...p }) => <Button {...p}>Menu</Button>} items={[{ heading: 'Actions' }, { label: 'Edit', onClick: () => notify('Edit') }, { label: 'Duplicate', onClick: () => notify('Duplicate') }, { separator: true }, { label: 'Delete', danger: true, onClick: () => notify('Deleted', 'error') }]} />
            <Tooltip label="A short hint"><Button variant="ghost">Hover or focus me</Button></Tooltip>
          </Row>;
        } },
    ],
  },
  {
    id: 'forms', label: 'Forms', icon: SquarePen, demos: [
      { id: 'field', name: 'Field + inputs', kind: 'primitive', keywords: 'input textarea select search label error hint validation', desc: 'Field wires label, hint and error to its single child automatically. No ids to manage.',
        code: `<Field label="Project name" hint="At least 3 characters" error={tooShort && 'Too short'}>\n  <Input value={name} onChange={(e) => setName(e.target.value)} />\n</Field>\n<Field label="Track"><Select options={['Web', 'Mobile']} /></Field>`,
        render: FormsDemo },
      { id: 'controls', name: 'Checkbox, Toggle, Segmented', kind: 'primitive', keywords: 'switch radio checkbox filter', desc: 'Selection controls with disabled states and full keyboard support.',
        code: `<Checkbox label="Email me" checked={on} onChange={(e) => setOn(e.target.checked)} />\n<Toggle label="Notifications" checked={on} onChange={setOn} />\n<Segmented label="Range" options={['Day', 'Week']} value={v} onChange={setV} />`,
        render: ControlsDemo },
      { id: 'taginput', name: 'TagInput', kind: 'composition', keywords: 'chips tags autocomplete suggestions', desc: 'Chips + input + suggestion list built from Chip and the kit tokens.',
        code: `<Field label="Tags">{(p) => <TagInput {...p} value={tags} onChange={setTags} suggestions={['bfs', 'dp']} />}</Field>`,
        render: TagsDemo },
    ],
  },
  {
    id: 'surfaces', label: 'Cards & KPIs', icon: PanelsTopLeft, demos: [
      { id: 'statcard', name: 'StatCard + StatGroup', kind: 'composition', keywords: 'kpi metric number tile delta trend', desc: 'Clean KPI tiles: label, big number, delta pill and a hint. A mini chart (`viz`) is available but optional.',
        code: `<StatGroup fit>\n  <StatCard featured label="Revenue" value={48200} delta={12.5} hint="vs last month" />\n  <StatCard label="Active users" value={1280} delta={-3} hint="vs last week" icon={Activity} />\n</StatGroup>`,
        render: () => (
          <StatGroup fit>
            <StatCard featured to="#surfaces" label="Solved today" value={7} delta={16} hint="vs yesterday" />
            <StatCard label="Captured" value={142} delta={12} hint="vs last week" icon={Boxes} />
            <StatCard label="Due for review" value={5} hint="4 of 5 overdue" icon={Bell} />
            <StatCard label="Critical" value={3} delta={-8} hint="of 6 notes" icon={Activity} />
            <StatCard label="Total solved" value={306} delta={4} hint="all time" icon={Star} />
          </StatGroup>
        ) },
      { id: 'metric', name: 'MetricCard + GapChart', kind: 'composition', keywords: 'kpi metric gap diverging chart comparison trend', desc: 'A headline number, its comparison and a diverging daily chart: above the baseline is accent, below is danger.',
        code: `<MetricCard label="Orders MTD (€)" value="518M"\n  compare={{ label: 'MTD LY', value: '483M' }}\n  gap={{ value: '35.4M', pct: 7.3 }}\n  series={dailyGaps} today="2.9M" />\n<GapChart data={dailyGaps} baselineLabel="MTD LY" />`,
        render: () => <div className="max-w-2xl"><MetricCard label="Orders MTD (€)" value="518M" compare={{ label: 'MTD LY', value: '483M' }} gap={{ value: '35.4M', pct: 7.3 }} series={GAPS} today="2.9M" /></div> },
      { id: 'cards', name: 'Card, Section, ItemCard, SpotlightCard', kind: 'primitive', keywords: 'container panel surface border', desc: 'Rounded, softly shadowed panels for grouped, scannable content.',
        code: `<Card interactive><h3 className="t-h3">Title</h3></Card>\n<Section title="Section" aside={<Button size="sm" variant="ghost">Action</Button>}>…</Section>\n<ItemCard glyph={BarChart3} ext="csv" title="Quarterly report" meta={['12 pages']} to="/report" />`,
        render: () => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card interactive><p className="t-eyebrow text-fg-3">Plain card</p><p className="t-h2 mt-2">Soft white panel, big radius</p><Row className="mt-4"><Pill tone="accent">Pill</Pill><Pill tone="success">Healthy</Pill></Row></Card>
            <SpotlightCard className="p-5"><p className="t-eyebrow text-fg-3">Spotlight card</p><p className="t-h2 mt-2">Move your cursor here</p></SpotlightCard>
            <ItemCard glyph={BarChart3} ext="csv" badge={<Badge variant="success">Ready</Badge>} title="Quarterly report" meta={['12 pages', 'Updated today']} stats={[{ icon: Activity, label: '42 views' }]} to="#surfaces" />
            <Section title="Section" aside={<Button size="sm" variant="ghost">Action</Button>}><p className="t-small p-4 text-fg-2">Titled block with an aside.</p></Section>
          </div>
        ) },
    ],
  },
  {
    id: 'feedback', label: 'Badges & feedback', icon: Bell, demos: [
      { id: 'badges', name: 'Badge, StatusBadge, Chip, LevelBadge', kind: 'primitive', keywords: 'tag label status pill priority', desc: 'Status is always text + shape/icon as well as colour, so it survives colour blindness.',
        code: `<Badge variant="success" icon={Check}>Ready</Badge>\n<StatusBadge status="processing" />\n<LevelBadge level="High" score={68} />`,
        render: () => (
          <>
            <Row>{['neutral', 'accent', 'info', 'success', 'warning', 'danger'].map((v) => <Badge key={v} variant={v}>{v}</Badge>)}</Row>
            <Row>{['completed', 'processing', 'queued', 'review', 'failed'].map((s) => <StatusBadge key={s} status={s} />)}</Row>
            <Row><LevelBadge level="Critical" score={91} /><LevelBadge level="High" score={68} note="provisional" /><LevelBadge level="Medium" /><LevelBadge level="Low" /><PriorityBars level="High" /><Chip tone="tag">tag</Chip><Chip tone="pattern" onRemove={() => {}}>removable</Chip></Row>
          </>
        ) },
      { id: 'alerts', name: 'Alert + Banner', kind: 'primitive', keywords: 'notice message warning error info success', desc: 'Danger alerts are announced assertively (role="alert"); the rest politely.',
        code: `<Alert variant="warning" title="Heads up">Your trial ends soon.</Alert>\n<Banner tone="info" action={<Button size="sm">Undo</Button>}>Saved.</Banner>`,
        render: () => (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{['info', 'success', 'warning', 'danger'].map((v) => <Alert key={v} variant={v} title={`${v} alert`}>Something worth knowing.</Alert>)}</div>
            <Banner tone="info" action={<Button size="sm" variant="secondary">Undo</Button>}>Inline banner with an action.</Banner>
          </>
        ) },
      { id: 'states', name: 'Empty, error and loading states', kind: 'primitive', keywords: 'skeleton spinner placeholder retry', desc: 'Drop-in states for lists and pages.',
        code: `<EmptyState icon={Boxes} title="Nothing yet" action={<Button size="sm">Create</Button>} />\n<ErrorState onRetry={reload} />\n<LoadingState rows={3} />`,
        render: function StatesDemo() {
          const notify = useNotify();
          return <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card padded={false}><EmptyState icon={Boxes} title="Nothing here yet" description="Create your first item." action={<Button size="sm">Create</Button>} /></Card>
            <Card padded={false}><ErrorState onRetry={() => notify('Retrying…')} /></Card>
            <Card className="p-4"><LoadingState rows={3} /><div className="mt-3 flex items-center gap-3"><Spinner /><Skeleton className="h-4 w-32" /></div></Card>
          </div>;
        } },
      { id: 'toast', name: 'Toast (useNotify)', kind: 'primitive', keywords: 'notification snackbar message', desc: 'Needs <ToastProvider>. Errors use role="alert"; `useToast` gives full control (type, duration, description).',
        code: `const notify = useNotify();\nnotify('Saved');\nnotify('Could not save', 'error');`,
        render: function ToastDemo() {
          const notify = useNotify();
          return <Row><Button onClick={() => notify('Saved your changes')}>Success toast</Button><Button onClick={() => notify('Could not save', 'error')}>Error toast</Button></Row>;
        } },
    ],
  },
  {
    id: 'overlays', label: 'Overlays & navigation', icon: Layers, demos: [
      { id: 'modal', name: 'Modal, Drawer, ConfirmDialog', kind: 'primitive', keywords: 'dialog popup sheet side panel confirm', desc: 'Portal-mounted, focus-trapped, Esc to close, focus restored. Type in the field to confirm focus is no longer stolen.',
        code: `<Modal open={open} onClose={() => setOpen(false)} title="Create project"\n  footer={<Button variant="primary" onClick={save}>Create</Button>}>…</Modal>\n<Drawer open={d} onClose={close} title="Filters">…</Drawer>\n<ConfirmDialog open={c} title="Delete?" danger onConfirm={del} onCancel={close}>Cannot be undone.</ConfirmDialog>`,
        render: OverlaysDemo },
      { id: 'tabs', name: 'Tabs + TabPanel', kind: 'primitive', keywords: 'navigation sections underline', desc: 'Linked to their panels with aria-controls; arrow keys move between tabs.',
        code: `<Tabs idPrefix="p" value={tab} onChange={setTab} items={[{ id: 'a', label: 'Overview' }, { id: 'b', label: 'Activity', count: 4 }]} />\n<TabPanel idPrefix="p" id={tab}>…</TabPanel>`,
        render: TabsDemo },
      { id: 'breadcrumb', name: 'Breadcrumb + Avatar', kind: 'primitive', keywords: 'navigation path user', desc: 'Router-agnostic links (see LinkProvider).',
        code: `<Breadcrumb items={[{ label: 'Workspace', to: '/' }, { label: 'Library', to: '/lib' }, { label: 'Details' }]} />\n<Avatar name="Ada Lovelace" />`,
        render: () => <Row><Breadcrumb items={[{ label: 'Workspace', to: '#overlays' }, { label: 'Library', to: '#overlays' }, { label: 'Details' }]} /><Avatar name="Ada Lovelace" /></Row> },
    ],
  },
  {
    id: 'data', label: 'Tables & charts', icon: Table2, demos: [
      { id: 'table', name: 'DataTable + Pagination', kind: 'composition', keywords: 'grid list sort rows mobile empty loading', desc: 'Sortable columns, loading/empty states, stacked rows on phones, windowed pagination.',
        code: `<DataTable caption="Problems" rows={rows} initialSort={{ key: 'score', dir: 'desc' }}\n  columns={[{ key: 'name', header: 'Problem', sortable: true }, { key: 'score', header: 'Score', sortable: true, align: 'right' }]}\n  empty={<EmptyState title="No problems" />}\n  renderMobileRow={(r) => <div className="p-3">{r.name}</div>} />\n<Pagination page={page} pageCount={4} onChange={setPage} />`,
        render: TableDemo },
      { id: 'charts', name: 'Charts', kind: 'composition', keywords: 'line bar donut sparkline progress timeline comparison graph', desc: 'Dependency-free SVG charts; colours come from the tokens.',
        code: `<LineChart data={[{ label: 'D1', value: 3 }, …]} average={5} />\n<LineChart baseline={0} data={gaps} />   // blue above the baseline, magenta below\n<BarChart data={[{ label: 'Mon', value: 4 }, …]} />\n<DonutChart data={[{ label: 'Easy', value: 99 }, …]} centerLabel="Solved" />\n<ProgressBar value={0.6} label="Upload" showValue />`,
        render: () => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="t-eyebrow text-fg-3">Daily value</p><ChartLegend items={[{ label: 'Daily', kind: 'dot' }, { label: '3D avg', kind: 'line' }]} /></div><LineChart average={3} data={SPARK.map((v, i) => ({ label: `D${i + 1}`, value: v }))} /></Card>
            <Card><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="t-eyebrow text-fg-3">Gap vs last year</p><ChartLegend items={[{ label: 'Daily gap', kind: 'dot' }, { label: '5D avg', kind: 'line' }]} /></div><LineChart baseline={0} zeroBased data={GAPS.map((v, i) => ({ label: `D${i + 1}`, value: v }))} /></Card>
            <Card><p className="t-h3 mb-3">Bars</p><BarChart data={[{ label: 'Mon', value: 4 }, { label: 'Tue', value: 7 }, { label: 'Wed', value: 3 }, { label: 'Thu', value: 9 }, { label: 'Fri', value: 5 }]} /></Card>
            <Card className="flex items-center gap-6"><DonutChart data={[{ label: 'Easy', value: 99 }, { label: 'Medium', value: 99 }, { label: 'Hard', value: 5 }]} centerLabel="Solved" /><div className="space-y-3"><ProgressCircle value={72}><span className="t-h3">72%</span></ProgressCircle><Sparkline data={SPARK} className="h-8 w-28 text-accent-text" /></div></Card>
            <Card className="space-y-4"><ProgressChart items={[{ label: 'Arrays', value: 0.8 }, { label: 'Graphs', value: 0.45, tone: 'orange' }, { label: 'DP', value: 0.2, tone: 'red' }]} /><ProgressBar value={0.6} label="Upload" showValue /></Card>
            <Card><ComparisonView rows={[{ label: 'Solved', current: 21, previous: 14 }, { label: 'Reviews', current: 9, previous: 12 }]} /></Card>
            <Card><ActivityTimeline items={[{ id: 1, icon: Boxes, title: 'Captured “Two Sum”', time: new Date(Date.now() - 6e5).toISOString() }, { id: 2, icon: Rows3, title: 'Reviewed “Coin Change”', detail: 'Remembered', time: new Date(Date.now() - 36e5).toISOString() }]} /></Card>
          </div>
        ) },
    ],
  },
  {
    id: 'landing', label: 'Landing page', icon: LayoutDashboard, demos: [
      { id: 'landingpage', name: 'LandingPage (StudyVex example)', kind: 'composition', bare: true, keywords: 'website marketing hero pricing faq footer nav cta', desc: 'A complete marketing site from one config: nav, hero, tracks, steps, comparison, pricing, FAQ, CTA and footer. Also available full-page at /landing.html.',
        code: `<LandingPage brand={<Brand name="Acme" />}\n  nav={{ links, actions }} hero={{ badge, title, description, actions, bullets, visual }}\n  features={{ title, items }} steps={{ title, items }} pricing={{ title, tiers }}\n  faq={{ title, items }} cta={{ title, actions }} footer={{ groups, legal, copyright }} />\n// or compose the blocks yourself: LandingNav, LandingHero, FeatureGrid, StepList, CompareColumns, PricingTable, FaqList, CtaBand, SiteFooter`,
        render: () => <div className="max-h-[720px] overflow-y-auto rounded-b-[inherit]"><LandingPage brand={<Brand name="studyvex" />} {...studyvexPage} /></div> },
    ],
  },
  {
    id: 'app', label: 'App shell', icon: LayoutDashboard, demos: [
      { id: 'shell', name: 'AppShell, Sidebar, Topbar, MobileNav, PageHeader', kind: 'composition', keywords: 'layout frame navigation page header command palette', desc: 'This workbench is built with them. Resize the window (or use the responsive preview) to see the sidebar become a bottom tab bar.',
        code: `<CommandPaletteProvider commands={commands}>\n  <AppShell sidebar={<Sidebar brand={<Brand name="Acme" />} items={nav} activePath={path} />}\n    topbar={<Topbar breadcrumbs={crumbs} onSearch={palette.open} right={<ThemeSwitcher />} />}\n    mobileNav={<MobileNav items={nav} activePath={path} />}>\n    <PageHeader title="Reports" actions={<Button variant="primary">New</Button>} />\n  </AppShell>\n</CommandPaletteProvider>`,
        render: function ShellDemo() {
          const palette = useCommandPalette();
          return <Row><Button onClick={palette.open} leftIcon={Sparkles}>Open command palette</Button><span className="t-small text-fg-3">or press <kbd className="kbd">⌘K</kbd> / <kbd className="kbd">Ctrl K</kbd></span><ThemeSwitcher align="left" /></Row>;
        } },
      { id: 'effects', name: 'Effects', kind: 'primitive', keywords: 'animation marquee reveal rotating number motion', desc: 'Decorative motion; all of it stops under prefers-reduced-motion.',
        code: `<RevealText text="Reveal on load" highlight={['load']} />\n<RotatingText items={['practice', 'revise']} />\n<AnimatedValue value={1280} />\n<Marquee><span>Fast</span><span>Themeable</span></Marquee>`,
        render: () => (
          <>
            <p className="t-h1"><RevealText text="Reveal text on load" highlight={['text']} /></p>
            <p className="t-body">Rotating: <RotatingText items={['practice', 'revise', 'remember']} className="font-semibold text-accent-text" /> · animated number <AnimatedValue value={1280} /></p>
            <Marquee className="text-fg-3"><span>Fast</span><span>Themeable</span><span>Accessible</span><span>Dependency-light</span></Marquee>
          </>
        ) },
    ],
  },
];

const SHORT = { foundations: 'Tokens', actions: 'Actions', forms: 'Forms', surfaces: 'Cards', feedback: 'Feedback', overlays: 'Overlays', data: 'Data', landing: 'Site', app: 'Shell' };
const NAV = SECTIONS.map((s) => ({ id: s.id, label: s.label, shortLabel: SHORT[s.id], to: `#${s.id}`, icon: s.icon, mobile: ['actions', 'forms', 'surfaces', 'overlays', 'data'].includes(s.id), group: ['foundations', 'actions', 'forms', 'surfaces', 'feedback'].includes(s.id) ? undefined : 'More' }));

/* ----------------------------------------------------------------------------------------------------------------------------
   Page controls: theme, accent, responsive preview
   ---------------------------------------------------------------------------------------------------------------------------- */

function Customize() {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const [hex, setHex] = useState(accent || '');
  const [bad, setBad] = useState(false);
  useEffect(() => { setHex(accent || ''); setBad(false); }, [accent]);
  const onHex = (v) => {
    setHex(v);
    if (!v.trim()) { setBad(false); setAccent(null); return; }
    const ok = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
    setBad(!ok);
    if (ok) setAccent(v.trim().startsWith('#') ? v.trim() : `#${v.trim()}`);
  };
  return (
    <Card className="mb-8 space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[auto_1fr]">
        <div><Label>Theme</Label><Segmented label="Theme" value={theme} onChange={setTheme} options={themes.map((t) => ({ value: t.id, label: t.label.split(' ')[0] }))} /></div>
        <div>
          <Label>Accent</Label>
          <Row className="gap-2">
            {accentPresets.map((a) => {
              const on = accent?.toLowerCase() === a.value.toLowerCase();
              return (
                <button key={a.id} type="button" onClick={() => setAccent(a.value)} aria-label={`${a.label} accent`} aria-pressed={on} title={a.label}
                  className="grid h-8 w-8 place-items-center rounded-md border border-line transition hover:scale-105 [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11" style={{ background: a.value }}>
                  {on && <Check className="h-4 w-4 text-white mix-blend-difference" aria-hidden />}
                </button>
              );
            })}
            <div className="w-32"><Input aria-label="Custom accent hex" placeholder="#22D3EE" value={hex} onChange={(e) => onHex(e.target.value)} invalid={bad} className="t-mono" /></div>
            <Button size="sm" variant="ghost" leftIcon={RotateCcw} onClick={() => setAccent(null)} disabled={!accent}>Reset</Button>
          </Row>
          {bad && <p className="t-caption mt-2 text-danger" role="alert">Enter a hex colour such as #E11D48 or #0af.</p>}
        </div>
      </div>
      <div><Label>Live preview</Label><Row><Button variant="primary">Primary</Button><Button>Secondary</Button><Badge variant="accent">Accent</Badge><a href="#foundations">Accent link</a><ProgressBar value={0.6} className="w-40" label="Progress" /></Row></div>
    </Card>
  );
}

function ResponsivePreview({ open, onClose }) {
  const [size, setSize] = useState('mobile');
  const src = `${window.location.pathname}?embed=1${window.location.hash}`;
  return (
    <Drawer open={open} onClose={onClose} title="Responsive preview" description="The same workbench in an iframe, so real media queries apply." width={size === 'mobile' ? 'sm:max-w-[460px]' : 'sm:max-w-[860px]'}>
      <Segmented label="Preview width" value={size} onChange={setSize} options={[{ value: 'mobile', label: '375 · Phone' }, { value: 'tablet', label: '768 · Tablet' }]} className="mb-4" />
      <div className="mx-auto overflow-hidden rounded-md border border-line" style={{ width: size === 'mobile' ? 375 : 768, maxWidth: '100%' }}>
        <iframe title={`Workbench at ${size === 'mobile' ? 375 : 768}px`} src={src} className="block h-[68vh] w-full bg-bg" />
      </div>
    </Drawer>
  );
}

/* ----------------------------------------------------------------------------------------------------------------------------
   Page
   ---------------------------------------------------------------------------------------------------------------------------- */

export default function Gallery() {
  const notify = useNotify();
  const [hash, setHash] = useState(() => window.location.hash || `#${SECTIONS[0].id}`);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState(false);
  useEffect(() => { const f = () => setHash(window.location.hash || `#${SECTIONS[0].id}`); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => SECTIONS.map((s) => ({ ...s, demos: s.demos.filter((d) => !q || `${d.name} ${d.keywords} ${d.desc} ${d.kind}`.toLowerCase().includes(q)) })).filter((s) => s.demos.length), [q]);
  const total = visible.reduce((n, s) => n + s.demos.length, 0);

  const jump = useCallback((id) => { window.location.hash = id; document.getElementById(id)?.scrollIntoView({ block: 'start' }); }, []);
  const commands = useMemo(() => [
    ...SECTIONS.map((s) => ({ id: s.id, group: 'Jump to', label: s.label, icon: s.icon, run: () => jump(s.id) })),
    ...SECTIONS.flatMap((s) => s.demos.map((d) => ({ id: `d-${d.id}`, group: 'Components', label: d.name, keywords: d.keywords, run: () => { setQuery(''); setTimeout(() => document.getElementById(`demo-${d.id}`)?.scrollIntoView({ block: 'start' }), 50); } }))),
    { id: 'toast', group: 'Actions', label: 'Show a toast', icon: Bell, run: () => notify('Hello from the command palette') },
  ], [notify, jump]);

  return (
    <CommandPaletteProvider commands={commands}>
      <Shell hash={hash} nav={NAV.filter((n) => visible.some((s) => s.id === n.id))}>
        <PageHeader title="UI Kit Workbench" description={`${SECTIONS.reduce((n, s) => n + s.demos.length, 0)} live demos built from the exported components. Try a theme, change the accent, search, then copy the JSX.`}
          actions={!EMBED && <Button className="hidden md:inline-flex" leftIcon={Smartphone} onClick={() => setPreview(true)}>Responsive preview</Button>} />
        <Customize />
        <div className="mb-8 max-w-md"><SearchInput value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search components (button, table, modal…)" /></div>
        <p className="sr-only" role="status">{total} {total === 1 ? 'demo' : 'demos'} shown</p>

        {visible.length === 0 && <Card><EmptyState icon={Boxes} title={`No components match “${query}”`} description="Try a broader word like form, card or chart." action={<Button size="sm" onClick={() => setQuery('')}>Clear search</Button>} /></Card>}

        <div className="space-y-16">
          {visible.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`} className="t-section mb-4">{s.label}</h2>
              <div className="space-y-5">{s.demos.map((d) => <Demo key={d.id} demo={d} />)}</div>
            </section>
          ))}
        </div>
        <ResponsivePreview open={preview} onClose={() => setPreview(false)} />
      </Shell>
    </CommandPaletteProvider>
  );
}

/** The kit's own frame, wired to the hash so the sidebar highlights the section in view. */
function Shell({ hash, nav, children }) {
  const palette = useCommandPalette();
  const current = NAV.find((n) => n.to === hash);
  return (
    <AppShell
      sidebar={<Sidebar brand={<Brand name="UI Kit" />} items={nav} activePath={hash} footer={<p className="t-caption text-fg-3">Press <kbd className="kbd">⌘K</kbd> to jump anywhere.</p>} />}
      topbar={<Topbar brand={<Brand name="UI Kit" />} breadcrumbs={[{ label: 'Workbench', to: `#${SECTIONS[0].id}` }, { label: current?.label || SECTIONS[0].label }]} onSearch={palette.open} right={<ThemeSwitcher />} />}
      mobileNav={<MobileNav items={nav} activePath={hash} />}>
      {children}
    </AppShell>
  );
}
