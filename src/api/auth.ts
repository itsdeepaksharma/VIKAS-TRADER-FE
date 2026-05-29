import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import { apiClient } from './client';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}
