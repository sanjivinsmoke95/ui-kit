# UI Kit

A themeable **React + Tailwind** component kit, extracted from the RecallDSA app so it can be reused in any project.
Dark / blue / light / warm themes, an accent color you can change at runtime, KPI tiles and cards, forms, overlays, tables,
dependency-free SVG charts, an app shell (sidebar, topbar, mobile tab bar) and a ⌘K command palette.

* **Design tokens, not hard-coded colors.** Every color, radius, shadow and z-index is a CSS variable (`src/styles/kit.css`), so a new theme or brand color needs no component edits.
* **Router-agnostic.** Nothing imports a router; give `<LinkProvider>` your router's link component (or use plain `<a>`).
* **Accessible by default.** Focus-visible rings, focus trapping and Esc handling in dialogs/drawers/palette, roving keyboard support in tabs and tables, `prefers-reduced-motion` respected.
* **Small surface.** Peer deps: `react`, `framer-motion`, `lucide-react`, `tailwindcss@3`; one runtime dep: `clsx`. Charts are plain SVG/CSS (no chart library).

## Use it in a project

You **copy** the kit into the project (so you can edit anything), using the included CLI:

```bash
git clone https://github.com/sanjivinsmoke95/ui-kit.git        # once, anywhere
node ui-kit/bin/ui-kit.mjs init ../my-app/src/ui-kit            # copy everything
node ui-kit/bin/ui-kit.mjs add Button Modal DataTable ../my-app/src/ui-kit   # or only some (dependencies are included)
node ui-kit/bin/ui-kit.mjs list                                 # what is available
```

Then in the project:

```bash
npm i clsx framer-motion lucide-react
npm i -D tailwindcss@3 postcss autoprefixer      # if you do not have Tailwind yet
```

```js
// tailwind.config.js
import kit from './src/ui-kit/tailwind-preset.js';
export default { presets: [kit], content: ['./index.html', './src/**/*.{js,jsx}'] };   // the glob must include the copied kit
```

```css
/* src/index.css  (contains the @tailwind directives, tokens and component classes) */
@import './ui-kit/styles/kit.css';
/* optional fonts: npm i @fontsource/anton @fontsource-variable/geist @fontsource-variable/geist-mono, then: */
@import './ui-kit/styles/fonts.css';
```

```jsx
import { ThemeProvider, ToastProvider, LinkProvider } from './ui-kit';
import { Link as RouterLink } from 'react-router-dom';        // optional: any router

<ThemeProvider defaultTheme="blue" storageKey="my-app.theme">
  <ToastProvider>
    <LinkProvider component={RouterLink}>   {/* Next.js: component={NextLink} prop="href" */}
      <App />
    </LinkProvider>
  </ToastProvider>
</ThemeProvider>
```

Pull updates later by re-running the same `init`/`add` command (it overwrites the copied files, so keep your edits in a branch or commit first).

## What's in it

| Area | Components |
|---|---|
| Actions | `Button` (variants, sizes, `loading`, `as`), `IconButton`, `BurstToggle`, `Dropdown`, `Tooltip` |
| Forms | `Field`, `Input`, `Textarea`, `Select`, `SearchInput`, `Checkbox`, `Toggle`, `Segmented`, `TagInput` |
| Surfaces | `Card`, `Section`, `StatCard` + `StatGroup` (KPI tiles with mini visuals), `ItemCard`, `SpotlightCard`, `Pill` |
| Feedback | `Alert`, `Banner`, `Badge`, `StatusBadge`, `LevelBadge`, `PriorityBars`, `Chip`, `Toast` (`useNotify`), `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, `LoadingState`, `ProgressBar`, `ProgressCircle` |
| Overlays | `Modal`, `Drawer`, `ConfirmDialog`, `CommandPaletteProvider` |
| Navigation | `Tabs`, `TabPanel`, `Breadcrumb`, `Pagination`, `Sidebar`, `Topbar`, `MobileNav`, `AppShell`, `PageHeader`, `ThemeSwitcher` |
| Data | `Table`, `DataTable` (sortable, mobile rows), `Avatar`, `FileGlyph`, `AnimatedValue` |
| Charts | `LineChart`, `BarChart`, `DonutChart`, `Sparkline`, `ProgressChart`, `ComparisonView`, `ActivityTimeline`, `Viz` (segments / dots / spark / bars / split) |
| Effects | `Marquee`, `RevealText`, `RotatingText` |
| Hooks | `useOverlay`, `useHotkey`, `useElementWidth`, `useTheme` |

Run the playground to see all of them live: `npm install && npm run dev` (http://localhost:5190). `npm run build` verifies the whole kit compiles.

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

* Switch presets with `useTheme().setTheme('light')`; list them with `themes`. They are `[data-theme='…']` blocks in `styles/kit.css`.
* Change the brand color at runtime: `useTheme().setAccent('#E11D48')` (text/link shade is derived), or set `--accent` / `--accent-text` yourself.
* Add a theme: add a `[data-theme='mine'] { --bg: …; --surface: …; --fg: …; --accent: … }` block (copy `dark`), then `<ThemeProvider themes={[...themes, { id: 'mine', label: 'Mine', dark: true }]}>`.
* Card look: `--card-line`, `--card-fill`, `--radius-card`. Card accent tones: `tone-accent|purple|blue|teal|orange|red|green` (safelisted by the preset).

## Conventions

* Class names are Tailwind utilities over the token palette (`bg-surface`, `text-fg-2`, `border-line`, `text-accent-text`, `bg-sem-purple/10`, …); see `src/tailwind-preset.js`.
* Typography helpers: `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-body`, `t-small`, `t-caption`, `t-eyebrow`, `t-mono`. Form control class: `ctl`.
* Keep new components in `src/components`, export them from `src/index.js`, and add a demo to `playground/Gallery.jsx`.

## Provenance

Extracted from the RecallDSA frontend. App-specific pieces (problem/mastery badges, API hooks, auth, routes, notifications) were left out or rewritten as props-driven building blocks.
