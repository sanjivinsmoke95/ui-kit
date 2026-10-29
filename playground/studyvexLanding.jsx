import { BookOpen, Braces, Briefcase, Database, ListChecks, MessageSquare } from 'lucide-react';
import { AppWindow, Badge, Button, GradientText, ProgressBar } from '../src';

/** Mini product mockup for the hero, built from kit components. */
const Mockup = () => (
  <AppWindow title="studyvex.in / workspace">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-[1.0625rem] font-semibold">Placement Command Center</p><p className="t-caption mt-1 text-fg-3">Example learner view · Technical interview prep</p></div>
      <Badge variant="success">On track</Badge>
    </div>
    <div className="mt-5 grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-line p-3"><p className="t-caption text-fg-3">DSA Progress</p><p className="mt-1 text-xl font-semibold tabular-nums">184<span className="t-caption text-fg-3">/550</span></p><ProgressBar value={184 / 550} className="mt-2" ariaLabel="DSA progress" size="sm" /></div>
      <div className="rounded-xl border border-line p-3"><p className="t-caption text-fg-3">Core CS</p><p className="mt-1 text-xl font-semibold">4 <span className="t-caption text-fg-3">subjects</span></p><p className="t-caption mt-2 text-accent-text">200+ Qs each</p></div>
      <div className="rounded-xl border border-line p-3"><p className="t-caption text-fg-3">Today's focus</p><p className="mt-1 text-xl font-semibold">2.5 <span className="t-caption text-fg-3">hrs</span></p><p className="t-caption mt-2 text-success">Goal met</p></div>
    </div>
    <p className="t-eyebrow mb-2 mt-5 text-fg-3">Continue learning</p>
    <div className="flex items-center gap-3 rounded-xl border border-line p-3">
      <span className="t-mono grid h-9 w-9 place-items-center rounded-lg bg-surface-2">DP</span>
      <div className="min-w-0 flex-1"><p className="t-small truncate font-medium">Dynamic Programming: 0/1 Knapsack</p><p className="t-caption text-fg-3">Optimal substructure & memoization</p></div>
      <Button size="sm" variant="primary">Continue</Button>
    </div>
  </AppWindow>
);

