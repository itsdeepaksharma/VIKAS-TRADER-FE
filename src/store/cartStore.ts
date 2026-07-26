import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  consolidateCartItems,
  findCartItemForProduct,
  normalizeProductOptions,
  type CartVariantOptions,
} from '../lib/cartVariants';
import type { CartItem, Product } from '../types/product';

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, options?: CartVariantOptions) => void;
  removeItem: (productId: string, options?: CartVariantOptions) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    options?: CartVariantOptions,
  ) => void;
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
          const normalized = normalizeProductOptions(product, options);
          const existing = findCartItemForProduct(state.items, product, normalized);

          if (existing) {
            const nextQty = Math.min(existing.quantity + cappedQty, maxQty);
            return {
              items: consolidateCartItems(
                state.items.map((i) =>
                  i === existing
                    ? {
                        ...i,
                        product,
                        quantity: nextQty,
                        selectedColor: normalized.color,
                        selectedSize: normalized.size,
                      }
                    : i,
                ),
              ),
            };
          }

          return {
            items: consolidateCartItems([
              ...state.items,
              {
                product,
                quantity: cappedQty,
                selectedColor: normalized.color,
                selectedSize: normalized.size,
              },
            ]),
          };
        });
      },
      removeItem: (productId, options) =>
        set((state) => {
          if (!options) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          const product = state.items.find((i) => i.product.id === productId)?.product;
          if (!product) {
            return state;
          }
          const normalized = normalizeProductOptions(product, options);
          const target = findCartItemForProduct(state.items, product, normalized);
          if (!target) {
            return state;
          }
          return {
            items: state.items.filter((i) => i !== target),
          };
        }),
      updateQuantity: (productId, quantity, options) =>
        set((state) => {
          const product = state.items.find((i) => i.product.id === productId)?.product;
          if (!product) return state;

          const normalized = normalizeProductOptions(product, options);
          const target = findCartItemForProduct(state.items, product, normalized);
          if (!target) return state;

          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i !== target),
            };
          }

          return {
            items: consolidateCartItems(
              state.items.map((i) => {
                if (i !== target) return i;
                const maxQty = i.product.stockQuantity ?? quantity;
                return {
                  ...i,
                  quantity: Math.min(quantity, maxQty),
                  selectedColor: normalized.color,
                  selectedSize: normalized.size,
                };
              }),
            ),
          };
        }),
      replaceItems: (items) => set({ items: consolidateCartItems(items) }),
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'vt-cart',
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<CartState> | undefined;
        const items = consolidateCartItems(persistedState?.items ?? current.items);
        return {
          ...current,
          ...persistedState,
          items,
        };
      },
    },
  ),
);
