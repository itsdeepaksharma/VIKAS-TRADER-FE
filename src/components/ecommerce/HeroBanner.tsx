import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

import { useProducts } from '../../hooks/useCatalog';
import { formatCurrency } from '../../lib/utils';

function pickSpotlight<T>(items: T[]): T | undefined {
  if (!items.length) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

export function HeroBanner() {
  const { data: newest = [] } = useProducts({ newest: true });
  const { data: bestSellers = [] } = useProducts({ best_sellers: true });

  const product = useMemo(() => {
    const pool = newest.length ? newest : bestSellers;
    return pickSpotlight(pool) ?? pickSpotlight(newest) ?? pickSpotlight(bestSellers);
  }, [newest, bestSellers]);

  if (!product) {
    return (
      <div className="rounded-4xl bg-vt-gradient p-6 text-white shadow-elevated">
        <p className="text-sm opacity-90">Loading featured product...</p>
      </div>
    );
  }

  const tag = product.isBestSeller ? 'Best seller' : 'New arrival';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-4xl bg-vt-gradient text-white shadow-elevated"
    >
      <div className="flex gap-4 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
        />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide opacity-90">{tag}</span>
          </div>
          <h2 className="line-clamp-2 text-lg font-bold leading-snug">{product.name}</h2>
          <p className="mt-1 text-xl font-bold">{formatCurrency(product.price)}</p>
          <Link
            to={`/products/${product.id}`}
            className="mt-3 inline-flex h-10 items-center justify-center gap-1 rounded-2xl bg-vt-surface px-4 text-sm font-bold text-vt-foreground shadow-lg ring-2 ring-white/50"
          >
            View Product <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
