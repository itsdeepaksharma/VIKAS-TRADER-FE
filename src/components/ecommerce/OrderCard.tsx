import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Order } from '../../types/product';
import { formatCurrency } from '../../lib/utils';
import { StatusBadge } from './StatusBadge';

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-vt-dark">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(order.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-3 flex gap-2">
        {order.items.slice(0, 3).map((item) => (
          <img
            key={item.product.id}
            src={item.product.image}
            alt=""
            className="h-12 w-12 rounded-xl object-cover ring-2 ring-white"
          />
        ))}
        {order.items.length > 3 && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xs font-medium text-slate-600">
            +{order.items.length - 3}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="font-bold text-vt-dark">{formatCurrency(order.total)}</span>
        <Link
          to={`/orders`}
          className="flex items-center gap-1 text-sm font-semibold text-vt-blue"
        >
          View Details <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
