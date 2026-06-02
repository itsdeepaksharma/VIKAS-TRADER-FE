import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import { AdminOrderAccordionItem } from '../../components/admin/AdminOrderAccordionItem';
import { mapAdminOrder } from '../../lib/catalogMappers';
import { ADMIN_ORDER_FILTER_OPTIONS } from '../../lib/adminOrderStatus';
import { isConfirmedOrder } from '../../lib/orderStatus';
export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('status') ?? '');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await getAdminOrders()).map(mapAdminOrder),
  });

  const displayedOrders = useMemo(() => {
    if (!filter) return orders;
    if (filter === 'confirmed') {
      return orders.filter((o) => isConfirmedOrder(o.status));
    }
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  function handleFilterChange(value: string) {
    setFilter(value);
    if (value) {
      setSearchParams({ status: value });
    } else {
      setSearchParams({});
    }
  }

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="vt-page-title">Orders</h1>
          <p className="vt-page-desc">
            {pendingCount} pending · {displayedOrders.length} shown · Accept (Confirmed) or mark
            Delivered / Cancelled
          </p>
        </div>
        <select
          className="w-full rounded-xl border border-vt-border bg-vt-surface px-3 py-2 text-sm sm:w-auto"
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          {ADMIN_ORDER_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-vt-muted">Loading orders...</p>
      ) : displayedOrders.length === 0 ? (
        <p className="rounded-3xl bg-vt-surface p-8 text-center text-vt-muted shadow-vt-card">
          No orders match this filter.
        </p>
      ) : (
        <div className="space-y-2">
          {displayedOrders.map((order, index) => (
            <AdminOrderAccordionItem
              key={order.id}
              order={order}
              defaultOpen={index === 0}
              onStatusChange={(orderId, status) => statusMutation.mutate({ orderId, status })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
