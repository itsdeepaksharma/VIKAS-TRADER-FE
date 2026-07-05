import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../../lib/utils';

type AdminPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function AdminPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className,
}: AdminPaginationProps) {
  if (totalItems === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-vt-border bg-vt-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-sm text-vt-muted">
        Showing {start}–{end} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev}
          className="inline-flex items-center gap-1 rounded-xl border border-vt-border px-3 py-2 text-sm font-medium text-vt-foreground transition-colors hover:bg-vt-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="min-w-[5.5rem] text-center text-sm font-medium text-vt-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="inline-flex items-center gap-1 rounded-xl border border-vt-border px-3 py-2 text-sm font-medium text-vt-foreground transition-colors hover:bg-vt-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
