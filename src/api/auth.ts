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

export async function forgotPasswordApi(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPasswordApi(email: string, new_password: string): Promise<void> {
  await apiClient.post('/auth/reset-password', { email, new_password });
}
