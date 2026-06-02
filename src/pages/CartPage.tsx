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
  const shipping = subtotal() > 999 ? 0 : 49;
  const total = subtotal() + shipping;

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="My Cart" />
        <div className="flex flex-col items-center justify-center px-4 py-20">
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

      <div className="space-y-3 px-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-3 rounded-3xl border border-vt-border bg-vt-surface p-3 shadow-vt-card"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-24 w-24 rounded-2xl object-cover"
            />
            <div className="flex flex-1 flex-col">
              <h3 className="line-clamp-2 font-semibold text-vt-foreground">{item.product.name}</h3>
              <p className="mt-1 font-bold text-vt-blue">{formatCurrency(item.product.price)}</p>
              <div className="mt-auto flex items-center justify-between">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(q) => updateQuantity(item.product.id, q)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 px-4">
        <div className="mx-auto max-w-lg rounded-3xl border border-vt-border bg-vt-surface p-4 shadow-elevated">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-vt-muted">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal())}</span>
            </div>
            <div className="flex justify-between text-vt-muted">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-vt-border pt-2 text-lg font-bold text-vt-foreground">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <GradientButton fullWidth className="mt-4" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
