import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import type { Category } from '../../types/product';
import { cn } from '../../lib/utils';

type CategoryCardProps = {
  category: Category;
  variant?: 'grid' | 'compact';
};

export function CategoryCard({ category, variant = 'grid' }: CategoryCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={`/categories/${category.slug}`}
        className={cn(
          'block overflow-hidden rounded-3xl border border-vt-border bg-vt-surface shadow-vt-card transition-shadow hover:shadow-elevated',
          variant === 'compact' ? 'p-3' : 'p-4',
        )}
      >
        <div
          className={cn(
            'mb-3 flex items-center justify-center overflow-hidden rounded-2xl',
            category.bgColor,
            variant === 'compact' ? 'h-20' : 'h-28',
          )}
        >
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <h3 className="font-semibold text-vt-foreground">{category.name}</h3>
        <p className="mt-0.5 text-xs text-vt-muted">{category.itemCount}+ Items</p>
      </Link>
    </motion.div>
  );
}
