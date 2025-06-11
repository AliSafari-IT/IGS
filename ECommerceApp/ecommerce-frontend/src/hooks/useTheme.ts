import { useState, useEffect, useLayoutEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: Theme;
  isSystemTheme: boolean;
}

/**
 * Custom hook for managing application theme
 * Supports system theme detection and manual theme selection
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [systemTheme, setSystemTheme] = useState<Theme>('light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Initial system theme detection
    updateSystemTheme(mediaQuery);

    // Listen for system theme changes
    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  // Apply theme to DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    console.log('🎨 Applying theme:', newTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme);
    console.log('🎨 Set data-theme attribute on documentElement:', newTheme);
    
    // Update body class for backward compatibility
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${newTheme}`);
    console.log('🎨 Updated body class to theme-' + newTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        light: '#ffffff',
        dark: '#1e293b'
      };
      metaThemeColor.setAttribute('content', themeColors[newTheme]);
      console.log('🎨 Updated meta theme-color to:', themeColors[newTheme]);
    } else {
      console.log('🎨 No meta theme-color found');
    }
  }, []);

  // Initialize theme from localStorage or use system preference
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      console.log('🎨 Found saved theme:', savedTheme);
      setThemeState(savedTheme);
      setIsSystemTheme(false);
      applyTheme(savedTheme);
    } else {
      console.log('🎨 No saved theme, using system theme:', systemTheme);
      setThemeState(systemTheme);
      setIsSystemTheme(true);
      applyTheme(systemTheme);
    }
  }, [systemTheme, applyTheme]);

  // Apply theme when system theme changes and user hasn't set a preference
  useLayoutEffect(() => {
    if (isSystemTheme) {
      console.log('🎨 Applying system theme:', systemTheme);
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    }
  }, [systemTheme, isSystemTheme, applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    console.log('🎨 setTheme called with:', newTheme);
    setThemeState(newTheme);
    setIsSystemTheme(false);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    console.log('🎨 Theme applied and saved to localStorage');
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('🎨 Theme toggle - Current theme:', theme);
    console.log('🎨 Theme toggle - Switching to:', newTheme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    systemTheme,
    isSystemTheme
  };
};

export default useTheme;
