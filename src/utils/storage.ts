/**
 * Safe wrapper for localStorage to prevent SSR hydration mismatches
 * and window undefined errors in Next.js.
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Error setting localStorage key "${key}":`, e);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },

  getJSON: <T>(key: string, fallback: T): T => {
    const item = safeLocalStorage.getItem(key);
    if (!item) return fallback;
    try {
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  },

  setJSON: <T>(key: string, value: T): void => {
    try {
      safeLocalStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error serializing JSON for key "${key}":`, e);
    }
  }
};
