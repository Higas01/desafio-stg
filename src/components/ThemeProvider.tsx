'use client';

import { useEffect } from 'react';

export function ThemeProvider() {
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches);

      if (isDark) {
        document.documentElement.classList.add(
          'dark'
        );
      } else {
        document.documentElement.classList.remove(
          'dark'
        );
      }
    };

    applyTheme();
  }, []);

  return null;
}
