import type { User } from '../types/auth';

export const DEMO_STORAGE_KEY = 'vt-demo-store-v1';

export const DEMO_BUYER_EMAIL = 'demo@vikastraders.com';
export const DEMO_BUYER_PASSWORD = 'DemoBuyer@2026';
export const DEMO_ADMIN_EMAIL = 'admin@vikastraders.com';
export const DEMO_ADMIN_PASSWORD = 'VikasAdmin@2026';

export const DEMO_BUYER_ID = 'demo-buyer-shivani';
export const DEMO_ADMIN_ID = 'demo-admin-vikas';

export const demoBuyerUser: User = {
  id: DEMO_BUYER_ID,
  email: DEMO_BUYER_EMAIL,
  first_name: 'Shivani',
  last_name: 'Pancholi',
  phone: '9876543210',
  address: 'Shop 12, Model Town, Ludhiana, Punjab 141002',
  is_active: true,
  is_superuser: false,
};

export const demoAdminUser: User = {
  id: DEMO_ADMIN_ID,
  email: DEMO_ADMIN_EMAIL,
  first_name: 'Vikas',
  last_name: 'Admin',
  phone: '9999999999',
  address: 'Vikas Traders HQ, Ludhiana, Punjab',
  is_active: true,
  is_superuser: true,
};

export function demoTokenForUser(userId: string): string {
  return `demo-token-${userId}`;
}

export function demoDelay(ms = 280): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
