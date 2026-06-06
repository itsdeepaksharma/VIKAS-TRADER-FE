import { Heart, ShoppingCart, Trash2, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatCurrency } from '../lib/utils';

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="vt-page">
        <PageHeader title="Wishlist" />
        <div className="vt-page-body flex flex-col items-center py-20">
          <Heart className="h-16 w-16 text-slate-200" />
          <p className="mt-4 font-semibold text-vt-foreground">No saved items yet</p>
          <p className="text-sm text-vt-muted">Tap the heart on products you love</p>
          <Link to="/categories" className="mt-6">
            <GradientButton>Explore Products</GradientButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vt-page">
      <PageHeader title="Wishlist" />
      <div className="vt-page-body space-y-3">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-3xl border border-vt-border bg-vt-surface p-3 shadow-vt-card"
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-vt-foreground">{product.name}</h3>
              </Link>
              <p className="mt-1 font-bold text-vt-blue">{formatCurrency(product.price)}</p>
              <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => addItem(product)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-vt-gradient py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() => {
                    addItem(product);
                    navigate('/checkout');
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-vt-blue py-2 text-sm font-semibold text-vt-blue disabled:opacity-50"
                >
                  <Zap className="h-4 w-4" />
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => toggle(product)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
