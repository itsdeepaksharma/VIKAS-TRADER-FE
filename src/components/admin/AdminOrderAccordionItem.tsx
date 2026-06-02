import { ChevronDown, Mail, MapPin, Phone, User } from 'lucide-react';

import { StatusBadge } from '../ecommerce/StatusBadge';
import { adminStatusLabel, ADMIN_ORDER_STATUS_OPTIONS } from '../../lib/adminOrderStatus';
import { formatCurrency, cn } from '../../lib/utils';
import type { Order } from '../../types/product';

type AdminOrderAccordionItemProps = {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
  defaultOpen?: boolean;
};

export function AdminOrderAccordionItem({
  order,
  onStatusChange,
  defaultOpen = false,
}: AdminOrderAccordionItemProps) {
  const buyer = order.buyer;
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <details
      className="group rounded-2xl border border-vt-border bg-vt-surface shadow-vt-card open:border-vt-blue/20 open:shadow-elevated"
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
            <p className="font-semibold text-vt-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="truncate text-xs text-vt-muted">
              {new Date(order.date).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {buyer && (
            <p className="hidden truncate text-sm text-vt-muted sm:block sm:max-w-[180px]">
              {buyer.firstName} {buyer.lastName}
            </p>
          )}
          <p className="font-bold text-vt-blue">{formatCurrency(order.total)}</p>
          <StatusBadge status={order.status} />
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-vt-muted">
            {itemCount} items
          </span>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-vt-muted transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-vt-border px-4 pb-4 pt-3">
        {buyer && (
          <div className="rounded-2xl bg-vt-surface-muted p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-vt-muted">
              Buyer details
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2 text-sm">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <div>
                  <p className="font-semibold text-vt-foreground">
                    {buyer.firstName} {buyer.lastName}
                  </p>
                  <p className="text-vt-muted">Customer</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <a
                  href={`mailto:${buyer.email}`}
                  className="break-all text-vt-blue hover:underline"
                >
                  {buyer.email}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <a href={`tel:${buyer.phone}`} className="font-medium text-vt-foreground">
                  {buyer.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm sm:col-span-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vt-blue" />
                <div>
                  <p className="text-xs font-medium text-vt-muted">Shipping address</p>
                  <p className="text-vt-foreground">{order.shippingAddress ?? buyer.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-vt-muted">
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
                  <p className="truncate font-medium text-vt-foreground">{item.product.name}</p>
                  <p className="text-vt-muted">
                    Qty {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-vt-foreground">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-vt-border pt-4">
          <div>
            {order.subtotal != null && order.subtotal !== order.total && (
              <p className="text-xs text-vt-muted">Subtotal {formatCurrency(order.subtotal)}</p>
            )}
            <span className="text-lg font-bold text-vt-foreground">{formatCurrency(order.total)}</span>
          </div>
          <select
            className="rounded-xl border border-vt-border bg-vt-surface px-3 py-2 text-sm"
            value={
              ADMIN_ORDER_STATUS_OPTIONS.some((o) => o.value === order.status)
                ? order.status
                : 'processing'
            }
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
          >
            {ADMIN_ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="sr-only">Current: {adminStatusLabel(order.status)}</span>
        </div>
      </div>
    </details>
  );
}
