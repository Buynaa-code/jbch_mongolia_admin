/**
 * Safe localStorage wrapper for SSR compatibility
 */

const isClient = typeof window !== 'undefined';

export const storage = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    if (!isClient) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  getString(key: string, defaultValue: string | null = null): string | null {
    if (!isClient) return defaultValue;

    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    if (!isClient) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  setString(key: string, value: string): boolean {
    if (!isClient) return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    if (!isClient) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear(): boolean {
    if (!isClient) return false;

    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;

export default storage;
