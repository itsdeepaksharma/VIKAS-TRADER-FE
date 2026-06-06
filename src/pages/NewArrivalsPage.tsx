import { PageHeader } from '../components/ecommerce/PageHeader';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { useProducts } from '../hooks/useCatalog';

export function NewArrivalsPage() {
  const { data: products = [], isLoading } = useProducts({ newest: true });

  return (
    <div className="vt-page">
      <PageHeader title="New Arrivals" />
      <div className="vt-page-body">
        {isLoading ? (
          <p className="text-vt-muted">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
