import { useState } from 'react';
import { cn } from '../utils/cn';

/** Vertical bars built with flexbox (no SVG text scaling issues). data: [{ label, value }] */
export default function BarChart({ data, height = 200, valueFormat = (v) => v }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div role="img" aria-label="Bar chart" className="w-full">
      <div className="flex items-end gap-2 border-b border-line" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={d.label}
            className="group relative flex h-full flex-1 items-end"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            {hover === i && (
              <span className="t-mono pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 text-fg shadow-md">
                {valueFormat(d.value)}
              </span>
            )}
            <div
              className={cn('w-full rounded-t-sm transition-colors duration-fast', hover === i ? 'bg-accent' : 'bg-accent/45')}
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((d) => (
          <span key={d.label} className="t-caption flex-1 truncate text-center text-fg-3">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
