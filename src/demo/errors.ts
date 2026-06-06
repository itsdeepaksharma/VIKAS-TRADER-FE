import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export function throwDemoError(status: number, detail: string): never {
  throw new AxiosError(
    detail,
    AxiosError.ERR_BAD_REQUEST,
    undefined,
    undefined,
    {
      status,
      data: { detail },
      statusText: 'Error',
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
    },
  );
}
