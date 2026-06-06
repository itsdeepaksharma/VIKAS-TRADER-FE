import type { User } from '../types/auth';
import { env } from '../utils/env';
import * as demo from '../demo/orders';
import { apiClient } from './client';

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
};

export async function getCurrentUser(): Promise<User> {
  if (env.isDemoMode) return demo.demoGetCurrentUser();
  const { data } = await apiClient.get<User>('/users/me');
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  if (env.isDemoMode) return demo.demoUpdateProfile(payload);
  const { data } = await apiClient.patch<User>('/users/me', payload);
  return data;
}
