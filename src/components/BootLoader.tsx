import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';

interface BootLoaderProps {
  onComplete?: () => void;
}

export const BootLoader: React.FC<BootLoaderProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check sessionStorage so loader runs ONCE per browsing session
  const [shouldShow] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Check manual override via URL param (?boot=true or ?reset=true)
    const params = new URLSearchParams(window.location.search);
    const hasBootParam = params.get('boot') === 'true' || params.get('reset') === 'true';

    if (hasBootParam) {
      params.delete('boot');
      params.delete('reset');
      const cleanSearch = params.toString() ? `?${params.toString()}` : '';
      window.history.replaceState(null, '', window.location.pathname + cleanSearch);
      return true;
    }

    // Normal session check
    return sessionStorage.getItem('txeBootShown') !== 'true';
  });

  const [step, setStep] = useState<number>(0);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Expose developer reset hook in window (safe & non-intrusive)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __resetTxeBoot?: () => void }).__resetTxeBoot = () => {
        sessionStorage.removeItem('txeBootShown');
        console.log('[TXE BOOT] Boot session reset. Reload page to see the boot sequence.');
      };
    }
  }, []);

  useEffect(() => {
    if (!shouldShow) {
      if (onComplete) onComplete();
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion fast-path: 800ms
    if (prefersReducedMotion) {
      const fastTimer = setTimeout(() => {
        sessionStorage.setItem('txeBootShown', 'true');
        setIsComplete(true);
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(fastTimer);
    }

    // Precise ~4.0-second cinematic boot sequence (Target: 3.8–4.2s)
    const timers: ReturnType<typeof setTimeout>[] = [];

    // 0.3s: Tiny central point appears
    timers.push(setTimeout(() => setStep(1), 300));

    // 0.6s: Point expands into thin technical ring
    timers.push(setTimeout(() => setStep(2), 600));

    // 0.9s: "TXE" appears
    timers.push(setTimeout(() => setStep(3), 900));

    // 1.2s: "SYSTEM BOOT" appears
    timers.push(setTimeout(() => setStep(4), 1200));

    // 1.5s: "INITIALIZING DEVELOPER SYSTEM" appears + horizontal line
    timers.push(setTimeout(() => setStep(5), 1500));

    // 2.0s: CORE ........ OK
    timers.push(setTimeout(() => setStep(6), 2000));

    // 2.3s: INTERFACE ... OK
    timers.push(setTimeout(() => setStep(7), 2300));

    // 2.6s: PROJECTS .... OK
    timers.push(setTimeout(() => setStep(8), 2600));

    // 2.9s: PORTFOLIO ... OK
    timers.push(setTimeout(() => setStep(9), 2900));

    // 3.3s: SYSTEM READY ●
    timers.push(setTimeout(() => setStep(10), 3300));

    // 3.55s: Central ring expands outward & reveals actual portfolio
    timers.push(
      setTimeout(() => {
        setIsUnlocking(true);
      }, 3550)
    );

    // 4.05s: Sequence fully completed (~4.0s total); unmount loader cleanly
    timers.push(
      setTimeout(() => {
        sessionStorage.setItem('txeBootShown', 'true');
        setIsComplete(true);
        if (onComplete) onComplete();
      }, 4050)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [shouldShow, onComplete]);

  if (!shouldShow || isComplete || !mounted) return null;

  // Compute progress percentage based on step
  const progressPercent =
    step <= 1 ? 10 :
    step === 2 ? 22 :
    step === 3 ? 35 :
    step === 4 ? 48 :
    step === 5 ? 60 :
    step === 6 ? 72 :
    step === 7 ? 82 :
    step === 8 ? 90 :
    step === 9 ? 96 : 100;

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        backgroundColor: isDark ? '#000000' : '#FBFBFA',
        color: isDark ? '#FFFFFF' : '#121212',
      }}
      className={`flex items-center justify-center select-none overflow-hidden transition-all duration-500 ${
        isUnlocking ? 'txe-boot-unlocking pointer-events-none' : 'pointer-events-auto'
      }`}
      role="status"
      aria-live="polite"
      aria-label="TXE Developer System boot sequence initializing"
    >
      {/* Subtle Technical Grid Background Texture */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-20 ${
          isDark ? 'tech-grid' : 'tech-grid'
        }`}
      />

      {/* Decorative Technical Corner Brackets */}
      <div
        className={`absolute top-6 left-6 sm:top-8 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 border-t border-l pointer-events-none transition-opacity duration-500 ${
          isDark ? 'border-white/30' : 'border-black/30'
        } ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute top-6 right-6 sm:top-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-t border-r pointer-events-none transition-opacity duration-500 ${
          isDark ? 'border-white/30' : 'border-black/30'
        } ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 border-b border-l pointer-events-none transition-opacity duration-500 ${
          isDark ? 'border-white/30' : 'border-black/30'
        } ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-b border-r pointer-events-none transition-opacity duration-500 ${
          isDark ? 'border-white/30' : 'border-black/30'
        } ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Top & Bottom Technical Telemetry Metadata */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] opacity-50 uppercase whitespace-nowrap">
        TXE // BOOT_SEQUENCE • v3.0.0
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] opacity-50 uppercase whitespace-nowrap">
        CALICUT, IN • DEV_SYS_STABLE
      </div>

      {/* Expanding Iris/Aperture Ring Animation on Unlock (3.55s - 4.05s) */}
      {isUnlocking && (
        <div
          className={`absolute rounded-full border-2 txe-ring-expanding pointer-events-none ${
            isDark ? 'border-emerald-400/90' : 'border-emerald-600/90'
          }`}
          style={{ width: '130px', height: '130px' }}
        />
      )}

      {/* Center Cinematic Animation Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full px-6 text-center">
        {/* Central Circular Element */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-3">
          {/* 0.3s: Tiny central green point */}
          <span
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              isDark
                ? 'bg-emerald-400 shadow-[0_0_14px_#10B981]'
                : 'bg-emerald-600 shadow-[0_0_10px_#059669]'
            } ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          />

          {/* 0.6s: Point expands into thin technical circular outline */}
          <div
            className={`absolute inset-0 rounded-full border transition-all duration-500 ease-out ${
              isDark ? 'border-white/35' : 'border-black/35'
            } ${
              step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          />

          {/* Concentric subtle radar tick ring with slow rotation */}
          <div
            className={`absolute -inset-2 rounded-full border border-dashed transition-all duration-500 ${
              isDark ? 'border-white/20' : 'border-black/20'
            } ${step >= 2 ? 'opacity-100 scale-100 animate-[spin_12s_linear_infinite]' : 'opacity-0 scale-75'}`}
          />

          {/* 0.9s: "TXE" text appears */}
          <div
            className={`absolute inset-0 flex items-center justify-center font-mono font-black text-xl sm:text-2xl tracking-[0.25em] pl-1 transition-all duration-300 ${
              step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            TXE
          </div>
        </div>

        {/* 1.2s: "SYSTEM BOOT" label */}
        <div
          className={`font-mono text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 mb-2 ${
            isDark ? 'text-white' : 'text-black'
          } ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
        >
          SYSTEM BOOT
        </div>

        {/* 1.5s: Horizontal technical rule with live progress fill */}
        <div className="relative mb-2.5 flex items-center justify-center">
          <div
            className={`h-[1px] relative overflow-hidden transition-all duration-400 ease-out ${
              isDark ? 'bg-white/20' : 'bg-black/20'
            } ${step >= 5 ? 'w-52 sm:w-64 opacity-100' : 'w-0 opacity-0'}`}
          >
            {/* Active progress fill */}
            <div
              className={`h-full transition-all duration-300 ease-out ${
                isDark ? 'bg-emerald-400' : 'bg-emerald-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 1.5s: "INITIALIZING DEVELOPER SYSTEM" */}
        <div
          className={`font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold transition-all duration-300 mb-4 flex items-center gap-1.5 ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          } ${step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
        >
          <span>INITIALIZING DEVELOPER SYSTEM</span>
          <span className={`text-[9px] font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            [{progressPercent}%]
          </span>
        </div>

        {/* 2.0s–3.1s: Sequential Status Telemetry Lines (All visible on all screens) */}
        <div className="w-full max-w-[220px] sm:max-w-[240px] font-mono text-[11px] sm:text-xs space-y-1.5 text-left mb-4">
          {/* Check 1: CORE ........ OK (2.0s) */}
          <div
            className={`flex justify-between items-center transition-all duration-200 ${
              step >= 6 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
            }`}
          >
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>CORE</span>
            <span className="opacity-30 tracking-widest">..........</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>OK</span>
          </div>

          {/* Check 2: INTERFACE ... OK (2.3s) */}
          <div
            className={`flex justify-between items-center transition-all duration-200 ${
              step >= 7 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
            }`}
          >
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>INTERFACE</span>
            <span className="opacity-30 tracking-widest">.....</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>OK</span>
          </div>

          {/* Check 3: PROJECTS .... OK (2.6s) */}
          <div
            className={`flex justify-between items-center transition-all duration-200 ${
              step >= 8 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
            }`}
          >
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>PROJECTS</span>
            <span className="opacity-30 tracking-widest">......</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>OK</span>
          </div>

          {/* Check 4: PORTFOLIO ... OK (2.9s) */}
          <div
            className={`flex justify-between items-center transition-all duration-200 ${
              step >= 9 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
            }`}
          >
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>PORTFOLIO</span>
            <span className="opacity-30 tracking-widest">.....</span>
            <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>OK</span>
          </div>
        </div>

        {/* 3.3s: "SYSTEM READY ●" Indicator */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded border font-mono text-[11px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
            isDark
              ? 'bg-neutral-900/95 border-emerald-500/50 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.3)]'
              : 'bg-white border-emerald-600/50 text-emerald-700 shadow-sm'
          } ${
            step >= 10 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYSTEM READY</span>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
