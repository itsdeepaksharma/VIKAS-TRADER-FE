import type { OrderStatus } from '../types/product';

/** Admin-facing labels aligned with customer Confirmed / Cancelled flow */
export const ADMIN_ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Confirmed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ADMIN_ORDER_FILTER_OPTIONS = [
  { value: '', label: 'All orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export function adminStatusLabel(status: OrderStatus): string {
  const match = ADMIN_ORDER_STATUS_OPTIONS.find((o) => o.value === status);
  if (match) return match.label;
  if (status === 'shipped') return 'Confirmed';
  return status;
}
