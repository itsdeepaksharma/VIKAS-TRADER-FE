import type { ApiCategory, ApiProduct } from '../api/catalog';
import type { ApiAdminOrder } from '../api/admin';
import type { CategoryPayload, ProductPayload } from '../api/admin';
import type { AdminDashboardStats, AdminUserListItem } from '../types/auth';
import { slugify } from '../lib/slugify';
import { demoDelay } from './constants';
import { throwDemoError } from './errors';
import { getDemoStore, nextDemoId, updateDemoStore } from './store';

export async function demoGetAdminDashboard(): Promise<AdminDashboardStats> {
  await demoDelay();
  const store = getDemoStore();
  const activeUsers = store.adminUsers.filter((u) => u.is_active).length;
  const outOfStock = store.products.filter((p) => p.stock_quantity === 0).length;
  const lowStock = store.products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity < 5,
  ).length;
  const pendingOrders = store.orders.filter((o) => o.status === 'pending').length;

  return {
    total_users: store.adminUsers.length,
    active_users: activeUsers,
    admin_users: store.adminUsers.filter((u) => u.is_superuser).length,
    inactive_users: store.adminUsers.length - activeUsers,
    total_products: store.products.length,
    out_of_stock_products: outOfStock,
    low_stock_products: lowStock,
    total_orders: store.orders.length,
    new_orders: pendingOrders,
  };
}

export async function demoGetAdminUsers(): Promise<AdminUserListItem[]> {
  await demoDelay();
  return getDemoStore().adminUsers;
}

export async function demoUpdateUserStatus(
  userId: string,
  isActive: boolean,
): Promise<AdminUserListItem> {
  await demoDelay();
  let updated: AdminUserListItem | null = null;

  updateDemoStore((state) => {
    const user = state.adminUsers.find((u) => u.id === userId);
    if (!user) return state;
    if (user.is_superuser && !isActive) {
      throwDemoError(400, 'Cannot deactivate an admin account.');
    }

    updated = { ...user, is_active: isActive };
    return {
      ...state,
      adminUsers: state.adminUsers.map((u) => (u.id === userId ? updated! : u)),
      users: state.users.map((u) => (u.id === userId ? { ...u, is_active: isActive } : u)),
    };
  });

  if (!updated) throwDemoError(404, 'User not found.');
  return updated;
}

export async function demoGetAdminCategories(): Promise<ApiCategory[]> {
  await demoDelay();
  return getDemoStore().categories;
}

export async function demoCreateCategory(payload: CategoryPayload): Promise<ApiCategory> {
  await demoDelay();
  const category: ApiCategory = {
    id: nextDemoId('cat'),
    slug: payload.slug?.trim() || slugify(payload.name),
    name: payload.name.trim(),
    image:
      payload.image?.trim() ||
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    bg_color: payload.bg_color?.trim() || 'bg-vt-light-blue',
    item_count: 0,
  };

  updateDemoStore((state) => ({
    ...state,
    categories: [...state.categories, category],
  }));

  return category;
}

export async function demoUpdateCategory(
  id: string,
  payload: Partial<CategoryPayload>,
): Promise<ApiCategory> {
  await demoDelay();
  let updated: ApiCategory | null = null;

  updateDemoStore((state) => ({
    ...state,
    categories: state.categories.map((c) => {
      if (c.id !== id) return c;
      updated = {
        ...c,
        name: payload.name?.trim() ?? c.name,
        slug: payload.slug?.trim() ?? c.slug,
        image: payload.image?.trim() ?? c.image,
        bg_color: payload.bg_color?.trim() ?? c.bg_color,
      };
      return updated;
    }),
  }));

  if (!updated) throwDemoError(404, 'Category not found.');
  return updated;
}

export async function demoDeleteCategory(id: string): Promise<void> {
  await demoDelay();
  const hasProducts = getDemoStore().products.some((p) => p.category_id === id);
  if (hasProducts) {
    throwDemoError(400, 'Remove products from this category before deleting.');
  }

  updateDemoStore((state) => ({
    ...state,
    categories: state.categories.filter((c) => c.id !== id),
  }));
}

export async function demoGetAdminProducts(): Promise<ApiProduct[]> {
  await demoDelay();
  return getDemoStore().products;
}

export async function demoCreateProduct(payload: ProductPayload): Promise<ApiProduct> {
  await demoDelay();
  const store = getDemoStore();
  const category = store.categories.find((c) => c.id === payload.category_id);
  if (!category) throwDemoError(404, 'Category not found.');

  const stock = payload.stock_quantity ?? 10;
  const product: ApiProduct = {
    id: nextDemoId('p'),
    name: payload.name.trim(),
    description: payload.description?.trim() ?? '',
    price: payload.price,
    original_price: payload.original_price ?? null,
    rating: payload.rating ?? 4.5,
    review_count: payload.review_count ?? 0,
    image: payload.image,
    stock_quantity: stock,
    in_stock: stock > 0,
    features: payload.features ?? [],
    colors: payload.colors ?? [],
    sizes: payload.sizes ?? [],
    is_best_seller: payload.is_best_seller ?? false,
    category_id: category.id,
    category_slug: category.slug,
    is_active: payload.is_active ?? true,
  };

  updateDemoStore((state) => ({
    ...state,
    products: [...state.products, product],
  }));

  return product;
}

export async function demoUpdateProduct(
  id: string,
  payload: Partial<ProductPayload>,
): Promise<ApiProduct> {
  await demoDelay();
  let updated: ApiProduct | null = null;

  updateDemoStore((state) => ({
    ...state,
    products: state.products.map((p) => {
      if (p.id !== id) return p;
      const stock = payload.stock_quantity ?? p.stock_quantity;
      updated = {
        ...p,
        name: payload.name?.trim() ?? p.name,
        description: payload.description?.trim() ?? p.description,
        price: payload.price ?? p.price,
        original_price: payload.original_price ?? p.original_price,
        image: payload.image ?? p.image,
        stock_quantity: stock,
        in_stock: stock > 0,
        features: payload.features ?? p.features,
        colors: payload.colors ?? p.colors,
        sizes: payload.sizes ?? p.sizes,
        is_best_seller: payload.is_best_seller ?? p.is_best_seller,
        is_active: payload.is_active ?? p.is_active,
        category_id: payload.category_id ?? p.category_id,
      };
      if (payload.category_id) {
        const cat = state.categories.find((c) => c.id === payload.category_id);
        if (cat) {
          updated.category_slug = cat.slug;
        }
      }
      return updated;
    }),
  }));

  if (!updated) throwDemoError(404, 'Product not found.');
  return updated;
}

export async function demoDeleteProduct(id: string): Promise<void> {
  await demoDelay();
  updateDemoStore((state) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
  }));
}

export async function demoGetAdminOrders(status?: string): Promise<ApiAdminOrder[]> {
  await demoDelay();
  const orders = getDemoStore().orders;
  if (!status) return orders;
  return orders.filter((o) => o.status === status);
}

export async function demoUpdateOrderStatus(
  orderId: string,
  status: string,
): Promise<ApiAdminOrder> {
  await demoDelay();
  let updated: ApiAdminOrder | null = null;

  updateDemoStore((state) => ({
    ...state,
    orders: state.orders.map((o) => {
      if (o.id !== orderId) return o;
      updated = { ...o, status };
      return updated;
    }),
  }));

  if (!updated) throwDemoError(404, 'Order not found.');
  return updated;
}
