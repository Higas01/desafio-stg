'use client';

import { useEffect } from 'react';

export function ThemeProvider() {
  useEffect(() => {
    // Aplicar tema inicial sem flash
    const applyTheme = () => {
      try {
        const isDark = 
          localStorage.theme === 'dark' || 
          (!('theme' in localStorage) && 
           window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Erro ao aplicar tema:', error);
      }
    };

    applyTheme();
  }, []);

  return null;
}
