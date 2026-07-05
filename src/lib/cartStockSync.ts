import { fetchProduct } from '../api/catalog';
import { mapProduct } from './catalogMappers';
import { isValidProductId, syncCartItems, type CartStockIssue, type CartSyncResult } from './cartStock';
import type { Product } from '../types/product';
import type { CartItem } from '../types/product';

export async function fetchLiveCartProducts(ids: string[]): Promise<Map<string, Product>> {
  const map = new Map<string, Product>();
  const uniqueIds = [...new Set(ids.filter(isValidProductId))];

  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        map.set(id, mapProduct(await fetchProduct(id)));
      } catch {
        // Product missing or inactive — handled during sync.
      }
    }),
  );

  return map;
}

export async function refreshCartStock(items: CartItem[]): Promise<CartSyncResult> {
  const freshMap = await fetchLiveCartProducts(items.map((item) => item.product.id));
  return syncCartItems(items, freshMap);
}

export type { CartStockIssue, CartSyncResult };
