import type { CartItem, Product } from '../types/product';

export type CartVariantOptions = {
  color?: string;
  size?: string;
};

export function getDefaultProductOptions(product: Pick<Product, 'colors' | 'sizes'>): CartVariantOptions {
  return {
    color: product.colors[0]?.id || undefined,
    size: product.sizes[0] || undefined,
  };
}

/** Always apply product defaults so listing and details use the same cart line. */
export function normalizeProductOptions(
  product: Pick<Product, 'colors' | 'sizes'>,
  options?: CartVariantOptions,
): CartVariantOptions {
  const defaults = getDefaultProductOptions(product);
  const color = (options?.color || '').trim() || defaults.color;
  const size = (options?.size || '').trim() || defaults.size;
  return {
    color: color || undefined,
    size: size || undefined,
  };
}

export function cartLineKey(
  productId: string,
  selectedColor?: string,
  selectedSize?: string,
): string {
  return `${productId}::${selectedColor ?? ''}::${selectedSize ?? ''}`;
}

export function cartItemKey(item: Pick<CartItem, 'product' | 'selectedColor' | 'selectedSize'>): string {
  return cartLineKey(item.product.id, item.selectedColor, item.selectedSize);
}

export function findCartItemForProduct(
  items: CartItem[],
  product: Pick<Product, 'id' | 'colors' | 'sizes'>,
  options?: CartVariantOptions,
): CartItem | undefined {
  const normalized = normalizeProductOptions(product, options);
  const exactKey = cartLineKey(product.id, normalized.color, normalized.size);
  const exact = items.find((item) => cartItemKey(item) === exactKey);
  if (exact) return exact;

  // Legacy lines added without color/unit before defaults were applied.
  return items.find(
    (item) =>
      item.product.id === product.id && !item.selectedColor && !item.selectedSize,
  );
}

export function resolveColorLabel(
  product: Pick<Product, 'colors'>,
  selectedColor?: string,
): string | undefined {
  if (!selectedColor) return undefined;
  const match = product.colors.find((c) => c.id === selectedColor || c.name === selectedColor);
  return match?.name ?? selectedColor;
}

export function formatCartVariantLabel(
  product: Pick<Product, 'colors'>,
  selectedColor?: string,
  selectedSize?: string,
): string | null {
  const parts: string[] = [];
  const colorName = resolveColorLabel(product, selectedColor);
  if (colorName) parts.push(`Color: ${colorName}`);
  if (selectedSize) parts.push(`Unit: ${selectedSize}`);
  return parts.length > 0 ? parts.join(' · ') : null;
}

/** Merge duplicate lines for the same product+variant (including legacy empty variants). */
export function consolidateCartItems(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of items) {
    const normalized = normalizeProductOptions(item.product, {
      color: item.selectedColor,
      size: item.selectedSize,
    });
    const key = cartLineKey(item.product.id, normalized.color, normalized.size);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, {
        ...item,
        selectedColor: normalized.color,
        selectedSize: normalized.size,
      });
      continue;
    }

    const maxQty = item.product.stockQuantity ?? existing.quantity + item.quantity;
    merged.set(key, {
      ...existing,
      quantity: Math.min(existing.quantity + item.quantity, maxQty),
      product: item.product,
      selectedColor: normalized.color,
      selectedSize: normalized.size,
    });
  }

  return Array.from(merged.values());
}
