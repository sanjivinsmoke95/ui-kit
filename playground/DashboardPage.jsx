import { useState } from 'react';
import { CheckCircle2, Clock, FolderKanban, Loader, Plus, Video } from 'lucide-react';
import { Avatar, BarChart, Button, Card, Field, GaugeChart, Input, Modal, PageHeader, Segmented, Select, StatCard, StatGroup, StatusBadge, TimeTracker, useNotify } from '../src';
import AppFrame from './AppFrame';
import { history } from './historyStore';

const RANGES = {
  week: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => ({ label, value: [5, 9, 6, 12, 4, 8, 3][i] })),
  month: ['W1', 'W2', 'W3', 'W4', 'W5'].map((label, i) => ({ label, value: [32, 41, 28, 49, 36][i] })),
  year: ['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => ({ label, value: [120, 168, 142, 190][i] })),
};

const SEED = [
  ['Develop API Endpoints', 'Nov 26, 2026', 'running'], ['Onboarding Flow', 'Nov 28, 2026', 'running'], ['Build Dashboard', 'Nov 30, 2026', 'pending'],
  ['Optimize Page Load', 'Dec 5, 2026', 'running'], ['Cross-Browser Testing', 'Dec 6, 2026', 'ended'], ['Design System Audit', 'Dec 8, 2026', 'ended'],
  ['Payment Integration', 'Dec 10, 2026', 'running'], ['Accessibility Review', 'Dec 12, 2026', 'pending'], ['Docs Revamp', 'Dec 14, 2026', 'ended'],
  ['Mobile Release', 'Dec 18, 2026', 'running'], ['Analytics Events', 'Dec 20, 2026', 'ended'], ['Beta Feedback', 'Dec 22, 2026', 'running'],
].map(([name, due, status], i) => ({ id: i + 1, name, due, status }));

const TEAM = [
  { name: 'Alexandra Deff', task: 'GitHub project repository', status: 'completed' },
  { name: 'Edwin Adenike', task: 'Integrate user authentication', status: 'processing' },
  { name: 'Isaac Oluwatemilorun', task: 'Develop search and filter', status: 'review' },
  { name: 'David Oshodi', task: 'Responsive layout for homepage', status: 'processing' },
];
const NEXT = { pending: 'running', running: 'ended', ended: 'pending' };

