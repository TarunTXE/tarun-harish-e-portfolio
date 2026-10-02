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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Mobile Compact Variant (Sliding Pill Switch for Mobile Navbar)
  // ─────────────────────────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={isTransitioning}
        className={`relative inline-flex items-center w-12 h-6 rounded-full p-0.5 border transition-all duration-300 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/70 active:scale-95 ${
          isDark
            ? 'bg-neutral-900 border-white/20 hover:border-white/40 shadow-inner'
            : 'bg-emerald-500/15 border-emerald-500/40 hover:border-emerald-500/70 shadow-inner'
        } ${className}`}
        aria-label={label}
        title={label}
      >
        {/* Animated Sliding Thumb / Knob */}
        <span
          className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 ease-out transform shadow-md ${
            isDark
              ? 'translate-x-0.5 bg-neutral-800 text-neutral-200 border border-white/20'
              : 'translate-x-[22px] bg-emerald-500 text-black border border-emerald-400'
          }`}
        >
          {isDark ? (
            <Moon size={9} className="transition-transform duration-300" aria-hidden="true" />
          ) : (
            <Sun size={9} className="transition-transform duration-300 text-black" aria-hidden="true" />
          )}
        </span>
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Mobile Drawer Variant (Full width row with switch on the right)
  // ─────────────────────────────────────────────────────────────────────────────
  if (variant === 'drawer') {
    return (
      <button
        onClick={handleClick}
        disabled={isTransitioning}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-md border font-mono text-xs transition-all cursor-pointer select-none active:scale-[0.99] ${
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

        {/* Animated Toggle Switch */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider opacity-60 font-semibold">
            {isTransitioning ? 'RECONFIG' : isDark ? 'DARK' : 'LIGHT'}
          </span>
          <div
            className={`relative inline-flex items-center w-11 h-6 rounded-full p-0.5 border transition-all duration-300 ${
              isDark
                ? 'bg-black/80 border-white/20'
                : 'bg-emerald-500/20 border-emerald-500/50'
            }`}
          >
            <span
              className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 ease-out transform shadow-md ${
                isDark
                  ? 'translate-x-0.5 bg-neutral-800 text-neutral-200 border border-white/20'
                  : 'translate-x-[18px] bg-emerald-500 text-black border border-emerald-400'
              }`}
            >
              {isDark ? (
                <Moon size={9} aria-hidden="true" />
              ) : (
                <Sun size={9} className="text-black" aria-hidden="true" />
              )}
            </span>
          </div>
        </div>
      </button>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Desktop Nav Variant (Interactive Animated Cyber Toggle Switch)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={isTransitioning}
      className={`group relative inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono transition-all duration-200 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/70 active:scale-95 ${
        isDark
          ? 'bg-[var(--surface)] border-[var(--border)] text-neutral-300 hover:border-white/40 hover:text-white'
          : 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-700 shadow-sm'
      } ${className}`}
      aria-label={label}
      title={label}
    >
      {/* Animated Switch Pill */}
      <div
        className={`relative inline-flex items-center w-9 h-5 rounded-full p-0.5 border transition-colors duration-300 ${
          isDark
            ? 'bg-neutral-900 border-white/20 group-hover:border-white/40'
            : 'bg-emerald-500/20 border-emerald-500/40 group-hover:border-emerald-500/70'
        }`}
      >
        <span
          className={`flex items-center justify-center w-3.5 h-3.5 rounded-full transition-all duration-300 ease-out transform shadow-sm ${
            isDark
              ? 'translate-x-0 bg-neutral-800 text-neutral-200 border border-white/20'
              : 'translate-x-3.5 bg-emerald-500 text-black border border-emerald-400'
          }`}
        >
          {isDark ? (
            <Moon size={8} className="transition-transform duration-300" aria-hidden="true" />
          ) : (
            <Sun size={8} className="transition-transform duration-300 text-black" aria-hidden="true" />
          )}
        </span>
      </div>

      {/* Label Text */}
      <span className="font-mono text-[10px] tracking-wider font-semibold min-w-[40px] text-left">
        {isTransitioning ? 'WAIT' : isDark ? 'DARK' : 'LIGHT'}
      </span>

      {/* Glowing pulse indicator while transitioning */}
      {isTransitioning && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping pointer-events-none" />
      )}
    </button>
  );
};
