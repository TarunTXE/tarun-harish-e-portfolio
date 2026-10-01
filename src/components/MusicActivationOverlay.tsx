import React from 'react';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

export const MusicActivationOverlay: React.FC = () => {
  const { isMusicActiveIntro } = useMusic();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isMusicActiveIntro) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Horizontal Technical Signal Beam sweeping from left to right (1.8s) */}
      <div
        className={`fixed top-[48%] h-[1.5px] music-signal-beam shadow-md pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10B981]'
            : 'bg-gradient-to-r from-transparent via-emerald-600 to-transparent shadow-[0_0_10px_#059669]'
        }`}
      />

      {/* 2. Top-right Subtle Status Ping Indicator */}
      <div className="fixed top-16 right-6 sm:right-12 px-3 py-1 rounded bg-[var(--surface)]/90 border border-[var(--border)] shadow-lg backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-[var(--foreground)] tracking-widest uppercase flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>AUDIO_SUBSYSTEM // ENGAGED</span>
      </div>
    </div>
  );
};
