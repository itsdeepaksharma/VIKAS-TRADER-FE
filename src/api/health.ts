import { env } from '../utils/env';
import { demoGetHealth } from '../demo/health';
import { apiClient } from './client';
import type { HealthResponse } from '../types/api';

export async function getHealth(): Promise<HealthResponse> {
  if (env.isDemoMode) return demoGetHealth();
  const { data } = await apiClient.get<HealthResponse>('/health');
  return data;
}
