import { Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { QuantitySelector } from '../components/ecommerce/QuantitySelector';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="vt-page">
        <PageHeader title="My Cart" />
        <div className="vt-page-body flex flex-col items-center justify-center py-20">
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
    <div className="vt-page pb-44">
      <PageHeader title="My Cart" />

      <div className="vt-page-body space-y-3">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-3 rounded-3xl border border-vt-border bg-vt-surface p-3 shadow-vt-card"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-24 w-24 shrink-0 rounded-2xl object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="line-clamp-2 font-semibold text-vt-foreground">{item.product.name}</h3>
              <p className="mt-1 font-bold text-vt-blue">{formatCurrency(item.product.price)}</p>
              <div className="mt-auto flex items-center justify-between gap-2">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.product.id, q)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-400 hover:text-red-600"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-vt-border bg-vt-surface/95 backdrop-blur-md">
        <div className="vt-container py-4">
          <div className="rounded-3xl border border-vt-border bg-vt-surface p-4 shadow-elevated">
            <div className="flex justify-between text-lg font-bold text-vt-foreground">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <GradientButton fullWidth className="mt-4" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
}
