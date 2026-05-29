import { useQuery } from '@tanstack/react-query';

import {
  fetchCategories,
  fetchProduct,
  fetchProducts,
  type ApiCategory,
  type ApiProduct,
} from '../api/catalog';
import { mapCategory, mapProduct } from '../lib/catalogMappers';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await fetchCategories()).map(mapCategory),
  });
}

export function useProducts(params?: { category_slug?: string; best_sellers?: boolean }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => (await fetchProducts(params)).map(mapProduct),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => mapProduct(await fetchProduct(id!)),
    enabled: Boolean(id),
  });
}

export type { ApiCategory, ApiProduct };
