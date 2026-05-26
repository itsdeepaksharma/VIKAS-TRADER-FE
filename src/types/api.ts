export type HealthResponse = {
  status: string;
  service: string;
  environment: string;
};

export type ApiError = {
  detail: string;
  error_code?: string;
};
