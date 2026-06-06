import { useCallback, useState } from 'react';

import { refreshCartStock, type CartStockIssue } from '../lib/cartStockSync';
import { useCartStore } from '../store/cartStore';

export function useCartStockSync() {
  const replaceItems = useCartStore((s) => s.replaceItems);
  const [issues, setIssues] = useState<CartStockIssue[]>([]);
  const [syncing, setSyncing] = useState(false);

  const syncCartStock = useCallback(async () => {
    const currentItems = useCartStore.getState().items;
    if (currentItems.length === 0) {
      setIssues([]);
      return { items: [], issues: [], canCheckout: false };
    }

    setSyncing(true);
    try {
      const result = await refreshCartStock(currentItems);
      replaceItems(result.items);
      setIssues(result.issues);
      return result;
    } finally {
      setSyncing(false);
    }
  }, [replaceItems]);

  return { issues, syncing, syncCartStock };
}
