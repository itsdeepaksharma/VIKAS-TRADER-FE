import type { ApiOrder, CreateOrderPayload } from '../api/orders';
import type { ApiAdminOrder } from '../api/admin';
import type { UpdateProfilePayload } from '../api/users';
import type { User } from '../types/auth';
import { demoDelay } from './constants';
import { throwDemoError } from './errors';
import { getDemoStore, getDemoUserIdFromSession, nextDemoId, updateDemoStore } from './store';

function toApiOrder(order: ApiAdminOrder): ApiOrder {
  return {
    id: order.id,
    status: order.status,
    payment_method: order.payment_method,
    subtotal: order.subtotal,
    total: order.total,
    shipping_address: order.shipping_address,
    created_at: order.created_at,
    items: order.items,
  };
}

export async function demoFetchMyOrders(): Promise<ApiOrder[]> {
  await demoDelay();
  const userId = getDemoUserIdFromSession();
  if (!userId) return [];

  return getDemoStore()
    .orders.filter((o) => o.user_id === userId)
    .map(toApiOrder);
}

export async function demoCreateOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  await demoDelay();
  const userId = getDemoUserIdFromSession();
  if (!userId) throwDemoError(401, 'Not authenticated.');

  const store = getDemoStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) throwDemoError(401, 'Not authenticated.');

  const items = payload.items.map((item) => {
    const product = store.products.find((p) => p.id === item.product_id);
    if (!product || !product.is_active) {
      throwDemoError(404, `Product not found: ${item.product_id}`);
    }
    if (product.stock_quantity < item.quantity) {
      throwDemoError(400, `Insufficient stock for ${product.name}.`);
    }
    return { product, quantity: item.quantity };
  });

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + Number(product.price) * quantity,
    0,
  );
  const orderId = nextDemoId('VT-2026');

  const orderItems = items.map(({ product, quantity }, index) => ({
    id: `${orderId}-item-${index}`,
    product_id: product.id,
    product_name: product.name,
    product_image: product.image,
    quantity,
    unit_price: product.price,
  }));

  const adminOrder: ApiAdminOrder = {
    id: orderId,
    user_id: user.id,
    status: 'pending',
    payment_method: 'direct',
    subtotal,
    total: subtotal,
    shipping_address: user.address,
    created_at: new Date().toISOString(),
    buyer: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
    },
    items: orderItems,
  };

  updateDemoStore((state) => ({
    ...state,
    orders: [adminOrder, ...state.orders],
    products: state.products.map((p) => {
      const line = items.find((i) => i.product.id === p.id);
      if (!line) return p;
      const stock = p.stock_quantity - line.quantity;
      return {
        ...p,
        stock_quantity: stock,
        in_stock: stock > 0,
      };
    }),
  }));

  return toApiOrder(adminOrder);
}

export async function demoUpdateProfile(payload: UpdateProfilePayload): Promise<User> {
  await demoDelay();
  const userId = getDemoUserIdFromSession();
  if (!userId) throwDemoError(401, 'Not authenticated.');

  let updatedUser: User | null = null;

  updateDemoStore((state) => {
    const users = state.users.map((u) => {
      if (u.id !== userId) return u;
      updatedUser = {
        ...u,
        first_name: payload.first_name ?? u.first_name,
        last_name: payload.last_name ?? u.last_name,
        phone: payload.phone ?? u.phone,
        address: payload.address ?? u.address,
      };
      return updatedUser;
    });

    const adminUsers = state.adminUsers.map((u) =>
      u.id === userId && updatedUser
        ? { ...updatedUser, created_at: u.created_at }
        : u,
    );

    return { ...state, users, adminUsers };
  });

  if (!updatedUser) throwDemoError(404, 'User not found.');
  return updatedUser;
}

export async function demoGetCurrentUser(): Promise<User> {
  await demoDelay();
  const userId = getDemoUserIdFromSession();
  const user = getDemoStore().users.find((u) => u.id === userId);
  if (!user) throwDemoError(401, 'Not authenticated.');
  return user;
}
