type Env = {
  apiUrl: string;
};

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: Env = {
  apiUrl: requireEnv(import.meta.env.VITE_API_URL, 'VITE_API_URL'),
};
