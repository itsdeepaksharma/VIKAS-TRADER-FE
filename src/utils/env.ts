type Env = {
  apiUrl: string;
  isDemoMode: boolean;
};

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const env: Env = {
  isDemoMode,
  apiUrl: isDemoMode
    ? (import.meta.env.VITE_API_URL ?? '/api/v1')
    : requireEnv(import.meta.env.VITE_API_URL, 'VITE_API_URL'),
};
