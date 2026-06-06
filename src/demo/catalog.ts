import type { ApiCategory, ApiProduct } from '../api/catalog';
import { throwDemoError } from './errors';
import { demoDelay } from './constants';
import { getDemoStore } from './store';

export async function demoFetchCategories(): Promise<ApiCategory[]> {
  await demoDelay();
  return getDemoStore().categories;
}

export async function demoFetchCategory(slug: string): Promise<ApiCategory> {
  await demoDelay();
  const category = getDemoStore().categories.find((c) => c.slug === slug);
  if (!category) throwDemoError(404, 'Category not found.');
  return category;
}

export async function demoFetchProducts(params?: {
  category_slug?: string;
  best_sellers?: boolean;
  q?: string;
  newest?: boolean;
}): Promise<ApiProduct[]> {
  await demoDelay();
  let list = getDemoStore().products.filter((p) => p.is_active);

  if (params?.category_slug) {
    list = list.filter((p) => p.category_slug === params.category_slug);
  }
  if (params?.best_sellers) {
    list = list.filter((p) => p.is_best_seller);
  }
  if (params?.q) {
    const q = params.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category_slug.toLowerCase().includes(q),
    );
  }
  if (params?.newest) {
    list = [...list].reverse();
  }

  return list;
}

export async function demoFetchProduct(id: string): Promise<ApiProduct> {
  await demoDelay();
  const product = getDemoStore().products.find((p) => p.id === id);
  if (!product) throwDemoError(404, 'Product not found.');
  return product;
}