/** Config for <LandingPage {...studyvexPage} />: the StudyVex marketing page rendered with the kit. */
export const studyvexPage = {
  nav: {
    links: [{ label: 'Placement Tracks', href: '#tracks' }, { label: 'How it works', href: '#how' }, { label: 'Product proof', href: '#proof' }, { label: 'Pricing', href: '#pricing' }, { label: 'FAQ', href: '#faq' }],
    actions: <><Button variant="outline" size="sm" as="a" href="?page=dashboard">Log in</Button><Button variant="primary" size="sm" as="a" href="#tracks">Explore StudyVex</Button></>,
  },
  hero: {
    badge: 'The Structured Placement Workspace for Engineers',
    title: <>Your placement prep, <GradientText>built for engineers.</GradientText> DSA, Core CS &amp; interviews in one workspace.</>,
    description: 'Stop juggling tabs and sheets. Learn concepts, practise problems, and track readiness in a single, structured workspace.',
    actions: <><Button variant="primary" size="lg" as="a" href="#pricing">Start learning free</Button><Button variant="outline" size="lg" as="a" href="#how">See how it works</Button></>,
    bullets: ['Free forever core access', '580+ curated DSA problems', 'Core CS subjects & quizzes', 'Interview question bank'],
    visual: <Mockup />,
  },
  features: {
    id: 'tracks', eyebrow: 'Structured placement tracks', title: 'Everything you need to clear technical interviews.',
    items: [
      { icon: ListChecks, title: 'DSA Sheets & Topic Practice', description: 'Curated sheets organised by topic and difficulty, with progress you can see.', cta: { label: 'Start track', href: '?page=dashboard' } },
      { icon: Braces, title: 'Algorithmic Coding Patterns', description: 'Learn the reusable patterns behind hundreds of problems instead of memorising answers.', cta: { label: 'Start track', href: '?page=dashboard' } },
      { icon: BookOpen, title: 'Core CS Subjects & Quizzes', description: 'OS, DBMS, networks and OOP with focused quizzes to lock the concepts in.', cta: { label: 'Start track', href: '?page=dashboard' } },
      { icon: Database, title: 'Interactive SQL Practice', description: 'Write and run queries against real datasets, from joins to window functions.', cta: { label: 'Start track', href: '?page=dashboard' } },
      { icon: MessageSquare, title: 'Technical Interview Question Bank', description: 'Frequently asked questions with the reasoning interviewers look for.', cta: { label: 'Start track', href: '?page=dashboard' } },
      { icon: Briefcase, title: 'HR & Behavioral Preparation', description: 'Structure your stories and rehearse answers for the non-technical rounds.', cta: { label: 'Start track', href: '?page=dashboard' } },
    ],
  },
  steps: {
    id: 'how', eyebrow: 'The learning journey', title: 'How to prepare with StudyVex.',
    items: [
      { title: 'Choose your learning track', description: 'Pick DSA, Core CS, SQL or interviews and get a clear path.' },
      { title: 'Learn concepts & practise', description: 'Read the idea, then solve problems that apply it straight away.' },
      { title: 'Track & build placement readiness', description: 'See streaks, topic coverage and weak spots in one dashboard.' },
    ],
  },
  compare: {
    id: 'proof', eyebrow: 'The StudyVex advantage', title: 'Why engineers switch from tab chaos to StudyVex.',
    left: { title: 'The fragmented workflow', items: ['Problems in one tab, notes in another', 'No view of what you have actually covered', 'Answers copied, never understood'] },
    right: { title: 'The StudyVex desk', items: ['Concepts, practice and tracking in one place', 'Progress by topic so gaps are obvious', 'Approach breakdowns, not just code dumps'] },
  },
  pricing: {
    id: 'pricing', eyebrow: 'Pricing', title: 'Transparent student pricing.', description: 'Start free and upgrade only when you need more.',
    tiers: [
      { name: 'Starter', price: '₹0', period: 'free', description: 'Core access, free forever', features: ['Core DSA problems', 'Core CS notes', 'Progress tracking'], cta: { label: 'Start preparing free', href: '?page=dashboard' } },
      { name: '2-Day Sprint Pass', price: '₹9', period: 'one-time', description: 'A short, intense push', features: ['Everything in Starter', 'Full access for 2 days', 'Interview question bank'], cta: { label: 'Try for ₹9', href: '?page=dashboard' } },
      { name: 'Premium Pro', price: '₹49', period: '/month', was: '₹199', discount: '75% off', popular: true, features: ['Everything, unlimited', 'Video desk & approach tiers', 'Interactive SQL practice', 'Priority support'], cta: { label: 'Unlock full access', href: '?page=dashboard' } },
    ],
  },
  faq: {
    id: 'faq', title: 'Frequently asked questions.',
    items: [
      { q: 'Is there really a free plan?', a: 'Yes. Core access is free forever, and you only pay if you want the extras.' },
      { q: 'What is the 2-Day Sprint Pass?', a: 'A one-time ₹9 pass that unlocks everything for two days, ideal before an interview.' },
      { q: 'How is DSA practice structured?', a: 'By topic and difficulty, with each problem broken down by approach so you learn the pattern.' },
      { q: 'Do you cover Core CS and behavioral rounds?', a: 'Yes: Core CS subjects with quizzes, plus HR and behavioral preparation.' },
    ],
  },
  cta: { title: 'Your preparation has a place. Make it StudyVex.', actions: <><Button as="a" href="?page=dashboard" size="lg" className="bg-surface text-fg">Create free account</Button><Button as="a" href="#tracks" size="lg" variant="ghost" className="!text-accent-fg hover:!bg-accent-fg/15">Explore placement prep</Button></> },
  footer: {
    description: 'The structured placement workspace for engineers.',
    groups: [
      { title: 'Placement prep', links: [{ label: 'DSA sheets', href: '?page=search&q=table' }, { label: 'Core CS', href: '?page=search&q=accessibility' }, { label: 'SQL practice', href: '?page=dashboard' }] },
      { title: 'Workspace', links: [{ label: 'Dashboard', href: '?page=dashboard' }, { label: 'Progress', href: '?page=history' }, { label: 'Pricing', href: '#pricing' }] },
      { title: 'Platform & resources', links: [{ label: 'Playbooks', href: '?page=components' }, { label: 'FAQ & support', href: '#faq' }] },
    ],
    // no href yet: these render as plain text until you add your real URLs
    legal: [{ label: 'Privacy & data policy' }, { label: 'Terms of service' }],
    copyright: '© 2026 StudyVex.',
  },
};
