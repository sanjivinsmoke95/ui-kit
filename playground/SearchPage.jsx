import { useEffect, useMemo, useState } from 'react';
import { Boxes, Clock, Sparkles } from 'lucide-react';
import { Badge, Button, Card, EmptyState, FilterChips, PageHeader, ResultCard, SearchBox, Segmented, useNotify } from '../src';
import AppFrame from './AppFrame';
import { history, useHistory } from './historyStore';
import { INDEX, POPULAR, TYPES, search, suggest } from './searchData';

const initialQuery = () => new URLSearchParams(window.location.search).get('q') || '';

/** Search as a page: big combobox, live suggestions, filters with counts, ranked results with the matched words highlighted. */
export default function SearchPage() {
  const notify = useNotify();
  const entries = useHistory();
  const [text, setText] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('relevance');
  const recent = useMemo(() => [...new Set(entries.filter((e) => e.type === 'search').map((e) => e.title))].slice(0, 6), [entries]);

  useEffect(() => { document.getElementById('main')?.scrollIntoView?.({ block: 'start' }); }, []);

  const all = useMemo(() => search(query, 'all'), [query]);
  const counts = useMemo(() => Object.fromEntries(['all', ...Object.keys(TYPES)].map((t) => [t, t === 'all' ? all.length : all.filter((r) => r.type === t).length])), [all]);
  const results = useMemo(() => {
    const list = type === 'all' ? all : all.filter((r) => r.type === type);
    return sort === 'az' ? [...list].sort((a, b) => a.title.localeCompare(b.title)) : list;
  }, [all, type, sort]);

  const run = (q) => {
    const clean = q.trim();
    if (!clean) return;
    setText(clean); setQuery(clean); setType('all');
    const url = new URL(window.location.href);
    url.searchParams.set('q', clean);
    window.history.replaceState(null, '', url);
    const n = search(clean).length;
    history.add({ type: 'search', title: clean, subtitle: `${n} result${n === 1 ? '' : 's'}` });
  };
  const open = (it) => history.add({ type: 'visit', title: it.title, subtitle: `${TYPES[it.type].label} · ${it.path}` });

  return (
    <AppFrame page="search" crumb="Search">
      <PageHeader title="Search" description="Find components, docs, projects and people. Press / to jump here from anywhere." />
      <SearchBox value={text} onChange={setText} onSubmit={run} placeholder="Search the kit…" autoFocus={!query}
        suggestions={suggest(text)} recent={recent} onSelect={(r) => run(r.label)}
        onRemoveRecent={(t) => history.removeWhere((e) => e.type === 'search' && e.title === t)} onClearRecent={() => history.removeWhere((e) => e.type === 'search')} />

      {!query ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card><p className="t-eyebrow flex items-center gap-2 text-fg-3"><Sparkles className="h-3.5 w-3.5" aria-hidden />Popular searches</p>
            <div className="mt-4 flex flex-wrap gap-2">{POPULAR.map((p) => <Button key={p} size="sm" variant="outline" onClick={() => run(p)}>{p}</Button>)}</div></Card>
          <Card><p className="t-eyebrow flex items-center gap-2 text-fg-3"><Clock className="h-3.5 w-3.5" aria-hidden />Recent</p>
            {recent.length ? <div className="mt-4 flex flex-wrap gap-2">{recent.map((r) => <Button key={r} size="sm" variant="secondary" onClick={() => run(r)}>{r}</Button>)}</div> : <p className="t-small mt-4 text-fg-3">Your searches will appear here.</p>}</Card>
        </div>
      ) : (
        <section className="mt-8" aria-label="Results">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FilterChips items={[{ id: 'all', label: 'All', count: counts.all }, ...Object.entries(TYPES).map(([id, t]) => ({ id, label: t.plural, count: counts[id] }))]} value={type} onChange={setType} />
            <Segmented label="Sort" size="sm" value={sort} onChange={setSort} options={[{ value: 'relevance', label: 'Relevance' }, { value: 'az', label: 'A–Z' }]} />
          </div>
          <p className="t-small mb-4 text-fg-3" role="status">{results.length} result{results.length === 1 ? '' : 's'} for <strong className="text-fg">“{query}”</strong> out of {INDEX.length} items</p>
          {results.length ? (
            <ul className="grid gap-3">
              {results.map((r) => (
                <li key={r.id}><ResultCard icon={TYPES[r.type].icon} title={r.title} snippet={r.snippet} meta={[r.path, r.tags.split(' ').slice(0, 3).join(', ')].filter(Boolean)} query={query} to={r.to} onClick={() => open(r)}
                  badge={<Badge variant={r.type === 'component' ? 'accent' : r.type === 'doc' ? 'info' : r.type === 'project' ? 'success' : 'neutral'}>{TYPES[r.type].label}</Badge>} /></li>
              ))}
            </ul>
          ) : (
            <Card><EmptyState icon={Boxes} title={`Nothing matches “${query}”`} description="Check the spelling, try fewer words, or start from a popular search."
              action={<div className="flex flex-wrap justify-center gap-2">{POPULAR.slice(0, 4).map((p) => <Button key={p} size="sm" variant="outline" onClick={() => run(p)}>{p}</Button>)}<Button size="sm" variant="ghost" onClick={() => { setText(''); setQuery(''); notify('Search cleared'); }}>Clear</Button></div>} /></Card>
          )}
        </section>
      )}
    </AppFrame>
  );
}
