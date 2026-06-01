import { CategoryCard } from '../components/ecommerce/CategoryCard';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { SearchBar } from '../components/ecommerce/SearchBar';
import { useCategories } from '../hooks/useCatalog';

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div>
      <PageHeader title="Categories" showBack={false} />
      <div className="px-4 pb-4">
        <SearchBar className="mb-5" placeholder="Search categories..." />
        {isLoading ? (
          <p className="py-8 text-center text-slate-500">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
