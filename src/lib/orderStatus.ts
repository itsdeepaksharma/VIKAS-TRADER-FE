import type { OrderStatus } from '../types/product';

const CONFIRMED: OrderStatus[] = ['processing', 'shipped', 'delivered'];

export function isConfirmedOrder(status: OrderStatus): boolean {
  return CONFIRMED.includes(status);
}

export function customerStatusLabel(status: OrderStatus): string {
  if (status === 'cancelled') return 'Cancelled';
  if (CONFIRMED.includes(status)) return 'Confirmed';
  return 'Pending';
}
