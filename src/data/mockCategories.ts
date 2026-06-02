import type { Category } from '../types/product';

export const categories: Category[] = [
  {
    id: '1',
    slug: 'buckets-mugs',
    name: 'Buckets & Mugs',
    itemCount: 120,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
    bgColor: 'bg-vt-light-blue',
  },
  {
    id: '2',
    slug: 'baskets-organizers',
    name: 'Baskets & Organizers',
    itemCount: 85,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    bgColor: 'bg-vt-light-mint',
  },
  {
    id: '3',
    slug: 'containers',
    name: 'Containers',
    itemCount: 200,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    bgColor: 'bg-amber-50',
  },
  {
    id: '4',
    slug: 'kitchenware',
    name: 'Kitchenware',
    itemCount: 150,
    image: 'https://images.unsplash.com/photo-1556909202-7a9a0f8b0f0f?w=400&h=400&fit=crop',
    bgColor: 'bg-orange-50',
  },
  {
    id: '5',
    slug: 'cleaning-supplies',
    name: 'Cleaning Supplies',
    itemCount: 95,
    image: 'https://images.unsplash.com/photo-1563453392213-326a0a0c0f0f?w=400&h=400&fit=crop',
    bgColor: 'bg-sky-50',
  },
  {
    id: '6',
    slug: 'household',
    name: 'Household',
    itemCount: 180,
    image: 'https://images.unsplash.com/photo-1585421514288-efb74c2b69bb?w=400&h=400&fit=crop',
    bgColor: 'bg-vt-light-blue',
  },
  {
    id: '7',
    slug: 'storage',
    name: 'Storage Solutions',
    itemCount: 110,
    image: 'https://images.unsplash.com/photo-1595428774223-ef9bbecbb547?w=400&h=400&fit=crop',
    bgColor: 'bg-vt-light-mint',
  },
  {
    id: '8',
    slug: 'wholesale',
    name: 'Wholesale Packs',
    itemCount: 45,
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop',
    bgColor: 'bg-emerald-50',
  },
];

export const homeCategories = categories.slice(0, 6);

export const quickActions = [
  { id: 'categories', label: 'Categories', icon: 'grid', path: '/categories' },
  { id: 'new', label: 'New Arrivals', icon: 'sparkles', path: '/new-arrivals' },
  { id: 'best', label: 'Best Sellers', icon: 'trending', path: '/categories/containers' },
] as const;
