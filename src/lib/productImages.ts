import type { Product } from '../types/product';

export function getProductImages(product: Pick<Product, 'image' | 'images'>): string[] {
  if (product.images?.length) return product.images;
  return product.image ? [product.image] : [];
}

export function buildProductImagePayload(images: string[], fallbackImage?: string) {
  const cleaned = images.filter(Boolean);
  if (cleaned.length) {
    return { image: cleaned[0], images: cleaned };
  }
  if (fallbackImage) {
    return { image: fallbackImage, images: [fallbackImage] };
  }
  return { image: '', images: [] as string[] };
}
