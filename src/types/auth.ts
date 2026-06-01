export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  is_active: boolean;
  is_superuser: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

export type AdminDashboardStats = {
  total_users: number;
  active_users: number;
  admin_users: number;
  inactive_users: number;
  total_products: number;
  out_of_stock_products: number;
  low_stock_products: number;
  total_orders: number;
  new_orders: number;
};

export type AdminUserListItem = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
};
