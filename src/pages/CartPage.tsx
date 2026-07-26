import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CartStockAlerts } from '../components/ecommerce/CartStockAlerts';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { QuantitySelector } from '../components/ecommerce/QuantitySelector';
import { useCartStockSync } from '../hooks/useCartStockSync';
import { cartItemKey, formatCartVariantLabel } from '../lib/cartVariants';
import { useCartStore } from '../store/cartStore';
import { cn, formatCurrency } from '../lib/utils';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const { issues, syncing, syncCartStock } = useCartStockSync();
  const total = subtotal();
  const hasBlockingStockIssue = items.some(
    (item) => !item.product.inStock || (item.product.stockQuantity ?? 0) < item.quantity,
  );

  useEffect(() => {
    void syncCartStock();
  }, [syncCartStock]);

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="My Cart" />
        <CartStockAlerts issues={issues} syncing={syncing} className="pb-4" />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-semibold text-vt-foreground">Your cart is empty</p>
          <p className="mt-1 text-sm text-vt-muted">Add plasticware essentials to get started</p>
          <Link to="/categories" className="mt-6">
            <GradientButton>Browse Categories</GradientButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-44">
      <PageHeader title="My Cart" />

      <CartStockAlerts issues={issues} syncing={syncing} className="mb-4" />

      <div className="space-y-3">
        {items.map((item) => {
          const outOfStock = !item.product.inStock || (item.product.stockQuantity ?? 0) <= 0;
          const maxQty = Math.max(1, item.product.stockQuantity ?? 99);
          const variantLabel = formatCartVariantLabel(
            item.product,
            item.selectedColor,
            item.selectedSize,
          );
          const lineOptions = {
            color: item.selectedColor,
            size: item.selectedSize,
          };

          return (
            <div
              key={cartItemKey(item)}
              className={cn(
                'flex gap-3 rounded-3xl border bg-vt-surface p-3 shadow-vt-card',
                outOfStock ? 'border-red-200 opacity-80' : 'border-vt-border',
              )}
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-semibold text-vt-foreground">
                      {item.product.name}
                    </h3>
                    {variantLabel && (
                      <p className="mt-1 text-xs font-medium text-vt-muted">{variantLabel}</p>
                    )}
                  </div>
                  {outOfStock && (
                    <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                      Out of stock
                    </span>
                  )}
                </div>
                <p className="mt-1 font-bold text-vt-blue">{formatCurrency(item.product.price)}</p>
                {!outOfStock && item.product.stockQuantity != null && item.product.stockQuantity <= 5 && (
                  <p className="mt-1 text-xs font-medium text-amber-700">
                    Only {item.product.stockQuantity} left
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <QuantitySelector
                    value={item.quantity}
                    max={maxQty}
                    onChange={(q) => updateQuantity(item.product.id, q, lineOptions)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id, lineOptions)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 px-4">
        <div className="mx-auto max-w-lg rounded-3xl border border-vt-border bg-vt-surface p-4 shadow-elevated">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-vt-muted">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal())}</span>
            </div>
            <div className="flex justify-between border-t border-vt-border pt-2 text-lg font-bold text-vt-foreground">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <GradientButton
            fullWidth
            className="mt-4"
            disabled={syncing || hasBlockingStockIssue}
            onClick={() => navigate('/checkout')}
          >
            {syncing ? 'Checking Stock...' : 'Proceed to Checkout'}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
