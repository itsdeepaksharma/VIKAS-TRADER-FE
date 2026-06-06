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
      <div className="vt-page">
        <PageHeader title="Order Details" />
        <p className="vt-page-body py-8 text-center text-vt-muted">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="vt-page">
        <PageHeader title="Order Details" />
        <div className="vt-page-body-narrow py-12 text-center">
          <p className="font-medium text-vt-foreground">Order not found</p>
          <Link to="/orders" className="mt-4 inline-block text-sm font-semibold text-vt-blue">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vt-page">
      <PageHeader title="Order Details" />
      <div className="vt-page-body-narrow space-y-4">
        <div className="rounded-3xl border border-vt-border bg-vt-surface p-4 shadow-vt-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-vt-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-vt-muted">
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
          {order.shippingAddress ? (
            <p className="mt-3 text-sm text-vt-muted">
              <span className="font-medium text-vt-foreground">Delivery: </span>
              {order.shippingAddress}
            </p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-vt-border bg-vt-surface p-4 shadow-vt-card">
          <h2 className="mb-3 font-semibold text-vt-foreground">Items</h2>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={`${item.product.id}-${item.quantity}`} className="flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-medium text-vt-foreground hover:text-vt-blue"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-vt-muted">Qty: {item.quantity}</p>
                  <p className="font-semibold text-vt-blue">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-vt-border pt-3 text-lg font-bold text-vt-foreground">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
