interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryOn?: (error: unknown) => boolean;
  onRetry?: (error: unknown, attempt: number) => void;
}

const defaultConfig: Required<RetryConfig> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryOn: (error) => {
    // Retry on network errors and 5xx errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('network') || message.includes('timeout')) {
        return true;
      }
    }
    // Check for status code if available
    const statusCode = (error as { statusCode?: number })?.statusCode;
    if (statusCode && statusCode >= 500) {
      return true;
    }
    return false;
  },
  onRetry: () => {},
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries, retryDelay, retryOn, onRetry } = {
    ...defaultConfig,
    ...config,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt <= maxRetries && retryOn(error)) {
        onRetry(error, attempt);

        // Wait before retrying with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

export default withRetry;
