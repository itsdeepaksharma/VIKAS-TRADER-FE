import { Bell, Grid3X3, Sparkles, Tag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CategoryCard } from '../components/ecommerce/CategoryCard';
import { HeroBanner } from '../components/ecommerce/HeroBanner';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { SearchBar } from '../components/ecommerce/SearchBar';
import { SectionHeader } from '../components/ecommerce/SectionHeader';
import { quickActions } from '../data/mockCategories';
import { useCategories, useProducts } from '../hooks/useCatalog';
import { useAuthStore } from '../store/authStore';

const quickIcons = {
  grid: Grid3X3,
  sparkles: Sparkles,
  trending: TrendingUp,
  tag: Tag,
};

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: bestSellers = [], isLoading: loadingProducts } = useProducts({
    best_sellers: true,
  });
  const homeCategories = categories.slice(0, 6);

  return (
    <div className="px-4 pb-4 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Good Morning,</p>
          <h1 className="text-xl font-bold text-vt-dark">
            {user?.name?.split(' ')[0] ?? 'Guest'} 👋
          </h1>
        </div>
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-card"
        >
          <Bell className="h-5 w-5 text-vt-dark" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-vt-green" />
        </button>
      </header>

      <SearchBar className="mb-5" />

      <HeroBanner />

      <section className="mt-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = quickIcons[action.icon as keyof typeof quickIcons];
            return (
              <Link
                key={action.id}
                to={action.path}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vt-light-blue">
                  <Icon className="h-6 w-6 text-vt-blue" />
                </div>
                <span className="text-center text-[10px] font-semibold text-vt-dark">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <SectionHeader title="Top Categories" actionTo="/categories" />
        {loadingCategories ? (
          <p className="text-sm text-slate-500">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {homeCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} variant="compact" />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <SectionHeader title="Best Sellers" actionTo="/categories/containers" />
        {loadingProducts ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} layout="horizontal" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
