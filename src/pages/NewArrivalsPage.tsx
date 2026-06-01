import { PageHeader } from '../components/ecommerce/PageHeader';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { useProducts } from '../hooks/useCatalog';

export function NewArrivalsPage() {
  const { data: products = [], isLoading } = useProducts({ newest: true });

  return (
    <div className="pb-6">
      <PageHeader title="New Arrivals" />
      <div className="px-4">
        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
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
