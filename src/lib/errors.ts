import { AxiosError } from 'axios';

export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static fromAxiosError(error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>): ApiError {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || getDefaultErrorMessage(statusCode);
    const errors = error.response?.data?.errors;

    return new ApiError(message, statusCode, errors);
  }
}

export function getDefaultErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: 'Буруу хүсэлт илгээгдлээ',
    401: 'Нэвтрэх шаардлагатай',
    403: 'Энэ үйлдлийг хийх эрхгүй байна',
    404: 'Хайсан зүйл олдсонгүй',
    409: 'Өгөгдөл давхцаж байна',
    422: 'Оруулсан мэдээлэл буруу байна',
    429: 'Хэт олон хүсэлт илгээгдлээ. Түр хүлээнэ үү',
    500: 'Серверийн алдаа гарлаа',
    502: 'Сервертэй холбогдож чадсангүй',
    503: 'Сервер түр ачаалалтай байна',
  };

  return messages[statusCode] || 'Алдаа гарлаа. Дахин оролдоно уу';
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof AxiosError) {
    // Network error
    if (error.code === 'ERR_NETWORK') {
      return 'Интернет холболтоо шалгана уу';
    }
    // Timeout
    if (error.code === 'ECONNABORTED') {
      return 'Хүсэлт хугацаа хэтэрлээ. Дахин оролдоно уу';
    }
    // Cancelled request
    if (error.code === 'ERR_CANCELED') {
      return ''; // Don't show message for cancelled requests
    }

    return ApiError.fromAxiosError(error).message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Тодорхойгүй алдаа гарлаа';
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && error.code === 'ERR_NETWORK';
}

export function isCancelledError(error: unknown): boolean {
  return error instanceof AxiosError && error.code === 'ERR_CANCELED';
}
