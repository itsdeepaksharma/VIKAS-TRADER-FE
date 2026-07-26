import { useEffect, useRef } from 'react';

import { useMyOrders } from './useOrders';
import { useNotificationStore } from '../store/notificationStore';
import type { OrderStatus } from '../types/product';

const CONFIRMED: OrderStatus[] = ['processing', 'shipped', 'delivered'];

function statusMessage(status: OrderStatus): string | null {
  if (CONFIRMED.includes(status)) {
    return 'Your order has been confirmed by Vikas Traders.';
  }
  if (status === 'cancelled') {
    return 'Your order was cancelled. Contact us if you need help.';
  }
  return null;
}

export function useOrderNotifications() {
  const { data: orders = [] } = useMyOrders();
  const add = useNotificationStore((s) => s.add);
  const knownStatuses = useRef<Record<string, OrderStatus>>({});
  const initialized = useRef(false);

  useEffect(() => {
    for (const order of orders) {
      const prev = knownStatuses.current[order.id];
      if (prev === undefined) {
        if (initialized.current) {
          add({
            title: 'Order placed',
            message: `We received your order #${order.id.slice(0, 8).toUpperCase()}. We'll notify you when it is confirmed.`,
            linkTo: `/orders/${order.id}`,
          });
        }
      } else if (prev !== order.status) {
        const message = statusMessage(order.status);
        if (message) {
          add({
            title: order.status === 'cancelled' ? 'Order cancelled' : 'Order confirmed',
            message: `${message} Order #${order.id.slice(0, 8).toUpperCase()}.`,
            linkTo: `/orders/${order.id}`,
          });
        }
      }
      knownStatuses.current[order.id] = order.status;
    }
    initialized.current = true;
  }, [orders, add]);
}
