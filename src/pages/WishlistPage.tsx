import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { formatCurrency } from '../lib/utils';

export function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="Wishlist" showBack={false} />
        <div className="flex flex-col items-center px-4 py-20">
          <Heart className="h-16 w-16 text-slate-200" />
          <p className="mt-4 font-semibold text-vt-dark">No saved items yet</p>
          <p className="text-sm text-slate-500">Tap the heart on products you love</p>
          <Link to="/categories" className="mt-6">
            <GradientButton>Explore Products</GradientButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Wishlist" showBack={false} />
      <div className="space-y-3 px-4 pb-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-3xl border border-slate-100 bg-white p-3 shadow-card"
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-vt-dark">{product.name}</h3>
              </Link>
              <p className="mt-1 font-bold text-vt-blue">{formatCurrency(product.price)}</p>
              <div className="mt-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addItem(product)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-vt-gradient py-2 text-sm font-semibold text-white"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => toggle(product)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"
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
