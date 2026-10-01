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
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isDark = theme === 'dark';

  const handleClick = () => {
    if (isTransitioning) return;
    cyberAudio.playThemeToggle(!isDark);
    toggleTheme();
  };

  const handleMouseEnter = () => {
    if (!isTransitioning) {
      cyberAudio.playHover();
    }
  };

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (variant === 'compact') {
    return (
      <div className="relative inline-block">
        <button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          disabled={isTransitioning}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${
            isTransitioning ? 'cursor-wait opacity-80' : 'cursor-pointer'
          } ${
            isDark
              ? 'bg-neutral-900/80 border-white/15 text-neutral-300 hover:text-white hover:border-white/40 hover:bg-white/10'
              : 'bg-white border-neutral-300 text-neutral-700 hover:text-black hover:border-neutral-700 hover:bg-neutral-100 shadow-sm'
          } ${className}`}
          aria-label={label}
          title={isTransitioning ? 'System Reconfiguring...' : label}
        >
          {isDark ? (
            <Moon size={13} className="text-neutral-200" aria-hidden="true" />
          ) : (
            <Sun size={13} className="text-amber-600" aria-hidden="true" />
          )}
        </button>
        {isTransitioning && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping pointer-events-none" />
        )}
      </div>
    );
  }

  if (variant === 'drawer') {
    return (
      <button
        onClick={handleClick}
        disabled={isTransitioning}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-md border font-mono text-xs transition-all ${
          isTransitioning ? 'cursor-wait opacity-80' : 'cursor-pointer'
        } ${
          isDark
            ? 'bg-neutral-900/90 border-white/15 text-neutral-200 hover:border-white/40 hover:bg-neutral-900'
            : 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 shadow-sm'
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
        <div className="flex items-center gap-1.5">
          {isTransitioning && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          <span className={`font-bold tracking-widest text-[11px] px-2 py-0.5 rounded border ${
            isDark
              ? 'bg-white/10 border-white/15 text-neutral-200'
              : 'bg-neutral-100 border-neutral-300 text-neutral-800'
          }`}>
            {isTransitioning ? '[ RECONFIGURING ]' : isDark ? '[ ☾ DARK ]' : '[ ☀ LIGHT ]'}
          </span>
        </div>
      </button>
    );
  }

  // Default 'nav' variant: [ ☾ DARK ] / [ ☀ LIGHT ]
  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={isTransitioning}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-all duration-200 select-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 ${
          isTransitioning ? 'cursor-wait opacity-80' : 'cursor-pointer'
        } ${
          isDark
            ? 'bg-white/5 border-white/15 text-neutral-300 hover:text-white hover:border-white/40 hover:bg-white/10'
            : 'bg-white border-neutral-300 text-neutral-800 hover:text-black hover:border-neutral-700 hover:bg-neutral-100 shadow-sm'
        } ${className}`}
        aria-label={label}
        title={isTransitioning ? 'System Reconfiguring...' : label}
      >
        {isDark ? (
          <>
            <Moon size={12} className="text-neutral-300" aria-hidden="true" />
            <span className="font-mono text-[11px] tracking-wider font-semibold">
              {isTransitioning ? '[ RECONFIGURING ]' : '[ ☾ DARK ]'}
            </span>
          </>
        ) : (
          <>
            <Sun size={12} className="text-amber-600" aria-hidden="true" />
            <span className="font-mono text-[11px] tracking-wider font-semibold">
              {isTransitioning ? '[ RECONFIGURING ]' : '[ ☀ LIGHT ]'}
            </span>
          </>
        )}
      </button>

      {/* 0.0-0.5s: Small reacting glowing point when transition triggers */}
      {isTransitioning && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-ping pointer-events-none" />
      )}
    </div>
  );
};
