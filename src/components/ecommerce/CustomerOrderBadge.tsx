import type { OrderStatus } from '../../types/product';
import { customerStatusLabel } from '../../lib/orderStatus';
import { Badge } from '../ui/badge';

type CustomerOrderBadgeProps = {
  status: OrderStatus;
};

export function CustomerOrderBadge({ status }: CustomerOrderBadgeProps) {
  const label = customerStatusLabel(status);
  const variant = status === 'cancelled' ? 'danger' : label === 'Confirmed' ? 'success' : 'warning';

  return <Badge variant={variant}>{label}</Badge>;
}
