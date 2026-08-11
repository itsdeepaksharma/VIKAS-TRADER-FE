import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { getAdminOrders } from '../api/admin';
import { mapAdminOrder } from '../lib/catalogMappers';
import { useNotificationStore } from '../store/notificationStore';

export function useAdminOrderNotifications() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await getAdminOrders()).map(mapAdminOrder),
    refetchInterval: 30_000,
  });
  const add = useNotificationStore((s) => s.add);
  const knownPendingIds = useRef<Set<string>>(new Set());
  const knownStatuses = useRef<Record<string, string>>({});
  const initialized = useRef(false);

  useEffect(() => {
    for (const order of orders) {
      const prevStatus = knownStatuses.current[order.id];

      if (order.status === 'pending' && !knownPendingIds.current.has(order.id)) {
        if (initialized.current) {
          add({
            title: 'New order received',
            message: `Order #${order.id.slice(0, 8).toUpperCase()} is waiting for confirmation.`,
            linkTo: '/admin/orders',
          });
        }
        knownPendingIds.current.add(order.id);
      }

      if (prevStatus && prevStatus !== order.status && initialized.current) {
        if (order.status === 'cancelled') {
          add({
            title: 'Order cancelled',
            message: `Order #${order.id.slice(0, 8).toUpperCase()} was cancelled.`,
            linkTo: '/admin/orders',
          });
        } else if (prevStatus === 'pending' && order.status === 'processing') {
          add({
            title: 'Order confirmed',
            message: `Order #${order.id.slice(0, 8).toUpperCase()} is ready to process.`,
            linkTo: '/admin/orders',
          });
        }
      }

      knownStatuses.current[order.id] = order.status;
    }
    initialized.current = true;
  }, [orders, add]);
}
