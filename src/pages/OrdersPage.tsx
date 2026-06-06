import { OrderCard } from '../components/ecommerce/OrderCard';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useMyOrders } from '../hooks/useOrders';
import { isConfirmedOrder } from '../lib/orderStatus';

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useMyOrders();

  function filterOrders(tab: string) {
    if (tab === 'confirmed') return orders.filter((o) => isConfirmedOrder(o.status));
    if (tab === 'cancelled') return orders.filter((o) => o.status === 'cancelled');
    return orders;
  }

  return (
    <div className="vt-page">
      <PageHeader title="My Orders" />
      <div className="vt-page-body-narrow">
        {isLoading && <p className="py-8 text-center text-vt-muted">Loading orders...</p>}
        {isError && (
          <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">Failed to load orders.</p>
        )}
        {!isLoading && !isError && (
          <Tabs defaultValue="all">
            <TabsList className="mb-4 grid h-11 w-full grid-cols-3 gap-1 p-1">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="w-full">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => {
              const list = filterOrders(tab.value);
              return (
                <TabsContent key={tab.value} value={tab.value} className="space-y-3">
                  {list.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {list.length === 0 && (
                    <p className="py-8 text-center text-vt-muted">No orders in this tab.</p>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
}
