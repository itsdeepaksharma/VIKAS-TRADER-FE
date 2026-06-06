import type { ApiCategory, ApiProduct } from '../api/catalog';
import type { ApiAdminOrder } from '../api/admin';
import type { User, AdminUserListItem } from '../types/auth';
import { categories } from '../data/mockCategories';
import { products } from '../data/mockProducts';
import { orders as mockOrders } from '../data/mockOrders';
import { demoAdminUser, demoBuyerUser } from './constants';

function toApiCategory(c: (typeof categories)[0]): ApiCategory {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    image: c.image,
    bg_color: c.bgColor,
    item_count: c.itemCount,
  };
}

function toApiProduct(p: (typeof products)[0]): ApiProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    price: p.price,
    original_price: p.originalPrice ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    image: p.image,
    stock_quantity: p.inStock ? 48 : 0,
    in_stock: p.inStock,
    features: p.features,
    colors: p.colors,
    sizes: p.sizes,
    is_best_seller: Boolean(p.isBestSeller),
    category_id: p.categoryId,
    category_slug: p.categorySlug,
    is_active: true,
  };
}

function toAdminUser(u: User): AdminUserListItem {
  return {
    ...u,
    created_at: '2026-01-15T10:00:00.000Z',
  };
}

function seedOrders(): ApiAdminOrder[] {
  return mockOrders.map((order, index) => ({
    id: order.id,
    user_id: demoBuyerUser.id,
    status: order.status === 'shipped' ? 'processing' : order.status,
    payment_method: 'direct',
    subtotal: order.total,
    total: order.total,
    shipping_address: demoBuyerUser.address,
    created_at: `${order.date}T${10 + index}:30:00.000Z`,
    buyer: {
      id: demoBuyerUser.id,
      email: demoBuyerUser.email,
      first_name: demoBuyerUser.first_name,
      last_name: demoBuyerUser.last_name,
      phone: demoBuyerUser.phone,
      address: demoBuyerUser.address,
    },
    items: order.items.map((item, itemIndex) => ({
      id: `${order.id}-item-${itemIndex}`,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      quantity: item.quantity,
      unit_price: item.product.price,
    })),
  }));
}

export type DemoStoreState = {
  users: User[];
  adminUsers: AdminUserListItem[];
  categories: ApiCategory[];
  products: ApiProduct[];
  orders: ApiAdminOrder[];
  passwords: Record<string, string>;
};

export function createInitialDemoStore(): DemoStoreState {
  return {
    users: [demoBuyerUser, demoAdminUser],
    adminUsers: [toAdminUser(demoBuyerUser), toAdminUser(demoAdminUser)],
    categories: categories.map(toApiCategory),
    products: products.map(toApiProduct),
    orders: seedOrders(),
    passwords: {
      [demoBuyerUser.email.toLowerCase()]: 'DemoBuyer@2026',
      [demoAdminUser.email.toLowerCase()]: 'VikasAdmin@2026',
    },
  };
}
