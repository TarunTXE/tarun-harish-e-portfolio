import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useSoundSettings } from '../hooks/useUISound';
import { cyberAudio } from '../utils/audio';

interface MusicPlayerProps {
  variant?: 'nav' | 'compact' | 'drawer';
  className?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const {
    isPlaying,
    isAvailable,
    isMuted,
    isDinoOpen,
    volume,
    formattedTime,
    togglePlay,
    play,
    openDino,
    setVolume,
    toggleMute,
  } = useMusic();

  const { isSoundEnabled, toggleSound } = useSoundSettings();

  const [panelOpen, setPanelOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close volume popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    if (panelOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [panelOpen]);

  // Audio activation animation (~900ms)
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) {
      cyberAudio.playConfirm();
      setPanelOpen(true);
      return;
    }

    if (!isPlaying) {
      cyberAudio.playMusicStart();
      // Trigger 900ms audio activation animation
      setIsActivating(true);
      setTimeout(() => {
        setIsActivating(false);
      }, 950);
      play();
      openDino();
    } else {
      if (!isDinoOpen) {
        cyberAudio.playConfirm(true);
        openDino();
      } else {
        cyberAudio.playMusicPause();
        togglePlay();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  // 1. Mobile Drawer Variant
  if (variant === 'drawer') {
    return (
      <div className={`p-3 rounded-md border font-mono text-xs transition-colors bg-[var(--surface)] border-[var(--border)] ${className}`}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Music size={14} className={isPlaying ? 'text-emerald-500' : 'text-[var(--muted)]'} />
            <span className="font-semibold text-[var(--foreground)] uppercase tracking-wider">
              AUDIO STREAM
            </span>
          </div>
          <span className="text-[11px] text-[var(--muted)] font-mono">
            {isPlaying ? formattedTime : 'PAUSED'}
          </span>
        </div>

        {isAvailable ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 relative">
              <button
                onClick={handlePlayToggle}
                className={`flex-1 min-h-[38px] px-3 py-1.5 rounded border flex items-center justify-center gap-2 font-bold tracking-wider uppercase transition-all cursor-pointer relative overflow-hidden ${
                  isPlaying
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                    : 'bg-[var(--surface-secondary)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)]'
                }`}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
              >
                {/* Outward Signal Ripple on activation */}
                {isActivating && (
                  <span className="absolute inset-0 bg-emerald-400/20 music-pulse-ripple pointer-events-none rounded" />
                )}

                {isPlaying ? (
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-emerald-500 rounded-full music-bar-1" />
                    <span className="w-0.5 bg-emerald-500 rounded-full music-bar-2" />
                    <span className="w-0.5 bg-emerald-500 rounded-full music-bar-3" />
                    <span className="w-0.5 bg-emerald-500 rounded-full music-bar-4" />
                  </span>
                ) : (
                  <Play size={12} />
                )}
                <span>{isPlaying ? 'PAUSE MUSIC' : 'PLAY MUSIC'}</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  toggleMute();
                }}
                className="w-9 h-[38px] rounded border border-[var(--border)] bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--foreground)] transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Volume2 size={12} className="text-[var(--muted)]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-emerald-500 cursor-pointer h-1 bg-[var(--border-strong)] rounded"
                aria-label="Volume slider"
              />
              <span className="w-7 text-right text-[10px] text-[var(--muted)] font-mono">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[var(--muted)] italic">
            Audio stream offline
          </div>
        )}
      </div>
    );
  }

  // 2. Compact Icon Variant (for compact headers or floating bar)
  if (variant === 'compact') {
    return (
      <div className="relative inline-block">
        <button
          onClick={handlePlayToggle}
          onMouseEnter={() => cyberAudio.playHover()}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-xs font-mono transition-all relative overflow-hidden cursor-pointer ${
            isPlaying
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]'
          } ${className}`}
          aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {/* Signal Pulse on activation */}
          {isActivating && (
            <span className="absolute inset-0 bg-emerald-400/30 music-pulse-ripple rounded-md pointer-events-none" />
          )}

          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-3" aria-hidden="true">
              <span className="w-0.5 bg-emerald-500 rounded-full music-bar-1" />
              <span className="w-0.5 bg-emerald-500 rounded-full music-bar-2" />
              <span className="w-0.5 bg-emerald-500 rounded-full music-bar-3" />
            </span>
          ) : (
            <span className="font-mono text-xs">♪</span>
          )}
        </button>
      </div>
    );
  }

  // 3. Desktop Terminal Nav Variant: [ ♪ PLAY ] / [ ▂▅▇▅▂ PLAYING ]
  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs font-mono transition-all shadow-xs relative">
        {/* Outward Signal Pulse Ripple originating from button on activation */}
        {isActivating && (
          <span className="absolute -inset-1 bg-emerald-400/25 rounded-lg music-pulse-ripple pointer-events-none" />
        )}

        {/* Main Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          onMouseEnter={() => cyberAudio.playHover()}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 transition-colors cursor-pointer select-none relative ${
            isPlaying
              ? 'text-emerald-500 font-semibold'
              : isAvailable
              ? 'text-[var(--muted)] hover:text-[var(--foreground)]'
              : 'text-[var(--muted)] opacity-60'
          }`}
          aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <>
              {/* Subtle 5-Bar Mini Equalizer: ▂ ▅ ▇ ▅ ▂ */}
              <span className="flex items-end gap-0.5 h-3 pb-0.5" aria-hidden="true">
                <span className="w-0.5 bg-emerald-500 rounded-full music-bar-1" />
                <span className="w-0.5 bg-emerald-500 rounded-full music-bar-2" />
                <span className="w-0.5 bg-emerald-500 rounded-full music-bar-3" />
                <span className="w-0.5 bg-emerald-500 rounded-full music-bar-4" />
                <span className="w-0.5 bg-emerald-500 rounded-full music-bar-5" />
              </span>
              <span className="font-mono text-[11px] tracking-wider font-semibold text-emerald-500">
                PLAYING
              </span>
            </>
          ) : (
            <>
              <span className="font-mono text-xs text-[var(--muted)]">♪</span>
              <span className="font-mono text-[11px] tracking-wider font-semibold">
                PLAY
              </span>
            </>
          )}
        </button>

        {/* Small Volume Slider Trigger */}
        {isAvailable && (
          <button
            onClick={() => {
              cyberAudio.playClick();
              setPanelOpen(!panelOpen);
            }}
            className="px-1.5 py-1.5 border-l border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            aria-label="Audio settings"
            title="Adjust volume"
          >
            {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
          </button>
        )}
      </div>

      {/* Popover Volume Control Panel */}
      {panelOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 p-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
            <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-semibold">
              AUDIO CONTROL
            </span>
            <button
              onClick={() => {
                cyberAudio.playClick();
                toggleMute();
              }}
              className="text-[10px] text-[var(--foreground)] hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full accent-emerald-500 cursor-pointer h-1 bg-[var(--border-strong)] rounded"
              aria-label="Adjust volume"
            />
            <span className="w-8 text-right font-mono text-[10px] text-[var(--muted)]">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="mt-2 pt-1.5 border-t border-[var(--border)] text-[10px] text-[var(--muted)] font-mono flex items-center justify-between">
            <span>TXE // AMBIENT</span>
            <span>{isPlaying ? formattedTime : 'OFF'}</span>
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono">
            <span className="text-[var(--muted)] uppercase tracking-wider">UI SOUNDS</span>
            <button
              onClick={() => {
                toggleSound();
              }}
              className={`px-2 py-0.5 rounded border text-[10px] cursor-pointer transition-colors ${
                isSoundEnabled
                  ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10 font-semibold'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]'
              }`}
            >
              {isSoundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
