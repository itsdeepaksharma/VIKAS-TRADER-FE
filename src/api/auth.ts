import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';
import { env } from '../utils/env';
import * as demo from '../demo/auth';
import { apiClient } from './client';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  if (env.isDemoMode) return demo.demoLogin(payload);
  const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  if (env.isDemoMode) return demo.demoRegister(payload);
  const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function forgotPasswordApi(email: string): Promise<void> {
  if (env.isDemoMode) return demo.demoForgotPassword(email);
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPasswordApi(email: string, new_password: string): Promise<void> {
  if (env.isDemoMode) return demo.demoResetPassword(email, new_password);
  await apiClient.post('/auth/reset-password', { email, new_password });
}
