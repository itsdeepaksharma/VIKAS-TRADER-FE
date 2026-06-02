/** Low stock = 1 … (max - 1). Out of stock = 0. */
export const LOW_STOCK_MAX = 5;

export function isOutOfStock(quantity: number): boolean {
  return quantity <= 0;
}

export function isLowStock(quantity: number): boolean {
  return quantity > 0 && quantity < LOW_STOCK_MAX;
}
