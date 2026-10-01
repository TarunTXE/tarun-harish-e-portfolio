import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
export type TransitionDirection = 'to-light' | 'to-dark' | null;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
  transitionDirection: TransitionDirection;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'txe-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    }
    return 'dark';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#F5F5F2');
    }
  }, [theme]);

  const toggleTheme = () => {
    // Lock toggle: prevent clicks while 4-second transition is running
    if (isTransitioning) return;

    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    const direction: TransitionDirection = nextTheme === 'light' ? 'to-light' : 'to-dark';

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setThemeState(nextTheme);
      return;
    }

    setIsTransitioning(true);
    setTransitionDirection(direction);

    // Switch underlying theme state at 2.5s (2500ms), under the cover of the scanbeam & wave
    const switchTimer = setTimeout(() => {
      setThemeState(nextTheme);
    }, 2500);

    // Conclude 4-second reconfiguration sequence cleanly at 4000ms
    const completeTimer = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 4000);

    return () => {
      clearTimeout(switchTimer);
      clearTimeout(completeTimer);
    };
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isTransitioning,
        transitionDirection,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
