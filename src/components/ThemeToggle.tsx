import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cyberAudio } from '../utils/audio';

interface ThemeToggleProps {
  variant?: 'nav' | 'compact' | 'drawer';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = () => {
    cyberAudio.playClick();
    toggleTheme();
  };

  const handleMouseEnter = () => {
    cyberAudio.playHover();
  };

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${
          isDark
            ? 'bg-neutral-900/80 border-white/15 text-neutral-300 hover:text-white hover:border-white/40 hover:bg-white/10'
            : 'bg-white border-neutral-300 text-neutral-700 hover:text-black hover:border-neutral-900 hover:bg-neutral-100 shadow-sm'
        } ${className}`}
        aria-label={label}
        title={label}
      >
        {isDark ? (
          <Moon size={13} className="text-neutral-200" aria-hidden="true" />
        ) : (
          <Sun size={13} className="text-amber-600" aria-hidden="true" />
        )}
      </button>
    );
  }

  if (variant === 'drawer') {
    return (
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-md border font-mono text-xs transition-all cursor-pointer ${
          isDark
            ? 'bg-neutral-900/90 border-white/15 text-neutral-200 hover:border-white/40'
            : 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-900 shadow-sm'
        } ${className}`}
        aria-label={label}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Moon size={14} className="text-neutral-300" aria-hidden="true" />
          ) : (
            <Sun size={14} className="text-amber-600" aria-hidden="true" />
          )}
          <span className="font-semibold uppercase tracking-wider">THEME MODE</span>
        </span>
        <span className="font-bold tracking-widest text-[11px] px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
          {isDark ? '[ ☾ DARK ]' : '[ ☀ LIGHT ]'}
        </span>
      </button>
    );
  }

  // Default 'nav' variant: Minimal terminal-style toggle
  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/70 select-none ${
        isDark
          ? 'bg-white/5 border-white/15 text-neutral-300 hover:text-white hover:border-white/40 hover:bg-white/10'
          : 'bg-white border-neutral-300 text-neutral-800 hover:text-black hover:border-neutral-900 hover:bg-neutral-100 shadow-sm'
      } ${className}`}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <>
          <Moon size={12} className="text-neutral-300" aria-hidden="true" />
          <span className="font-mono text-[11px] tracking-wider font-semibold">
            DARK
          </span>
        </>
      ) : (
        <>
          <Sun size={12} className="text-amber-600" aria-hidden="true" />
          <span className="font-mono text-[11px] tracking-wider font-semibold">
            LIGHT
          </span>
        </>
      )}
    </button>
  );
};
