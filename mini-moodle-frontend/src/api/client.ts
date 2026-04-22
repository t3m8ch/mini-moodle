import axios, { AxiosError } from 'axios';

export interface ApiSuccess<T> {
  status: 'OK';
  payload: T | null;
}

export interface ApiErrorResponse {
  status: 'ERROR';
  msg: string;
  details?: unknown;
  statusCode: number;
  handledByInterceptor?: boolean;
}

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function unwrapPayload<T>(
  request: Promise<{ data: ApiSuccess<T> }>,
) {
  const response = await request;

  if (response.data.payload === null) {
    throw new Error('Сервер вернул пустой ответ');
  }

  return response.data.payload;
}

export async function unwrapNullablePayload<T>(
  request: Promise<{ data: ApiSuccess<T> }>,
) {
  const response = await request;
  return response.data.payload;
}

export function toApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError<{ msg?: string; details?: unknown }>(error)) {
    const handledByInterceptor = Boolean(
      (error as AxiosError & { __sessionRedirectHandled?: boolean })
        .__sessionRedirectHandled,
    );

    return {
      status: 'ERROR',
      msg:
        error.response?.data?.msg ??
        error.message ??
        'Не удалось выполнить запрос к серверу',
      details: error.response?.data?.details,
      statusCode: error.response?.status ?? 500,
      handledByInterceptor,
    };
  }

  if (error instanceof Error) {
    return {
      status: 'ERROR',
      msg: error.message,
      statusCode: 500,
    };
  }

  return {
    status: 'ERROR',
    msg: 'Произошла неизвестная ошибка',
    statusCode: 500,
  };
}
