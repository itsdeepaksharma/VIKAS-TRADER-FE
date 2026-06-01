import { apiClient } from './client';

export type ApiProductColor = { id: string; name: string; hex: string };

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  image: string;
  bg_color: string;
  item_count: number;
};

export type ApiProduct = {
  id: string;
  name: string;
  description: string;
  price: string | number;
  original_price: string | number | null;
  rating: string | number;
  review_count: number;
  image: string;
  stock_quantity: number;
  in_stock: boolean;
  features: string[];
  colors: ApiProductColor[];
  sizes: string[];
  is_best_seller: boolean;
  category_id: string;
  category_slug: string;
  is_active: boolean;
};

export async function fetchCategories(): Promise<ApiCategory[]> {
  const { data } = await apiClient.get<ApiCategory[]>('/catalog/categories');
  return data;
}

export async function fetchCategory(slug: string): Promise<ApiCategory> {
  const { data } = await apiClient.get<ApiCategory>(`/catalog/categories/${slug}`);
  return data;
}

export async function fetchProducts(params?: {
  category_slug?: string;
  best_sellers?: boolean;
  q?: string;
  newest?: boolean;
}): Promise<ApiProduct[]> {
  const { data } = await apiClient.get<ApiProduct[]>('/catalog/products', { params });
  return data;
}

export async function fetchProduct(id: string): Promise<ApiProduct> {
  const { data } = await apiClient.get<ApiProduct>(`/catalog/products/${id}`);
  return data;
}
