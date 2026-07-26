import { MapPin, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent } from '../ui/card';
import { cartItemKey, formatCartVariantLabel } from '../../lib/cartVariants';
import { formatCurrency } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import type { CartItem } from '../../types/product';

type CheckoutCardProps = {
  items: CartItem[];
  subtotal: number;
};

export function CheckoutCard({ items, subtotal }: CheckoutCardProps) {
  const total = subtotal;
  const user = useAuthStore((s) => s.user);
  const hasAddress = Boolean(user?.name?.trim() || user?.address?.trim());

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-vt-foreground">Shipping Address</h3>
            <Link to="/profile/address" className="text-sm font-medium text-vt-blue">
              {hasAddress ? 'Change' : 'Add'}
            </Link>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-light-blue">
              <MapPin className="h-5 w-5 text-vt-blue" />
            </div>
            <div className="min-w-0 flex-1">
              {hasAddress ? (
                <>
                  <p className="font-medium text-vt-foreground">{user?.name}</p>
                  {user?.address ? (
                    <p className="whitespace-pre-line text-sm text-vt-muted">{user.address}</p>
                  ) : null}
                  {user?.mobile ? (
                    <p className="mt-1 text-sm text-vt-muted">{user.mobile}</p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-vt-muted">
                  No shipping address on file.{' '}
                  <Link to="/profile/address" className="font-medium text-vt-blue hover:underline">
                    Add your address
                  </Link>{' '}
                  before placing an order.
                </p>
              )}
            </div>
            {hasAddress ? <Pencil className="ml-auto h-4 w-4 shrink-0 text-vt-muted" /> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-vt-foreground">Order Summary</h3>
            <Link to="/cart" className="text-sm font-medium text-vt-blue">
              Edit cart
            </Link>
          </div>

          <ul className="mb-4 space-y-3">
            {items.map((item) => {
              const variantLabel = formatCartVariantLabel(
                item.product,
                item.selectedColor,
                item.selectedSize,
              );
              const lineTotal = item.product.price * item.quantity;

              return (
                <li key={cartItemKey(item)} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover bg-vt-surface-muted"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-vt-foreground">
                      {item.product.name}
                    </p>
                    {variantLabel && (
                      <p className="mt-0.5 text-xs font-medium text-vt-blue">{variantLabel}</p>
                    )}
                    <p className="mt-0.5 text-xs text-vt-muted">
                      Qty {item.quantity} × {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-vt-foreground">
                    {formatCurrency(lineTotal)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="space-y-2 border-t border-vt-border pt-3 text-sm">
            <div className="flex justify-between text-vt-muted">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-vt-foreground">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
