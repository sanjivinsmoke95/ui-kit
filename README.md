# UI Kit

A themeable **React + Tailwind** component kit, extracted from the RecallDSA app so it can be reused in any project.
Forest / paper / dark / blue / warm themes, an accent color you can change at runtime, KPI tiles and cards, forms, overlays, tables,
dependency-free SVG charts, an app shell (sidebar, topbar, mobile tab bar) and a ⌘K command palette.

* **Design tokens, not hard-coded colors.** Every color, radius, shadow and z-index is a CSS variable (`src/styles/kit.css`), so a new theme or brand color needs no component edits.
* **Router-agnostic.** Nothing imports a router; give `<LinkProvider>` your router's link component (or use plain `<a>`).
* **Accessible by default.** Focus-visible rings, focus trapping, focus restore and Esc handling in dialogs/drawers/palette, roving keyboard support in tabs, segmented controls, menus and tables, labelled form fields, `prefers-reduced-motion` respected.
* **Small surface.** Peer deps: `react`, `framer-motion`, `lucide-react`, `tailwindcss@3`; one runtime dep: `clsx`. Charts are plain SVG/CSS (no chart library).

## Quick start (about two minutes)

You **copy** the kit into your project, so you can edit anything. Start from the root of an existing React + Vite project:

```bash
# 1. get the kit once, anywhere
git clone https://github.com/sanjivinsmoke/ui-kit.git ~/ui-kit

# 2. copy it in: everything, or only some components (their dependencies come along)
node ~/ui-kit/bin/ui-kit.mjs init src/ui-kit
node ~/ui-kit/bin/ui-kit.mjs add Button Modal DataTable src/ui-kit
```

The command ends with **exact next steps for your project** (it reads your `package.json` and only lists what is missing). In short:

```bash
npm i clsx framer-motion lucide-react
npm i -D tailwindcss@3 postcss autoprefixer      # Tailwind 3.4: the kit does not support Tailwind 4 yet
```

```js
// tailwind.config.js   (the content glob MUST cover the copied folder, or the kit's classes are not generated)
import kit from './src/ui-kit/tailwind-preset.js';
export default { presets: [kit], content: ['./index.html', './src/**/*.{js,jsx}'] };
```

```js
// postcss.config.js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

```css
/* src/index.css: contains the @tailwind directives, every theme token and the component classes */
@import './ui-kit/styles/kit.css';
/* optional fonts (otherwise system fonts are used): npm i @fontsource/anton @fontsource-variable/geist @fontsource-variable/geist-mono */
@import './ui-kit/styles/fonts.css';
```

```jsx
import { ThemeProvider, ToastProvider, LinkProvider, Button } from './ui-kit';        // after `init`
// after `add`, import from the copied files instead: import Button from './ui-kit/components/Button';

<ThemeProvider defaultTheme="forest" storageKey="my-app.theme">
  <ToastProvider>
    <LinkProvider component={RouterLink}>   {/* optional. Next.js: component={NextLink} prop="href" */}
      <App />
    </LinkProvider>
  </ToastProvider>
</ThemeProvider>
```

### CLI reference

| Command | Does |
|---|---|
| `ui-kit list` | Every file, what it exports, and the npm packages it needs |
| `ui-kit init <dest>` | Copies the whole kit (including `index.js`, so `import { Button } from './ui-kit'` works) |
| `ui-kit add <Name...> <dest>` | Copies the named components, everything they import, and the shared `styles/kit.css`, `styles/fonts.css`, `tailwind-preset.js`. Names are file names or export names, any case (`DataTable` lives in `Table.jsx`) |
| `--dry-run` | Prints what would happen and writes nothing |
| `--force` | Overwrites files that already exist **and differ** |

**Existing files are never overwritten silently.** Identical files are left alone; files that differ are skipped, listed, and the command exits with code 2. Re-run with `--force` to pull updates (commit your edits first). An unknown name copies nothing and suggests the closest matches. Which provider a component needs (`ToastProvider`, `ThemeProvider`, `CommandPaletteProvider`) is printed after `add`.

## What's in it

| Area | Components |
|---|---|
| Actions | `Button` (variants, sizes, `loading`, `as`), `IconButton`, `BurstToggle`, `Dropdown`, `Tooltip` |
| Forms | `Field`, `Input`, `Textarea`, `Select`, `SearchInput`, `Checkbox`, `Toggle`, `Segmented`, `TagInput` |
| Surfaces | `MetricCard`, `TimeTracker`, `Card`, `Section`, `StatCard` + `StatGroup` (KPI tiles with mini visuals), `ItemCard`, `SpotlightCard`, `Pill` |
| Feedback | `Alert`, `Banner`, `Badge`, `StatusBadge`, `LevelBadge`, `PriorityBars`, `Chip`, `Toast` (`useNotify`), `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, `LoadingState`, `ProgressBar`, `ProgressCircle` |
| Overlays | `Modal`, `Drawer`, `ConfirmDialog`, `CommandPaletteProvider` |
| Search & history | `SearchBox` (ARIA combobox with suggestions + recent searches), `Highlight`, `ResultCard`, `FilterChips`, `HistoryList` (grouped by day, searchable, removable) |
| Site | `LandingPage`, `LandingNav`, `LandingHero`, `FeatureGrid`, `StepList`, `CompareColumns`, `PricingTable`, `FaqList`, `CtaBand`, `SiteFooter`, `AppWindow` |
| Navigation | `Tabs`, `TabPanel`, `Breadcrumb`, `Pagination`, `Sidebar`, `Topbar`, `MobileNav`, `AppShell`, `PageHeader`, `ThemeSwitcher` |
| Data | `Table`, `DataTable` (sortable, mobile rows), `Avatar`, `FileGlyph`, `AnimatedValue` |
| Charts | `GaugeChart`, `GapChart`, `LineChart` (+ `ChartLegend`), `BarChart`, `DonutChart`, `Sparkline`, `ProgressChart`, `ComparisonView`, `ActivityTimeline`, `Viz` (segments / dots / spark / bars / split) |
| Effects | `InteractiveBackground` (cursor-reactive `dots` / `network` canvas, theme-aware, reduced-motion safe), `Marquee`, `RevealText`, `RotatingText` |
| Hooks | `useOverlay`, `useHotkey`, `useElementWidth`, `useTheme` |

