import { useSearchParams } from 'react-router-dom';

import { PageHeader } from '../components/ecommerce/PageHeader';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { useProducts } from '../hooks/useCatalog';

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const { data: products = [], isLoading } = useProducts({ q: query || undefined });

  return (
    <div className="vt-page">
      <PageHeader title={query ? `Results for "${query}"` : 'Search'} />
      <div className="vt-page-body">
        {isLoading && <p className="text-vt-muted">Searching...</p>}
        {!isLoading && products.length === 0 && (
          <p className="py-12 text-center text-vt-muted">No products found.</p>
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
