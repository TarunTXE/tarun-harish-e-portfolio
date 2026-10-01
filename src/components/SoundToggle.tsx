import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundSettings } from '../hooks/useUISound';
import { cyberAudio } from '../utils/audio';

interface SoundToggleProps {
  variant?: 'nav' | 'compact' | 'drawer';
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isSoundEnabled, toggleSound } = useSoundSettings();

  const handleToggle = () => {
    toggleSound();
  };

  const handleMouseEnter = () => {
    cyberAudio.playHover();
  };

  const title = isSoundEnabled
    ? 'Interface Sound Effects: ENABLED (Click to mute)'
    : 'Interface Sound Effects: MUTED (Click to enable)';

  // 1. Mobile Drawer Variant
  if (variant === 'drawer') {
    return (
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-md border font-mono text-xs transition-all cursor-pointer ${
          isSoundEnabled
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
            : 'bg-[var(--surface-secondary)] border-[var(--border)] text-[var(--muted)]'
        } ${className}`}
        aria-label={title}
        title={title}
      >
        <div className="flex items-center gap-2">
          {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span className="font-semibold uppercase tracking-wider">INTERFACE SOUNDS</span>
        </div>
        <span className="text-[11px] font-bold">
          {isSoundEnabled ? '[ ON ]' : '[ OFF ]'}
        </span>
      </button>
    );
  }

  // 2. Mobile Compact Icon Variant
  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-xs font-mono transition-all cursor-pointer ${
          isSoundEnabled
            ? 'bg-[var(--surface)] border-[var(--border)] text-emerald-500 hover:border-emerald-500/60'
            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]'
        } ${className}`}
        aria-label={title}
        title={title}
      >
        {isSoundEnabled ? (
          <Volume2 size={13} className="text-emerald-500" />
        ) : (
          <VolumeX size={13} className="text-[var(--muted)]" />
        )}
      </button>
    );
  }

  // 3. Desktop Terminal Nav Variant: [ 🔊 SFX ] / [ 🔇 SFX ]
  return (
    <button
      data-music-motion="nav-action"
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-mono transition-all cursor-pointer shadow-xs select-none ${
        isSoundEnabled
          ? 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)]'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] opacity-75'
      } ${className}`}
      aria-label={title}
      title={title}
    >
      {isSoundEnabled ? (
        <>
          <Volume2 size={12} className="text-emerald-500" />
          <span className="font-mono text-[10px] tracking-wider font-semibold text-[var(--foreground)]">
            SFX
          </span>
        </>
      ) : (
        <>
          <VolumeX size={12} className="text-[var(--muted)]" />
          <span className="font-mono text-[10px] tracking-wider font-medium text-[var(--muted)] line-through">
            SFX
          </span>
        </>
      )}
    </button>
  );
};
