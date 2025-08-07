import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
) => {
  const [storedValue, setStoredValue] =
    useState<T>(() => {
      if (typeof window !== 'undefined') {
        const item =
          window.localStorage.getItem(key);
        return item
          ? JSON.parse(item)
          : initialValue;
      }
      return initialValue;
    });

  const setValue = (
    value: T | ((val: T) => T)
  ) => {
    const valueToStore =
      value instanceof Function
        ? value(storedValue)
        : value;
    setStoredValue(valueToStore);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        key,
        JSON.stringify(valueToStore)
      );
    }
  };

  return [storedValue, setValue] as const;
};

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
};

export const useDebounce = <T>(
  value: T,
  delay: number
) => {
  const [debouncedValue, setDebouncedValue] =
    useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
