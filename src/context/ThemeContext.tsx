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

  const switchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTheme = () => {
    // Prevent double clicking while transition is running
    if (isTransitioning) return;

    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    const direction: TransitionDirection = nextTheme === 'light' ? 'to-light' : 'to-dark';

    setIsTransitioning(true);
    setTransitionDirection(direction);

    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    // Switch underlying theme state at 220ms under the cover of the animated scanbeam & wave
    switchTimerRef.current = setTimeout(() => {
      setThemeState(nextTheme);
    }, 220);

    // Conclude visual reconfiguration sequence cleanly at 750ms
    completeTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 750);
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
