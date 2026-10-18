import { cn } from '../utils/cn';

/** Tiny trend line. Inherits color from `text-*` on className. */
export default function Sparkline({ data, className }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / span) * 24}`).join(' ');
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={cn('overflow-visible', className)} aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
