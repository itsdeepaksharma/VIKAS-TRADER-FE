import type { ApiCategory, ApiProduct } from '../api/catalog';
import type { ApiAdminOrder } from '../api/admin';
import type { ApiOrder, ApiOrderItem } from '../api/orders';
import type { Category, Order, OrderStatus, Product } from '../types/product';

function num(value: string | number): number {
  return typeof value === 'number' ? value : parseFloat(value);
}

export function mapCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    itemCount: c.item_count,
    image: c.image,
    bgColor: c.bg_color,
  };
}

export function mapProduct(p: ApiProduct): Product {
  const images = p.images?.length ? p.images : p.image ? [p.image] : [];
  return {
    id: p.id,
    name: p.name,
    price: num(p.price),
    originalPrice: p.original_price != null ? num(p.original_price) : undefined,
    rating: num(p.rating),
    reviewCount: p.review_count,
    image: p.image || images[0] || '',
    images,
    categoryId: p.category_id,
    categorySlug: p.category_slug,
    inStock: p.in_stock,
    stockQuantity: p.stock_quantity,
    features: p.features,
    colors: p.colors,
    sizes: p.sizes,
    description: p.description,
    isBestSeller: p.is_best_seller,
  };
}

function mapOrderItem(item: ApiOrderItem): Order['items'][0] {
  return {
    product: {
      id: item.product_id ?? item.id,
      name: item.product_name,
      price: num(item.unit_price),
      originalPrice: undefined,
      rating: 0,
      reviewCount: 0,
      image: item.product_image,
      categoryId: '',
      categorySlug: '',
      inStock: true,
      features: [],
      colors: [],
      sizes: [],
      description: item.product_name,
    },
    quantity: item.quantity,
  };
}

export function mapOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    date: o.created_at,
    status: o.status as OrderStatus,
    paymentMethod: o.payment_method,
    shippingAddress: o.shipping_address,
    subtotal: num(o.subtotal),
    items: o.items.map(mapOrderItem),
    total: num(o.total),
  };
}

export function mapAdminOrder(o: ApiAdminOrder): Order {
  return {
    ...mapOrder(o),
    buyer: {
      id: o.buyer.id,
      email: o.buyer.email,
      firstName: o.buyer.first_name,
      lastName: o.buyer.last_name,
      phone: o.buyer.phone,
      address: o.buyer.address,
    },
  };
}
