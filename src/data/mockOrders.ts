import { products } from './mockProducts';
import type { Order } from '../types/product';

export const orders: Order[] = [
  {
    id: 'VT-2026-1042',
    date: '2026-05-28',
    status: 'delivered',
    items: [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 2 },
    ],
    total: 1497,
  },
  {
    id: 'VT-2026-1038',
    date: '2026-05-25',
    status: 'shipped',
    items: [{ product: products[1], quantity: 1 }],
    total: 349,
  },
  {
    id: 'VT-2026-1031',
    date: '2026-05-20',
    status: 'processing',
    items: [
      { product: products[3], quantity: 1 },
      { product: products[4], quantity: 3 },
    ],
    total: 1146,
  },
  {
    id: 'VT-2026-1025',
    date: '2026-05-15',
    status: 'cancelled',
    items: [{ product: products[5], quantity: 1 }],
    total: 449,
  },
];
