import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FilterPills } from '../components/ecommerce/FilterPills';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { listingFilters } from '../data/mockProducts';
import { useCategories, useProducts } from '../hooks/useCatalog';

export function ProductListingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const { data: categories = [] } = useCategories();
  const { data: categoryProducts = [], isLoading } = useProducts({
    category_slug: slug,
  });
  const { data: allProducts = [] } = useProducts();

  const category = categories.find((c) => c.slug === slug);
  const baseList = slug ? categoryProducts : allProducts;

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return baseList;
    const map: Record<string, (name: string) => boolean> = {
      Storage: (n) => n.toLowerCase().includes('storage'),
      Lunch: (n) => n.toLowerCase().includes('lunch'),
      'Multi Purpose': (n) => n.toLowerCase().includes('multi'),
      Jars: (n) => n.toLowerCase().includes('jar'),
    };
    const fn = map[activeFilter];
    return fn ? baseList.filter((p) => fn(p.name)) : baseList;
  }, [activeFilter, baseList]);

  return (
    <div>
      <PageHeader
        title={category?.name ?? 'Products'}
        rightAction={
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        }
      />
      <div className="px-4 pb-4">
        <FilterPills filters={listingFilters} active={activeFilter} onChange={setActiveFilter} />
        <p className="my-3 text-sm text-slate-500">{filtered.length} products</p>
        {isLoading ? (
          <p className="py-12 text-center text-slate-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">No products in this category yet.</p>
        )}
      </div>
    </div>
  );
}
