import { useState, useEffect, useCallback, useRef } from 'react';
import { getErrorMessage, isCancelledError } from '@/lib/errors';
import { withRetry } from '@/lib/retry';
import toast from 'react-hot-toast';

interface UseAsyncDataOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  showErrorToast?: boolean;
  initialData?: T;
  retry?: boolean;
  maxRetries?: number;
}

interface UseAsyncDataReturn<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAsyncData<T>(
  fetchFn: (signal?: AbortSignal) => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> {
  const {
    onSuccess,
    onError,
    showErrorToast = true,
    initialData,
    retry = true,
    maxRetries = 3,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsLoading(true);
      setError(null);

      // Wrap fetch function with retry logic if enabled
      const fetchWithSignal = () => fetchFn(signal);
      const result = retry
        ? await withRetry(fetchWithSignal, { maxRetries })
        : await fetchWithSignal();

      // Check if request was cancelled
      if (signal.aborted) return;

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      // Don't update state for cancelled requests
      if (isCancelledError(err)) return;

      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      if (showErrorToast && errorMessage) {
        toast.error(errorMessage);
      }

      onError?.(err);
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, onSuccess, onError, showErrorToast, retry, maxRetries]);

  useEffect(() => {
    fetchData();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export default useAsyncData;
