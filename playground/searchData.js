import { BookOpen, Box, FolderKanban, User } from 'lucide-react';

export const TYPES = { component: { label: 'Component', plural: 'Components', icon: Box }, doc: { label: 'Doc', plural: 'Docs', icon: BookOpen }, project: { label: 'Project', plural: 'Projects', icon: FolderKanban }, person: { label: 'Person', plural: 'People', icon: User } };

const c = (title, snippet, demo, tags = '') => ({ type: 'component', title, snippet, to: `?page=components#demo-${demo}`, path: 'Components', tags });
const d = (title, snippet, tags = '') => ({ type: 'doc', title, snippet, to: '?page=components', path: 'Docs', tags });

/** What the search page looks through. Titles, snippets, paths and tags are all searched. */
export const INDEX = [
  c('Button', 'Five variants and three sizes with loading and disabled states; renders as a link with `as`.', 'button', 'action cta primary'),
  c('IconButton', 'Icon-only button with a required label that becomes its tooltip.', 'iconbutton', 'toolbar'),
  c('Dropdown', 'Keyboard menu with arrows, Home, End and Esc that returns focus to the trigger.', 'dropdown', 'menu popover'),
  c('Field and inputs', 'Label, hint and error wired to a single child automatically.', 'field', 'form input select textarea validation'),
  c('Checkbox, Toggle, Segmented', 'Selection controls with disabled states and arrow-key support.', 'controls', 'switch radio filter'),
  c('TagInput', 'Chips plus an input with suggestions, built from Chip.', 'taginput', 'tags autocomplete'),
  c('StatCard', 'KPI tile with a delta pill; a featured variant fills with the accent.', 'statcard', 'kpi metric number'),
  c('MetricCard and GapChart', 'Headline number, comparison and a diverging daily chart.', 'metric', 'kpi chart gap trend'),
  c('Card, Section, ItemCard', 'Rounded, softly shadowed panels for grouped content.', 'cards', 'container panel'),
  c('Badge and StatusBadge', 'Status is always text plus a shape, never colour alone.', 'badges', 'tag label status'),
  c('Alert and Banner', 'Danger alerts use role=alert; the rest are polite.', 'alerts', 'notice message warning'),
  c('Toast', 'Notifications with useNotify; errors are announced assertively.', 'toast', 'notification snackbar'),
  c('Modal, Drawer, ConfirmDialog', 'Focus-trapped dialogs that restore focus and close on Esc.', 'modal', 'dialog popup sheet'),
  c('Tabs', 'Tabs linked to their panels with arrow-key navigation.', 'tabs', 'navigation sections'),
  c('DataTable', 'Sortable columns, loading and empty states, stacked rows on phones.', 'table', 'grid list sort pagination'),
  c('Charts', 'Line, bar, donut, sparkline and progress charts in SVG.', 'charts', 'graph line bar donut'),
  c('LandingPage', 'A complete marketing site from one config object.', 'landingpage', 'website marketing hero pricing faq'),
  c('Search components', 'SearchBox, Highlight, ResultCard and FilterChips for search pages.', 'search', 'find highlight results filter'),
  c('HistoryList', 'Activity grouped by day with search highlighting and undo.', 'history', 'activity recent timeline'),
  d('Installation', 'Copy the kit with the CLI, then add the Tailwind preset and stylesheet.', 'install cli npm vite'),
  d('Theming guide', 'Five themes, runtime accent colours, and how to add your own theme.', 'theme dark paper forest accent'),
  d('CLI reference', 'list, init and add; --dry-run and --force; existing files are never overwritten silently.', 'cli install copy'),
  d('Accessibility notes', 'Focus trapping, roving tabindex, labelled fields and reduced-motion support.', 'a11y keyboard focus'),
  { type: 'project', title: 'Develop API Endpoints', snippet: 'REST endpoints for projects, tasks and members, with auth.', to: '?page=dashboard', path: 'Dashboard · Running', tags: 'backend api' },
  { type: 'project', title: 'Onboarding Flow', snippet: 'Guided first-run experience with progress tracking.', to: '?page=dashboard', path: 'Dashboard · Running', tags: 'ux' },
  { type: 'project', title: 'Build Dashboard', snippet: 'Analytics, KPI tiles and the project list.', to: '?page=dashboard', path: 'Dashboard · Pending', tags: 'charts' },
  { type: 'project', title: 'Cross-Browser Testing', snippet: 'Verify the kit in Chrome, Safari and Firefox.', to: '?page=dashboard', path: 'Dashboard · Ended', tags: 'qa' },
  { type: 'person', title: 'Alexandra Deff', snippet: 'Maintains the GitHub project repository.', to: '?page=dashboard', path: 'Team', tags: 'engineer' },
  { type: 'person', title: 'Edwin Adenike', snippet: 'Working on user authentication.', to: '?page=dashboard', path: 'Team', tags: 'engineer auth' },
].map((x, i) => ({ id: `i${i}`, ...x }));

/** Case-insensitive AND search. Title matches rank above tags, snippets and paths. */
export function search(query, type = 'all') {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return INDEX
    .filter((it) => type === 'all' || it.type === type)
    .map((it) => {
      const title = it.title.toLowerCase();
      const rest = `${it.snippet} ${it.path} ${it.tags}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (title === t) score += 12; else if (title.startsWith(t)) score += 8; else if (title.includes(t)) score += 5; else if (rest.includes(t)) score += 1; else return null;
      }
      return { it, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.it.title.localeCompare(b.it.title))
    .map((x) => x.it);
}

export const suggest = (query, limit = 6) => (query.trim() ? search(query).slice(0, limit).map((it) => ({ label: it.title, hint: TYPES[it.type].label, icon: TYPES[it.type].icon })) : []);
export const POPULAR = ['button', 'modal', 'theme', 'dashboard', 'table', 'cli'];
