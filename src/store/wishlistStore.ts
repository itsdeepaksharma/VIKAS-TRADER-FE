import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Product } from '../types/product';

type WishlistState = {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          if (exists) {
            return { items: state.items.filter((p) => p.id !== product.id) };
          }
          return { items: [...state.items, product] };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        })),
      has: (productId) => get().items.some((p) => p.id === productId),
    }),
    { name: 'vt-wishlist' },
  ),
);
