import type { CartItem, Product } from '../types/product';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidProductId(id: string): boolean {
  return UUID_RE.test(id);
}

export type CartStockIssue = {
  productId: string;
  productName: string;
  type: 'removed' | 'out_of_stock' | 'quantity_reduced' | 'unavailable';
  message: string;
  availableQuantity?: number;
};

export type CartSyncResult = {
  items: CartItem[];
  issues: CartStockIssue[];
  canCheckout: boolean;
};

export function syncCartItems(
  currentItems: CartItem[],
  freshProducts: Map<string, Product>,
): CartSyncResult {
  const issues: CartStockIssue[] = [];
  const nextItems: CartItem[] = [];

  for (const item of currentItems) {
    const { product, quantity, selectedColor, selectedSize } = item;

    if (!isValidProductId(product.id)) {
      issues.push({
        productId: product.id,
        productName: product.name,
        type: 'removed',
        message: `${product.name} is no longer available and was removed from your cart.`,
      });
      continue;
    }

    const fresh = freshProducts.get(product.id);
    if (!fresh) {
      issues.push({
        productId: product.id,
        productName: product.name,
        type: 'unavailable',
        message: `${product.name} is no longer available and was removed from your cart.`,
      });
      continue;
    }

    const stock = fresh.stockQuantity ?? 0;
    if (!fresh.inStock || stock <= 0) {
      issues.push({
        productId: product.id,
        productName: fresh.name,
        type: 'out_of_stock',
        message: `${fresh.name} is out of stock and was removed from your cart.`,
      });
      continue;
    }

    let nextQty = quantity;
    if (quantity > stock) {
      nextQty = stock;
      issues.push({
        productId: product.id,
        productName: fresh.name,
        type: 'quantity_reduced',
        message: `Only ${stock} unit(s) of ${fresh.name} left. Quantity updated to ${stock}.`,
        availableQuantity: stock,
      });
    }

    nextItems.push({
      product: fresh,
      quantity: nextQty,
      selectedColor,
      selectedSize,
    });
  }

  return {
    items: nextItems,
    issues,
    canCheckout:
      nextItems.length > 0 &&
      nextItems.every(
        (i) => i.product.inStock && (i.product.stockQuantity ?? 0) >= i.quantity,
      ),
  };
}
