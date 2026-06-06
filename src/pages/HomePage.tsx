import { Grid3X3, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CategoryCard } from '../components/ecommerce/CategoryCard';
import { HeroBanner } from '../components/ecommerce/HeroBanner';
import { NotificationBellMenu } from '../components/ecommerce/NotificationBellMenu';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { SearchBar } from '../components/ecommerce/SearchBar';
import { SectionHeader } from '../components/ecommerce/SectionHeader';
import { VTLogo } from '../components/layout/VTLogo';
import { quickActions } from '../data/mockCategories';
import { useCategories, useProducts } from '../hooks/useCatalog';
import { useAuthStore } from '../store/authStore';

const quickIcons = {
  grid: Grid3X3,
  sparkles: Sparkles,
  trending: TrendingUp,
};

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: bestSellers = [], isLoading: loadingProducts } = useProducts({
    best_sellers: true,
  });
  const homeCategories = categories.slice(0, 6);

  function handleSearch(query: string) {
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="pb-4 pt-4">
      <div className="mb-3 flex items-center gap-3">
        <Link to="/" className="shrink-0" aria-label="Vikas Traders home">
          <VTLogo size="inline" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-vt-muted">Good Morning,</p>
          <h1 className="text-xl font-bold text-vt-foreground">
            {user?.name?.split(' ')[0] ?? 'Guest'} 👋
          </h1>
        </div>
      </div>

      <div className="relative mb-5">
        <div className="absolute right-0 bottom-full z-10 mb-2">
          <NotificationBellMenu />
        </div>
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
      </div>

      <HeroBanner />

      <section className="mt-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {quickActions.map((action) => {
            const Icon = quickIcons[action.icon as keyof typeof quickIcons];
            return (
              <Link
                key={action.id}
                to={action.path}
                className="flex flex-col items-center gap-2 rounded-2xl bg-vt-surface p-3 shadow-vt-card transition-shadow hover:shadow-elevated"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vt-light-blue">
                  <Icon className="h-6 w-6 text-vt-blue" />
                </div>
                <span className="text-center text-[10px] font-semibold text-vt-foreground">
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
          <p className="text-sm text-vt-muted">Loading categories...</p>
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
          <p className="text-sm text-vt-muted">Loading products...</p>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} layout="horizontal" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
