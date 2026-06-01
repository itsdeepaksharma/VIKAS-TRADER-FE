import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import { AdminOrderAccordionItem } from '../../components/admin/AdminOrderAccordionItem';
import { mapAdminOrder } from '../../lib/catalogMappers';
import type { OrderStatus } from '../../types/product';

const statusOptions: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewNew = searchParams.get('view') === 'new';
  const statusParam = searchParams.get('status') ?? '';
  const [filter, setFilter] = useState(viewNew ? '' : statusParam);

  useEffect(() => {
    if (viewNew) {
      setFilter('');
      return;
    }
    setFilter(statusParam);
  }, [viewNew, statusParam]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders', filter, viewNew],
    queryFn: async () => (await getAdminOrders(filter || undefined)).map(mapAdminOrder),
  });

  const displayedOrders = useMemo(() => {
    if (!viewNew) return orders;
    return orders.filter((o) => o.status === 'pending' || o.status === 'processing');
  }, [orders, viewNew]);

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

  const newOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vt-dark">{viewNew ? 'New Orders' : 'Orders'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {viewNew
              ? `${displayedOrders.length} pending or processing`
              : `${newOrders.length} active · ${displayedOrders.length} shown`}
            {' · '}
            <span className="text-slate-400">Click a row to expand details</span>
          </p>
        </div>
        <select
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          value={viewNew ? 'new' : filter}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'new') {
              setSearchParams({ view: 'new' });
            } else {
              handleFilterChange(v);
            }
          }}
        >
          <option value="new">New orders (pending + processing)</option>
          <option value="">All orders</option>
          <option value="pending">Pending only</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading orders...</p>
      ) : displayedOrders.length === 0 ? (
        <p className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-card">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-2">
          {displayedOrders.map((order, index) => (
            <AdminOrderAccordionItem
              key={order.id}
              order={order}
              statusOptions={statusOptions}
              defaultOpen={index === 0}
              onStatusChange={(orderId, status) => statusMutation.mutate({ orderId, status })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
