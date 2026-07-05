import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import { AdminOrderAccordionItem } from '../../components/admin/AdminOrderAccordionItem';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { Input } from '../../components/ui/input';
import { mapAdminOrder } from '../../lib/catalogMappers';
import { ADMIN_ORDER_FILTER_OPTIONS } from '../../lib/adminOrderStatus';
import { isConfirmedOrder } from '../../lib/orderStatus';

const PAGE_SIZE = 10;

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('status') ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

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

  const searchedOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return displayedOrders;

    return displayedOrders.filter((order) => {
      const buyer = order.buyer;
      const orderId = order.id.slice(0, 8).toUpperCase();
      const buyerName = buyer ? `${buyer.firstName} ${buyer.lastName}`.toLowerCase() : '';
      return (
        orderId.includes(query.toUpperCase()) ||
        order.id.toLowerCase().includes(query) ||
        buyerName.includes(query) ||
        buyer?.email.toLowerCase().includes(query) ||
        buyer?.phone.toLowerCase().includes(query)
      );
    });
  }, [displayedOrders, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(searchedOrders.length / PAGE_SIZE));

  const paginatedOrders = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return searchedOrders.slice(start, start + PAGE_SIZE);
  }, [searchedOrders, page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
      <div className="mb-6 flex flex-col gap-4 sm:mb-8">
        <div className="hidden min-w-0 lg:block">
          <h1 className="vt-page-title">Orders</h1>
          <p className="vt-page-desc">
            {searchQuery.trim()
              ? `${searchedOrders.length} order(s) matching "${searchQuery.trim()}"`
              : `${pendingCount} pending · ${displayedOrders.length} shown · Accept (Confirmed) or mark Delivered / Cancelled`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vt-muted" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="h-11 rounded-2xl pl-10"
              aria-label="Search orders"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-vt-muted">Loading orders...</p>
      ) : searchedOrders.length === 0 ? (
        <p className="rounded-3xl bg-vt-surface p-8 text-center text-vt-muted shadow-vt-card">
          {searchQuery.trim()
            ? `No orders found for "${searchQuery.trim()}".`
            : 'No orders match this filter.'}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {paginatedOrders.map((order, index) => (
              <AdminOrderAccordionItem
                key={order.id}
                order={order}
                defaultOpen={index === 0 && page === 1}
                onStatusChange={(orderId, status) => statusMutation.mutate({ orderId, status })}
              />
            ))}
          </div>
          <AdminPagination
            className="mt-4"
            page={page}
            pageSize={PAGE_SIZE}
            totalItems={searchedOrders.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
