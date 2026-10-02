import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeTransitionOverlay: React.FC = () => {
  const { isTransitioning, transitionDirection } = useTheme();

  if (!isTransitioning) return null;

  const isToLight = transitionDirection === 'to-light';

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Backdrop wash smoothing out the theme color flip at 220ms */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isToLight ? 'bg-[#FBFBFA]/75' : 'bg-black/85'
        }`}
        style={{
          animation: 'reconfigBackdropFast 750ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 2. Radial Expanding Signal Wave originating near theme toggle (top right) */}
      <div
        className={`absolute -top-16 -right-16 rounded-full ${
          isToLight
            ? 'bg-gradient-to-br from-emerald-500/20 via-[#F5F5F2]/50 to-transparent'
            : 'bg-gradient-to-br from-emerald-500/25 via-neutral-900/70 to-transparent'
        }`}
        style={{
          width: '280vmax',
          height: '280vmax',
          transform: 'translate(50%, -50%)',
          animation: 'reconfigWaveFast 750ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      />

      {/* 3. Horizontal High-Tech Scanline Beam sweeping across viewport */}
      <div
        className={`absolute left-0 right-0 h-[2px] shadow-lg ${
          isToLight
            ? 'bg-emerald-600 shadow-[0_0_15px_#059669]'
            : 'bg-emerald-400 shadow-[0_0_15px_#10B981]'
        }`}
        style={{
          animation: 'reconfigScanFast 750ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 4. Minimal HUD Reconfiguration Readout in Center */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-3 rounded-md border shadow-2xl backdrop-blur-md font-mono text-[11px] sm:text-xs tracking-widest uppercase flex items-center gap-3 ${
          isToLight
            ? 'bg-white/95 text-neutral-900 border-neutral-300'
            : 'bg-neutral-950/95 text-white border-white/20'
        }`}
        style={{
          animation: 'reconfigHudFast 750ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <div className="flex flex-col text-left">
          <span className="font-bold">
            {isToLight
              ? 'SYS::RECONFIG // BLUEPRINT SYSTEM'
              : 'SYS::RECONFIG // DEVELOPER SYSTEM'}
          </span>
          <span className="text-[9px] opacity-60 tracking-wider">
            TRANSITIONING VISUAL SUBSYSTEMS
          </span>
        </div>
      </div>
    </div>
  );
};
