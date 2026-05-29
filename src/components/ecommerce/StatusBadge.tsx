import type { OrderStatus } from '../../types/product';
import { Badge } from '../ui/badge';

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: 'success' | 'shipped' | 'warning' | 'danger' }
> = {
  pending: { label: 'New Order', variant: 'warning' },
  delivered: { label: 'Delivered', variant: 'success' },
  shipped: { label: 'Shipped', variant: 'shipped' },
  processing: { label: 'Processing', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};

type StatusBadgeProps = {
  status: OrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
