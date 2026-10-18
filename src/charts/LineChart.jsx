import { useId, useState } from 'react';
import { useElementWidth } from '../hooks/useElementWidth';

const PAD = { top: 12, right: 8, bottom: 24, left: 32 };

/** Smooth area line chart. data: [{ label, value }] */
const niceStep = (raw) => {
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

/** Axis domain with round tick values. `zeroBased=false` zooms to the data range. */
function niceDomain(values, zeroBased) {
  const hi0 = Math.max(...values);
  const lo0 = zeroBased ? 0 : Math.min(...values);
  const step = niceStep(((hi0 - lo0) || 1) / (zeroBased ? 4 : 3));
  const lo = zeroBased ? 0 : Math.floor(lo0 / step) * step;
  const hi = Math.max(lo + 4 * step, Math.ceil(hi0 / step) * step);
  const ticks = [];
  for (let t = lo; t <= hi + 1e-9; t += step) ticks.push(Math.round(t * 100) / 100);
  return { lo, hi, ticks };
}

export default function LineChart({ data, height = 220, zeroBased = true, valueFormat = (v) => v, ariaLabel = 'Line chart' }) {
  const [ref, width] = useElementWidth();
  const [hover, setHover] = useState(null);
  const gradId = useId();

  const { lo, hi, ticks } = niceDomain(data.map((d) => d.value), zeroBased);
  const innerW = Math.max(width - PAD.left - PAD.right, 10);
  const innerH = height - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (i / (data.length - 1)) * innerW;
  const y = (v) => PAD.top + innerH - ((v - lo) / (hi - lo)) * innerH;

  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const line = pts.reduce((acc, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [qx, qy] = pts[i - 1];
    const mx = (qx + px) / 2;
    return `${acc} C${mx},${qy} ${mx},${py} ${px},${py}`;
  }, '');
  const area = `${line} L${x(data.length - 1)},${PAD.top + innerH} L${x(0)},${PAD.top + innerH} Z`;
  const labelEvery = Math.ceil(data.length / Math.max(Math.floor(innerW / 64), 1));

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left - PAD.left) / innerW;
    setHover(Math.max(0, Math.min(data.length - 1, Math.round(rel * (data.length - 1)))));
  };

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height }}>
      {width > 0 && <svg width={width} height={height} role="img" aria-label={ariaLabel} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="touch-pan-y">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0.18 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="stroke-line" strokeDasharray={t === lo ? undefined : '2 4'} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-fg-3 text-[10px]">{t}</text>
          </g>
        ))}
        {data.map((d, i) => i % labelEvery === 0 && (
          <text key={d.label} x={x(i)} y={height - 6} textAnchor="middle" className="fill-fg-3 text-[10px]">{d.label}</text>
        ))}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" className="stroke-accent" strokeWidth="2" strokeLinecap="round" />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} className="stroke-fg-3/50" />
            <circle cx={x(hover)} cy={y(data[hover].value)} r="4" className="fill-bg stroke-accent" strokeWidth="2" />
          </g>
        )}
      </svg>}
      {hover !== null && width > 0 && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-line bg-surface-2 px-2.5 py-1.5 shadow-md"
          style={{ left: Math.min(Math.max(x(hover), 48), width - 48), top: 0 }}
        >
          <p className="t-caption text-fg-3">{data[hover].label}</p>
          <p className="t-mono text-fg">{valueFormat(data[hover].value)}</p>
        </div>
      )}
    </div>
  );
}
