import type { OrderStatus } from '../types/product';
import { OrderCard } from '../components/ecommerce/OrderCard';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useMyOrders } from '../hooks/useOrders';

const tabs: { value: string; label: string; filter?: OrderStatus }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'New', filter: 'pending' },
  { value: 'processing', label: 'Processing', filter: 'processing' },
  { value: 'shipped', label: 'Shipped', filter: 'shipped' },
  { value: 'delivered', label: 'Delivered', filter: 'delivered' },
  { value: 'cancelled', label: 'Cancelled', filter: 'cancelled' },
];

export function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useMyOrders();

  return (
    <div>
      <PageHeader title="My Orders" showBack={false} />
      <div className="px-4 pb-4">
        {isLoading && <p className="py-8 text-center text-slate-500">Loading orders...</p>}
        {isError && (
          <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
            Failed to load orders.
          </p>
        )}
        {!isLoading && !isError && (
          <Tabs defaultValue="all">
            <TabsList className="mb-4 w-full flex-wrap">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => {
              const list = tab.filter
                ? orders.filter((o) => o.status === tab.filter)
                : orders;
              return (
                <TabsContent key={tab.value} value={tab.value} className="space-y-3">
                  {list.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  {list.length === 0 && (
                    <p className="py-8 text-center text-slate-500">No orders in this status.</p>
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
