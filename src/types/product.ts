export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  categoryId: string;
  categorySlug: string;
  inStock: boolean;
  stockQuantity?: number;
  features: string[];
  colors: { id: string; name: string; hex: string }[];
  sizes: string[];
  description: string;
  isBestSeller?: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  itemCount: number;
  image: string;
  bgColor: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderBuyer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  paymentMethod?: string;
  shippingAddress?: string;
  subtotal?: number;
  items: { product: Product; quantity: number }[];
  total: number;
  buyer?: OrderBuyer;
};
