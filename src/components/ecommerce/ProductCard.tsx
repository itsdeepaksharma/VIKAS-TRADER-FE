import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import type { Product } from '../../types/product';
import { cn, formatCurrency } from '../../lib/utils';

type ProductCardProps = {
  product: Product;
  layout?: 'grid' | 'horizontal';
};

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const wished = has(product.id);
  const outOfStock = !product.inStock;

  if (layout === 'horizontal') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="min-w-[160px] flex-shrink-0 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card"
      >
        <Link to={`/products/${product.id}`}>
          <div className="relative h-36 bg-vt-light-blue">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggle(product);
              }}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm"
            >
              <Heart
                className={cn('h-4 w-4', wished ? 'fill-red-500 text-red-500' : 'text-slate-400')}
              />
            </button>
          </div>
          <div className="p-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-vt-dark">{product.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              <span>{product.rating}</span>
            </div>
            <p className="mt-1 font-bold text-vt-blue">{formatCurrency(product.price)}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition-shadow hover:shadow-elevated"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-vt-light-mint">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(product);
            }}
            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
          >
            <Heart
              className={cn('h-4 w-4', wished ? 'fill-red-500 text-red-500' : 'text-slate-400')}
            />
          </button>
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              Out of Stock
            </span>
          )}
          {!outOfStock && product.originalPrice && (
            <span className="absolute left-2 top-2 rounded-full bg-vt-gradient px-2 py-0.5 text-xs font-bold text-white">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-vt-dark">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="font-bold text-vt-dark">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-1 text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addItem(product)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-colors',
            outOfStock
              ? 'cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-vt-light-blue text-vt-blue hover:bg-vt-gradient hover:text-white',
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
