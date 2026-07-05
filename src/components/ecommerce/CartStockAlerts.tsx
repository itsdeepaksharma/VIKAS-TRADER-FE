import type { CartStockIssue } from '../../lib/cartStockSync';
import { cn } from '../../lib/utils';

type CartStockAlertsProps = {
  issues: CartStockIssue[];
  syncing?: boolean;
  className?: string;
};

export function CartStockAlerts({ issues, syncing, className }: CartStockAlertsProps) {
  if (!syncing && issues.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {syncing && (
        <p className="rounded-2xl bg-vt-light-blue/50 px-4 py-3 text-sm text-vt-muted">
          Checking latest stock availability…
        </p>
      )}
      {issues.map((issue) => (
        <p
          key={`${issue.productId}-${issue.type}-${issue.message}`}
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            issue.type === 'quantity_reduced'
              ? 'bg-amber-50 text-amber-800'
              : 'bg-red-50 text-red-600',
          )}
        >
          {issue.message}
        </p>
      ))}
    </div>
  );
}
