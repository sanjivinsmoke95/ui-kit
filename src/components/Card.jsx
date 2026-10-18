import { Link } from '../utils/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Children } from 'react';
import { cn } from '../utils/cn';
import Sparkline from '../charts/Sparkline';
import AnimatedValue from './AnimatedValue';
import Viz from './Viz';

/** Bordered container. Use sparingly — prefer open layouts with dividers. */
export function Card({ as: Tag = 'div', interactive, padded = true, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'card',
        padded && 'p-6',
        interactive && 'transition hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Section heading row used inside pages: title + optional description + right-aligned action. */
export function SectionHeader({ title, description, action, className }) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="t-section">{title}</h2>
        {description && <p className="t-small mt-1 text-fg-3">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const DOT = { success: 'bg-success', danger: 'bg-danger', warning: 'bg-warning', accent: 'bg-accent-text', neutral: 'bg-fg-3',
  blue: 'bg-sem-blue', purple: 'bg-sem-purple', teal: 'bg-sem-teal', orange: 'bg-sem-orange' };

/** Status pill for a card footer: a coloured dot and an upper-case label. */
export function Pill({ tone = 'neutral', children, className }) {
  return (
    <span className={cn('pill', className)}>
      <span className={cn('h-2 w-2 shrink-0 rounded-full', DOT[tone] || DOT.neutral)} aria-hidden />
      {children}
    </span>
  );
}

/**
 * A KPI card in the app's card theme: a plain label with a round arrow button, a big display number, a one-line description, and a small
 * visual at the bottom (`viz`: segments | dots | spark | bars | split).
 *   to    makes the whole card a link      tone  accent | purple | blue | teal | orange | red | green (accent colour on hover)
 *   viz   { type, ...props }               pill / aside are optional extras for cards that need a status chip or a second figure
 */
export function StatCard({ label, value, delta, trend, icon: Icon, hint, to, tone, arrow, viz, pill, aside, className }) {
  const positive = delta >= 0;
  const numeric = /\d/.test(String(value));
  const linked = Boolean(to) || arrow;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="line-clamp-2 min-w-0 text-[12.5px] font-medium leading-tight text-fg-2" title={typeof label === 'string' ? label : undefined}>{label}</span>
        {(linked || Icon) && <span className="card-orb" aria-hidden>{linked ? <ArrowUpRight className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}</span>}
      </div>
      <div className="mt-0.5 flex items-end justify-between gap-3">
        <span className="font-display text-[1.9rem] font-normal leading-none tabular-nums">{numeric ? <AnimatedValue value={value} /> : value}</span>
        {trend && <Sparkline data={trend} className="hidden h-8 w-20 text-accent-text min-[480px]:block" />}
      </div>
      {(delta !== undefined || hint) && (
        <div className="mt-0.5 flex items-start gap-1.5 text-[12px] leading-snug text-fg-2">
          {delta !== undefined && (
            <span className={cn('inline-flex items-center font-medium', positive ? 'text-success' : 'text-danger')}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden />}
              {Math.abs(delta)}%
            </span>
          )}
          <span className="line-clamp-2 min-w-0" title={typeof hint === 'string' ? hint : undefined}>{hint}</span>
        </div>
      )}
      {(viz || pill || aside) && (
        <div className="mt-auto pt-2">
          {viz && <Viz {...viz} />}
          {(pill || aside) && (
            <div className={cn('flex flex-wrap items-end justify-between gap-x-3 gap-y-2', viz && 'mt-3')}>
              {pill ? <Pill tone={pill.tone}>{pill.label}</Pill> : <span />}
              {aside && (
                <span className="flex items-baseline gap-1.5">
                  <span className="font-display text-[1.75rem] leading-none tabular-nums">{aside.value}</span>
                  {aside.suffix && <span className="text-[12px] text-fg-3">{aside.suffix}</span>}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
  const cls = cn('card stat-card', tone && `tone-${tone}`, className);
  return to
    ? <Link to={to} className={cn(cls, 'group no-underline hover:no-underline')}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

const WIDE_COLS = { 2: 'min-[1280px]:grid-cols-2', 3: 'min-[1280px]:grid-cols-3', 4: 'min-[1280px]:grid-cols-4', 5: 'min-[1280px]:grid-cols-5', 6: 'min-[1280px]:grid-cols-6' };

/** A row of KPI cards. Default: 2 columns on phones, 4 on desktop; pass e.g. `lg:grid-cols-5` to change.
 *  `fit`: one even row of as many columns as there are cards on wide screens, and 2 columns below that with an odd last card
 *  spanning the full width, so no row is ever left lopsided. */
export function StatGroup({ className, children, fit }) {
  const n = Math.min(6, Math.max(2, Children.toArray(children).length));
  return (
    <div className={cn('grid gap-3', fit
      ? `grid-cols-2 ${WIDE_COLS[n]} [&>*:last-child:nth-child(odd)]:col-span-2 min-[1280px]:[&>*:last-child:nth-child(odd)]:col-span-1`
      : 'grid-cols-2 lg:grid-cols-4', className)}>{children}</div>
  );
}
