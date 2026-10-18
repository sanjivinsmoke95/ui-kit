import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import IconButton from './IconButton';

export default function Pagination({ page, pageCount, onChange, total, pageSize }) {
  const from = total ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total || 0);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      <p className="t-small text-fg-3">
        {total !== undefined && (<>Showing <span className="t-mono text-fg-2">{from}–{to}</span> of <span className="t-mono text-fg-2">{total}</span></>)}
      </p>
      <div className="flex items-center gap-1">
        <IconButton icon={ChevronLeft} label="Previous page" size="sm" variant="outline" tooltip={false} disabled={page <= 1} onClick={() => onChange(page - 1)} />
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn('t-mono h-8 min-w-8 rounded-md px-2 transition', p === page ? 'bg-surface-2 text-fg' : 'text-fg-3 hover:bg-surface-2 hover:text-fg')}
            >
              {p}
            </button>
          ))}
        </div>
        <IconButton icon={ChevronRight} label="Next page" size="sm" variant="outline" tooltip={false} disabled={page >= pageCount} onClick={() => onChange(page + 1)} />
      </div>
    </nav>
  );
}
