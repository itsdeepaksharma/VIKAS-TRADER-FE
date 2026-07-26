import { apiClient } from './client';

export type ApiOrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: string | number;
  selected_color?: string | null;
  selected_size?: string | null;
};

export type ApiOrder = {
  id: string;
  status: string;
  payment_method: string;
  subtotal: string | number;
  total: string | number;
  shipping_address: string;
  created_at: string;
  items: ApiOrderItem[];
};

export type CreateOrderPayload = {
  items: {
    product_id: string;
    quantity: number;
    selected_color?: string | null;
    selected_size?: string | null;
  }[];
};

export async function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  const { data } = await apiClient.post<ApiOrder>('/orders', payload);
  return data;
}

export async function fetchMyOrders(): Promise<ApiOrder[]> {
  const { data } = await apiClient.get<ApiOrder[]>('/orders');
  return data;
}
