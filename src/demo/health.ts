import type { HealthResponse } from '../types/api';

export async function demoGetHealth(): Promise<HealthResponse> {
  return {
    status: 'ok',
    service: 'vikas-trader-demo',
    environment: 'demo',
  };
}
