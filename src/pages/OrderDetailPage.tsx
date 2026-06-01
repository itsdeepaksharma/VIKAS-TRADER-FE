import { Link, useParams } from 'react-router-dom';

import { CustomerOrderBadge } from '../components/ecommerce/CustomerOrderBadge';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { useMyOrders } from '../hooks/useOrders';
import { formatCurrency } from '../lib/utils';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: orders = [], isLoading } = useMyOrders();
  const order = orders.find((o) => o.id === id);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Order Details" />
        <p className="px-4 py-8 text-center text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <PageHeader title="Order Details" />
        <div className="px-4 py-12 text-center">
          <p className="font-medium text-vt-dark">Order not found</p>
          <Link to="/orders" className="mt-4 inline-block text-sm font-semibold text-vt-blue">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <PageHeader title="Order Details" />
      <div className="space-y-4 px-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-vt-dark">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-slate-500">
                {new Date(order.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <CustomerOrderBadge status={order.status} />
          </div>
          {order.shippingAddress && (
            <p className="mt-3 text-sm text-slate-600">
              <span className="font-medium text-vt-dark">Delivery: </span>
              {order.shippingAddress}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-card">
          <h2 className="mb-3 font-semibold text-vt-dark">Items</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={`${item.product.id}-${item.quantity}`} className="flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-xl object-cover bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-medium text-vt-dark hover:text-vt-blue"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  <p className="font-semibold text-vt-blue">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-3 text-lg font-bold text-vt-dark">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