Run the playground to see all of them live: `npm install && npm run dev` (http://localhost:5190). It is one app with five connected views (`?page=site|dashboard|search|history|components`) that share one theme, one shell and one history: a **Site** (built with `LandingPage`), an interactive **Dashboard**, a **Search** page, a **History** page and the **Components** workbench. Searching and opening results is recorded in History. The workbench has a searchable component catalogue, theme and accent controls, a responsive (phone / tablet) preview, and a copyable JSX snippet for every demo. `npm run build` verifies the kit compiles and `npm test` runs the unit tests (colour and contrast utilities, theme-token contrast, CLI behaviour).

## Layout example

```jsx
<CommandPaletteProvider commands={[{ id: 'home', group: 'Go to', label: 'Home', icon: Home, run: () => navigate('/') }]}>
  <AppShell
    sidebar={<Sidebar brand={<Brand name="Acme" />} items={nav} activePath={pathname} user={{ name: 'Ada', subtitle: 'ada@acme.dev' }} />}
    topbar={<Topbar breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Reports' }]} onSearch={palette.open} right={<ThemeSwitcher />} />}
    mobileNav={<MobileNav items={nav} activePath={pathname} />}>
    <PageHeader title="Reports" description="…" actions={<Button variant="primary">New</Button>} />
    …
  </AppShell>
</CommandPaletteProvider>
// nav: [{ id, label, to, icon, group?, mobile?, badge? }]
```

## Theming

* Themes: `forest` (**Forest Light**, the default: pale green-grey canvas, white floating panels, deep green accent), `paper`, `dark` (Graphite), `blue`, `warm`. Switch with `useTheme().setTheme('paper')`; list them with `themes`. Each is a `[data-theme='…']` block in `styles/kit.css`.
* Change the brand colour at runtime: `useTheme().setAccent('#E11D48')`. The link/text shade **and the label colour on filled accents** (white or near-black, whichever is more readable) are derived for you. `setAccent(null)` resets it. Only `#rgb` / `#rrggbb` is accepted; anything else is ignored with a console warning.
* Saved settings are validated on load: an unknown theme id, a malformed accent, corrupt JSON or blocked storage all fall back to the defaults instead of breaking the page.
* Add a theme: add a `[data-theme='mine'] { --bg: …; --surface: …; --fg: …; --accent: …; --accent-fg: …; --danger-fg: … }` block (copy `dark`), then `<ThemeProvider themes={[...themes, { id: 'mine', label: 'Mine', dark: true }]}>`. `npm test` checks the contrast of the built-in themes; add yours to `themes` and it is covered too.
* Shape: the five `--radius-*` variables and `--radius-card` set the whole product's corner style (default: tight, 3 to 8px). Card look: `--card-line`, `--card-fill`. Card accent tones: `tone-accent|purple|blue|teal|orange|red|green`.
* To avoid a flash of the wrong theme on first paint, set `<html data-theme="forest">` in your `index.html` to your default.

## Conventions

* Class names are Tailwind utilities over the token palette (`bg-surface`, `text-fg-2`, `border-line`, `text-accent-text`, `bg-sem-purple/10`, …); see `src/tailwind-preset.js`.
* Typography helpers: `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-body`, `t-small`, `t-caption`, `t-eyebrow`, `t-mono`. Form control class: `ctl`.
* `cn()` joins class names but does not resolve Tailwind conflicts: to override a variant's colour on a `Button`/`Badge`, use the important modifier (`className="!text-accent-fg"`), or add a variant.
* Keep new components in `src/components`, export them from `src/index.js`, and add an entry (with a JSX snippet) to the `SECTIONS` list in `playground/Gallery.jsx`.
* Buttons, icon buttons, segmented controls and menu items grow to a 44px touch target on touch screens (`@media (pointer: coarse)`).

## Provenance

Extracted from the RecallDSA frontend. App-specific pieces (problem/mastery badges, API hooks, auth, routes, notifications) were left out or rewritten as props-driven building blocks.
