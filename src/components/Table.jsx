import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../utils/cn';

/** Low-level table primitives. Use directly for simple static tables. */
export function Table({ className, children }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}
export const Th = ({ className, align, ...props }) => (
  <th scope="col" className={cn('t-label h-10 whitespace-nowrap border-b border-line px-4 font-medium text-fg-3', align === 'right' && 'text-right', className)} {...props} />
);
export const Td = ({ className, align, ...props }) => (
  <td className={cn('t-small border-b border-line px-4 py-3 align-middle text-fg-2', align === 'right' && 'text-right', className)} {...props} />
);

/**
 * columns: [{ key, header, render?(row), sortable?, align?, className? }]
 * `renderMobileRow(row)` swaps the table for stacked rows below the md breakpoint.
 */
export function DataTable({ columns, rows, rowKey = 'id', onRowClick, renderMobileRow, initialSort, className }) {
  const [sort, setSort] = useState(initialSort || null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => (a[sort.key] > b[sort.key] ? dir : a[sort.key] < b[sort.key] ? -dir : 0));
  }, [rows, sort]);

  const toggle = (key) =>
    setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }));

  return (
    <div className={className}>
      {renderMobileRow && (
        <ul className="divide-y divide-line md:hidden">
          {sorted.map((row) => (
            <li key={row[rowKey]}>{renderMobileRow(row)}</li>
          ))}
        </ul>
      )}
      <Table className={renderMobileRow ? 'hidden md:block' : undefined}>
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const Icon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
              return (
                <Th key={c.key} align={c.align} className={c.className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {c.sortable ? (
                    <button type="button" onClick={() => toggle(c.key)} className="-ml-1 inline-flex items-center gap-1 rounded-sm px-1 transition hover:text-fg">
                      {c.header}
                      <Icon className={cn('h-3 w-3', !active && 'opacity-50')} aria-hidden />
                    </button>
                  ) : (
                    c.header
                  )}
                </Th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={onRowClick && (() => onRowClick(row))}
              onKeyDown={onRowClick && ((e) => e.key === 'Enter' && onRowClick(row))}
              tabIndex={onRowClick ? 0 : undefined}
              className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-surface-2/50 focus-visible:bg-surface-2/50')}
            >
              {columns.map((c) => (
                <Td key={c.key} align={c.align} className={c.className}>
                  {c.render ? c.render(row) : row[c.key]}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
