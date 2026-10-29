import { useMemo, useState } from 'react';
import { Activity, Eye, Search as SearchIcon } from 'lucide-react';
import { Card, HistoryList, PageHeader, SearchInput, StatCard, StatGroup, Tabs, useNotify } from '../src';
import AppFrame from './AppFrame';
import { history, useHistory } from './historyStore';

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

/** Everything you searched, opened or did, grouped by day, filterable, searchable and removable (with undo). */
export default function HistoryPage() {
  const notify = useNotify();
  const entries = useHistory();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const count = (t) => entries.filter((e) => e.type === t).length;
  const shown = useMemo(() => entries.filter((e) => (tab === 'all' || e.type === tab) && (!q.trim() || `${e.title} ${e.subtitle || ''}`.toLowerCase().includes(q.trim().toLowerCase()))), [entries, tab, q]);
  const today = entries.filter((e) => new Date(e.at).getTime() >= startOfToday()).length;

  const open = (it) => {
    if (it.type === 'search') { window.location.assign(`?page=search&q=${encodeURIComponent(it.title)}`); return; }
    notify(`Opened “${it.title}”`);
  };
  const remove = (it) => {
    history.remove(it.id);
    notify(`Removed “${it.title}”`);
  };

  return (
    <AppFrame page="history" crumb="History">
      <PageHeader title="History" description="Your searches, visits and actions, newest first. Search here, or remove anything you do not want to keep." />
      <StatGroup fit className="mb-6">
        <StatCard featured label="Today" value={today} icon={Activity} hint="entries today" />
        <StatCard label="Searches" value={count('search')} icon={SearchIcon} hint="all time" />
        <StatCard label="Pages visited" value={count('visit')} icon={Eye} hint="all time" />
      </StatGroup>
      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 pt-2">
          <Tabs idPrefix="hist" label="History type" value={tab} onChange={setTab} className="border-b-0"
            items={[{ id: 'all', label: 'All', count: entries.length }, { id: 'search', label: 'Searches', count: count('search') }, { id: 'visit', label: 'Visits', count: count('visit') }, { id: 'action', label: 'Actions', count: count('action') }]} />
          <SearchInput className="mb-2 w-full sm:w-64" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Search history" />
        </div>
        <div className="p-5">
          <HistoryList items={shown} query={q} onOpen={open} onRemove={remove} onClear={() => { history.clear(); notify('History cleared'); }}
            empty={<p className="t-small py-10 text-center text-fg-3">{q ? `No history matches “${q}”.` : 'Nothing here yet. Search or open something and it will appear.'}</p>} />
        </div>
      </Card>
    </AppFrame>
  );
}