/** A busy, interactive dashboard built only from kit components: switch the range, add projects, cycle statuses, run the timer. */
export default function DashboardPage() {
  const notify = useNotify();
  const [range, setRange] = useState('week');
  const [projects, setProjects] = useState(SEED);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [track, setTrack] = useState('Web');
  const [timerOn, setTimerOn] = useState(false);

  const count = (s) => projects.filter((p) => p.status === s).length;
  const pct = Math.round((count('ended') / projects.length) * 100);
  const data = RANGES[range];
  const sum = data.reduce((a, d) => a + d.value, 0);

  const cycle = (id) => setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, status: NEXT[p.status] } : p)));
  const add = () => {
    if (!name.trim()) return;
    setProjects((ps) => [{ id: Date.now(), name: name.trim(), due: 'Soon', status: 'pending' }, ...ps]);
    notify(`Added “${name.trim()}” (${track})`);
    history.add({ type: 'action', title: `Added project “${name.trim()}”`, subtitle: `Dashboard · ${track}` });
    setName(''); setAdding(false);
  };

  return (
    <>
      <AppFrame page="dashboard" crumb="Dashboard">
        <PageHeader title="Dashboard" description="Plan, prioritize, and accomplish your tasks with ease."
          actions={<><Button variant="primary" leftIcon={Plus} onClick={() => setAdding(true)}>Add project</Button><Button variant="outline" onClick={() => notify('Import started')}>Import data</Button></>} />

        <StatGroup fit className="mb-4">
          <StatCard featured to="#" icon={FolderKanban} label="Total projects" value={projects.length} delta={5} hint="increased from last month" />
          <StatCard to="#" tone="green" icon={CheckCircle2} label="Ended projects" value={count('ended')} delta={6} hint="increased from last month" />
          <StatCard to="#" tone="blue" icon={Loader} label="Running projects" value={count('running')} delta={2} hint="increased from last month" />
          <StatCard to="#" tone="orange" icon={Clock} label="Pending projects" value={count('pending')} hint="on discuss" />
        </StatGroup>

        <div className="grid gap-4 lg:grid-cols-6">
          <Card className="lg:col-span-3">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="t-h2">Project analytics</h2><p className="t-caption mt-1 text-fg-3">{sum} tasks completed this {range}</p></div>
              <Segmented label="Range" size="sm" value={range} onChange={setRange} options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year' }]} />
            </div>
            <BarChart key={range} data={data} height={190} />
          </Card>

          <Card className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between"><h2 className="t-h2">Projects</h2><Button size="sm" variant="outline" leftIcon={Plus} onClick={() => setAdding(true)}>New</Button></div>
            <ul className="scrollbar-thin -mx-1 max-h-[230px] space-y-1 overflow-y-auto px-1">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-surface-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-text"><FolderKanban className="h-4 w-4" aria-hidden /></span>
                  <div className="min-w-0 flex-1"><p className="t-small truncate font-medium">{p.name}</p><p className="t-caption text-fg-3">Due {p.due}</p></div>
                  <button type="button" onClick={() => cycle(p.id)} aria-label={`${p.name}: ${p.status}. Click to change status`} className="rounded-full">
                    <StatusBadge status={p.status === 'ended' ? 'completed' : p.status === 'running' ? 'processing' : 'queued'} label={p.status === 'ended' ? 'Ended' : p.status === 'running' ? 'Running' : 'Pending'} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="t-h2">Reminders</h2>
            <p className="mt-4 text-[1.375rem] font-semibold leading-snug text-accent-text">Meeting with Arc Company</p>
            <p className="t-small mt-1 text-fg-3">Time: 02:00 pm – 04:00 pm</p>
            <Button className="mt-5" variant="primary" leftIcon={Video} block onClick={() => { setTimerOn(true); notify('Meeting started: timer running'); }}>Start meeting</Button>
          </Card>

          <Card className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between"><h2 className="t-h2">Team collaboration</h2><Button size="sm" variant="outline" leftIcon={Plus} onClick={() => notify('Invite link copied')}>Add member</Button></div>
            <ul className="space-y-3">
              {TEAM.map((m) => (
                <li key={m.name} className="flex items-center gap-3">
                  <Avatar name={m.name} />
                  <div className="min-w-0 flex-1"><p className="t-small truncate font-medium">{m.name}</p><p className="t-caption truncate text-fg-3">{m.task}</p></div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col items-center lg:col-span-2">
            <h2 className="t-h2 self-start">Project progress</h2>
            <GaugeChart className="mt-4" size={240} caption="Projects ended" value={`${pct}%`}
              segments={[{ label: 'Ended', value: count('ended') || 0.001 }, { label: 'Running', value: count('running') || 0.001 }, { label: 'Pending', value: count('pending') || 0.001, hatched: true }]} />
          </Card>

          <TimeTracker className="lg:col-span-6" running={timerOn} onRunningChange={setTimerOn} onStop={(s) => notify(`Logged ${Math.floor(s / 60)} min ${s % 60}s`)} />
        </div>
      </AppFrame>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add project" description="It starts as pending; click its status to change it."
        footer={<><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button variant="primary" onClick={add} disabled={!name.trim()}>Add project</Button></>}>
        <div className="space-y-4">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Launch landing page" /></Field>
          <Field label="Track"><Select value={track} onChange={(e) => setTrack(e.target.value)} options={['Web', 'Mobile', 'AI / ML', 'Hardware']} /></Field>
        </div>
      </Modal>
    </>
  );
}
