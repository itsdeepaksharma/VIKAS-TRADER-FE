import type { User } from '../types/auth';
import { apiClient } from './client';

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string | null;
};

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/users/me');
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await apiClient.patch<User>('/users/me', payload);
  return data;
}
