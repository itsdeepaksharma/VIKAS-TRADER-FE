import { useSearchParams } from 'react-router-dom';

import { PageHeader } from '../components/ecommerce/PageHeader';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { useProducts } from '../hooks/useCatalog';

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const { data: products = [], isLoading } = useProducts({ q: query || undefined });

  return (
    <div className="pb-6">
      <PageHeader title={query ? `Results for "${query}"` : 'Search'} />
      <div className="px-4">
        {isLoading && <p className="text-slate-500">Searching...</p>}
        {!isLoading && products.length === 0 && (
          <p className="py-12 text-center text-slate-500">No products found.</p>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
