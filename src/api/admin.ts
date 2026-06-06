import type { ApiCategory, ApiProduct } from './catalog';
import type { ApiOrderItem } from './orders';
export type ApiOrderBuyer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
};

export type ApiAdminOrder = {
  id: string;
  user_id: string;
  status: string;
  payment_method: string;
  subtotal: string | number;
  total: string | number;
  shipping_address: string;
  created_at: string;
  buyer: ApiOrderBuyer;
  items: ApiOrderItem[];
};
import type { AdminDashboardStats, AdminUserListItem } from '../types/auth';
import { env } from '../utils/env';
import * as demo from '../demo/admin';
import { apiClient } from './client';

export type CategoryPayload = {
  slug?: string;
  name: string;
  image?: string;
  bg_color?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type ProductPayload = {
  category_id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number | null;
  rating?: number;
  review_count?: number;
  image: string;
  stock_quantity?: number;
  features?: string[];
  colors?: { id: string; name: string; hex: string }[];
  sizes?: string[];
  is_best_seller?: boolean;
  is_active?: boolean;
};

export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  if (env.isDemoMode) return demo.demoGetAdminDashboard();
  const { data } = await apiClient.get<AdminDashboardStats>('/admin/dashboard');
  return data;
}

export async function getAdminUsers(): Promise<AdminUserListItem[]> {
  if (env.isDemoMode) return demo.demoGetAdminUsers();
  const { data } = await apiClient.get<AdminUserListItem[]>('/admin/users');
  return data;
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean,
): Promise<AdminUserListItem> {
  if (env.isDemoMode) return demo.demoUpdateUserStatus(userId, isActive);
  const { data } = await apiClient.patch<AdminUserListItem>(`/admin/users/${userId}/status`, {
    is_active: isActive,
  });
  return data;
}

export async function getAdminCategories(): Promise<ApiCategory[]> {
  if (env.isDemoMode) return demo.demoGetAdminCategories();
  const { data } = await apiClient.get<ApiCategory[]>('/admin/categories');
  return data;
}

export async function createCategory(payload: CategoryPayload): Promise<ApiCategory> {
  if (env.isDemoMode) return demo.demoCreateCategory(payload);
  const { data } = await apiClient.post<ApiCategory>('/admin/categories', payload);
  return data;
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>,
): Promise<ApiCategory> {
  if (env.isDemoMode) return demo.demoUpdateCategory(id, payload);
  const { data } = await apiClient.patch<ApiCategory>(`/admin/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (env.isDemoMode) return demo.demoDeleteCategory(id);
  await apiClient.delete(`/admin/categories/${id}`);
}

export async function getAdminProducts(): Promise<ApiProduct[]> {
  if (env.isDemoMode) return demo.demoGetAdminProducts();
  const { data } = await apiClient.get<ApiProduct[]>('/admin/products');
  return data;
}

export async function createProduct(payload: ProductPayload): Promise<ApiProduct> {
  if (env.isDemoMode) return demo.demoCreateProduct(payload);
  const { data } = await apiClient.post<ApiProduct>('/admin/products', payload);
  return data;
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductPayload>,
): Promise<ApiProduct> {
  if (env.isDemoMode) return demo.demoUpdateProduct(id, payload);
  const { data } = await apiClient.patch<ApiProduct>(`/admin/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  if (env.isDemoMode) return demo.demoDeleteProduct(id);
  await apiClient.delete(`/admin/products/${id}`);
}

export async function getAdminOrders(status?: string): Promise<ApiAdminOrder[]> {
  if (env.isDemoMode) return demo.demoGetAdminOrders(status);
  const { data } = await apiClient.get<ApiAdminOrder[]>('/admin/orders', {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ApiAdminOrder> {
  if (env.isDemoMode) return demo.demoUpdateOrderStatus(orderId, status);
  const { data } = await apiClient.patch<ApiAdminOrder>(`/admin/orders/${orderId}/status`, {
    status,
  });
  return data;
}
