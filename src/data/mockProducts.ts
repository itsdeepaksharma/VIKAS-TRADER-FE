import type { Product } from '../types/product';

const baseFeatures = ['BPA Free', 'Food Grade', 'Air Tight', 'Durable'];
const baseColors = [
  { id: 'blue', name: 'Blue', hex: '#00A3FF' },
  { id: 'green', name: 'Green', hex: '#39FF6A' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Milton Storage Container Set (5 Pcs)',
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewCount: 234,
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
    categoryId: '3',
    categorySlug: 'containers',
    inStock: true,
    features: baseFeatures,
    colors: baseColors,
    sizes: ['1.5 L', '2.5 L', '5 L'],
    description:
      'Premium airtight storage containers perfect for kitchen and pantry organization.',
    isBestSeller: true,
  },
  {
    id: 'p2',
    name: 'Heavy Duty Plastic Bucket 20L',
    price: 349,
    originalPrice: 449,
    rating: 4.5,
    reviewCount: 189,
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop',
    categoryId: '1',
    categorySlug: 'buckets-mugs',
    inStock: true,
    features: ['Durable', 'Leak Proof', 'Easy Grip Handle'],
    colors: [
      { id: 'blue', name: 'Blue', hex: '#00A3FF' },
      { id: 'red', name: 'Red', hex: '#EF4444' },
    ],
    sizes: ['15 L', '20 L', '25 L'],
    description: 'Industrial-grade bucket for household and commercial use.',
    isBestSeller: true,
  },
  {
    id: 'p3',
    name: 'Multi-Purpose Storage Basket',
    price: 299,
    rating: 4.6,
    reviewCount: 156,
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    categoryId: '2',
    categorySlug: 'baskets-organizers',
    inStock: true,
    features: ['Stackable', 'Ventilated', 'Lightweight'],
    colors: baseColors,
    sizes: ['Small', 'Medium', 'Large'],
    description: 'Organize your home with this versatile storage basket.',
    isBestSeller: true,
  },
  {
    id: 'p4',
    name: 'Kitchen Lunch Box Set (3 Tier)',
    price: 549,
    originalPrice: 699,
    rating: 4.8,
    reviewCount: 312,
    image:
      'https://images.unsplash.com/photo-1556909202-7a9a0f8b0f0f?w=600&h=600&fit=crop',
    categoryId: '4',
    categorySlug: 'kitchenware',
    inStock: true,
    features: baseFeatures,
    colors: baseColors,
    sizes: ['750 ml', '1 L', '1.5 L'],
    description: 'Microwave-safe lunch boxes with leak-proof lids.',
    isBestSeller: true,
  },
  {
    id: 'p5',
    name: 'Airtight Food Jar 1.2L',
    price: 199,
    rating: 4.4,
    reviewCount: 98,
    image:
      'https://images.unsplash.com/photo-1595428774223-ef9bbecbb547?w=600&h=600&fit=crop',
    categoryId: '3',
    categorySlug: 'containers',
    inStock: true,
    features: baseFeatures,
    colors: baseColors,
    sizes: ['800 ml', '1.2 L', '2 L'],
    description: 'Keep snacks and dry goods fresh longer.',
  },
  {
    id: 'p6',
    name: 'Floor Cleaning Mop Bucket',
    price: 449,
    rating: 4.3,
    reviewCount: 87,
    image:
      'https://images.unsplash.com/photo-1563453392213-326a0a0c0f0f?w=600&h=600&fit=crop',
    categoryId: '5',
    categorySlug: 'cleaning-supplies',
    inStock: true,
    features: ['Wheels', 'Wringer', 'Durable'],
    colors: [{ id: 'blue', name: 'Blue', hex: '#00A3FF' }],
    sizes: ['12 L', '16 L'],
    description: 'Professional mop bucket with wringer system.',
  },
  {
    id: 'p7',
    name: 'Stackable Drawer Organizer',
    price: 399,
    rating: 4.6,
    reviewCount: 145,
    image:
      'https://images.unsplash.com/photo-1585421514288-efb74c2b69bb?w=600&h=600&fit=crop',
    categoryId: '7',
    categorySlug: 'storage',
    inStock: true,
    features: ['Modular', 'Transparent', 'Stackable'],
    colors: baseColors,
    sizes: ['S', 'M', 'L'],
    description: 'Maximize drawer space with modular organizers.',
  },
  {
    id: 'p8',
    name: 'Wholesale Plastic Mug Pack (48 Pcs)',
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewCount: 56,
    image:
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=600&fit=crop',
    categoryId: '8',
    categorySlug: 'wholesale',
    inStock: true,
    features: ['Bulk Pack', 'Restaurant Grade', 'BPA Free'],
    colors: [{ id: 'white', name: 'White', hex: '#FFFFFF' }],
    sizes: ['250 ml'],
    description: 'Ideal for cafes, caterers, and wholesale buyers.',
  },
];

export const listingFilters = ['All', 'Storage', 'Lunch', 'Multi Purpose', 'Jars'] as const;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}
