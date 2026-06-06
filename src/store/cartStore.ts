import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem, Product } from '../types/product';

type CartState = {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    options?: { color?: string; size?: string },
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  replaceItems: (items: CartItem[]) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, options) => {
        if (!product.inStock || (product.stockQuantity ?? 0) <= 0) {
          return;
        }
        set((state) => {
          const maxQty = product.stockQuantity ?? quantity;
          const cappedQty = Math.min(Math.max(1, quantity), maxQty);
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            const nextQty = Math.min(existing.quantity + cappedQty, maxQty);
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: nextQty } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity: cappedQty,
                selectedColor: options?.color,
                selectedSize: options?.size,
              },
            ],
          };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.product.id !== productId) };
          }
          return {
            items: state.items.map((i) => {
              if (i.product.id !== productId) return i;
              const maxQty = i.product.stockQuantity ?? quantity;
              return { ...i, quantity: Math.min(quantity, maxQty) };
            }),
          };
        }),
      replaceItems: (items) => set({ items }),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'vt-cart' },
  ),
);
