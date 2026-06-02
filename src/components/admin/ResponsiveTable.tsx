import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type ResponsiveTableProps = {
  children: ReactNode;
  className?: string;
  minWidth?: string;
};

export function ResponsiveTable({
  children,
  className,
  minWidth = '640px',
}: ResponsiveTableProps) {
  return (
    <div className={cn('vt-table-scroll', className)}>
      <div
        className="overflow-hidden rounded-2xl border border-vt-border bg-vt-surface shadow-vt-card sm:rounded-3xl"
      >
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          {children}
        </table>
      </div>
      <p className="mt-2 text-center text-xs text-vt-muted sm:hidden">Swipe sideways to see more →</p>
    </div>
  );
}
