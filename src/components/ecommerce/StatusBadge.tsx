import type { OrderStatus } from '../../types/product';
import { cn } from '../../lib/utils';
import { adminStatusLabel } from '../../lib/adminOrderStatus';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200/80',
  processing: 'bg-sky-100 text-sky-800 ring-sky-200/80',
  shipped: 'bg-indigo-100 text-indigo-800 ring-indigo-200/80',
  delivered: 'bg-emerald-100 text-emerald-800 ring-emerald-200/80',
  cancelled: 'bg-rose-100 text-rose-800 ring-rose-200/80',
};

type StatusBadgeProps = {
  status: OrderStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
        statusStyles[status],
        className,
      )}
    >
      {adminStatusLabel(status)}
    </span>
  );
}
