import { ChevronDown, Mail, MapPin, Phone, User } from 'lucide-react';

import { StatusBadge } from '../ecommerce/StatusBadge';
import { formatCurrency, cn } from '../../lib/utils';
import type { Order, OrderStatus } from '../../types/product';

type AdminOrderAccordionItemProps = {
  order: Order;
  statusOptions: OrderStatus[];
  onStatusChange: (orderId: string, status: string) => void;
  defaultOpen?: boolean;
};

export function AdminOrderAccordionItem({
  order,
  statusOptions,
  onStatusChange,
  defaultOpen = false,
}: AdminOrderAccordionItemProps) {
  const buyer = order.buyer;
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <details
      className="group rounded-2xl border border-slate-100 bg-white shadow-card open:border-vt-blue/20 open:shadow-elevated"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-3 p-4',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="font-semibold text-vt-dark">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="truncate text-xs text-slate-500">
              {new Date(order.date).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {buyer && (
            <p className="hidden truncate text-sm text-slate-600 sm:block sm:max-w-[180px]">
              {buyer.firstName} {buyer.lastName}
            </p>
          )}
          <p className="font-bold text-vt-blue">{formatCurrency(order.total)}</p>
          <StatusBadge status={order.status} />
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {itemCount} items
          </span>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-slate-100 px-4 pb-4 pt-3">
        {buyer && (
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Buyer details
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-sm">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <div>
                  <p className="font-semibold text-vt-dark">
                    {buyer.firstName} {buyer.lastName}
                  </p>
                  <p className="text-slate-500">Customer</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <a href={`mailto:${buyer.email}`} className="break-all text-vt-blue hover:underline">
                  {buyer.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <a href={`tel:${buyer.phone}`} className="font-medium text-vt-dark">
                  {buyer.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm sm:col-span-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <div>
                  <p className="text-xs font-medium text-slate-500">Shipping address</p>
                  <p className="text-vt-dark">{order.shippingAddress ?? buyer.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Order items
          </p>
          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {order.items.map((item) => (
              <li
                key={`${item.product.id}-${item.quantity}`}
                className="flex items-center gap-3 text-sm"
              >
                <img
                  src={item.product.image}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-vt-dark">{item.product.name}</p>
                  <p className="text-slate-500">
                    Qty {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-vt-dark">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            {order.subtotal != null && order.subtotal !== order.total && (
              <p className="text-xs text-slate-500">Subtotal {formatCurrency(order.subtotal)}</p>
            )}
            <span className="text-lg font-bold text-vt-dark">{formatCurrency(order.total)}</span>
          </div>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={order.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </details>
  );
}
