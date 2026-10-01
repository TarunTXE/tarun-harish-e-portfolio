import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
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
    volume,
    formattedTime,
    togglePlay,
    setVolume,
    toggleMute,
  } = useMusic();

  const [panelOpen, setPanelOpen] = useState(false);
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

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playClick();
    if (!isAvailable) {
      setPanelOpen(true);
      return;
    }
    togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  // 1. Mobile Drawer Variant
  if (variant === 'drawer') {
    return (
      <div className={`p-3 rounded-md border bg-neutral-950/80 border-white/10 dark:bg-neutral-950/80 dark:border-white/10 light:bg-white light:border-neutral-300 font-mono text-xs ${className}`}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Music size={14} className={isPlaying ? 'text-emerald-400' : 'text-neutral-400'} />
            <span className="font-semibold text-neutral-300 dark:text-neutral-300 light:text-neutral-800 uppercase tracking-wider">
              AUDIO STREAM
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {isPlaying ? formattedTime : 'PAUSED'}
          </span>
        </div>

        {isAvailable ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayToggle}
                className={`flex-1 min-h-[38px] px-3 py-1.5 rounded border flex items-center justify-center gap-2 font-bold tracking-wider uppercase transition-all ${
                  isPlaying
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/15 text-neutral-300 hover:text-white dark:bg-white/5 dark:border-white/15 light:bg-neutral-100 light:border-neutral-300 light:text-neutral-800'
                }`}
                aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'PAUSE [ ♪ ON ]' : 'PLAY [ ♪ OFF ]'}</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  toggleMute();
                }}
                className="w-9 h-[38px] rounded border border-white/15 dark:border-white/15 light:border-neutral-300 bg-white/5 dark:bg-white/5 light:bg-neutral-100 flex items-center justify-center text-neutral-300 dark:text-neutral-300 light:text-neutral-700"
                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-400">
              <span className="text-[10px] uppercase tracking-wider">VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-neutral-800 rounded"
                aria-label="Adjust music volume"
              />
              <span className="w-8 text-right font-mono text-[10px]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-neutral-400 py-1 font-mono">
            [ ♪ NO AUDIO IN /public/music/ ]
          </div>
        )}
      </div>
    );
  }

  // 2. Compact Icon Variant (for small mobile headers)
  if (variant === 'compact') {
    return (
      <button
        onClick={handlePlayToggle}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-md border text-xs font-mono transition-all duration-200 cursor-pointer ${
          isPlaying
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : 'bg-white/5 border-white/15 text-neutral-400 hover:text-white dark:border-white/15 light:border-neutral-300 light:text-neutral-700'
        } ${className}`}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        title={isPlaying ? `Playing (${formattedTime})` : 'Play background music'}
      >
        {isPlaying ? (
          <span className="flex items-center gap-0.5">
            <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
            <span className="w-0.5 h-3 bg-emerald-400 animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-150" />
          </span>
        ) : (
          <span className="font-mono text-xs">♪</span>
        )}
      </button>
    );
  }

  // 3. Desktop Terminal Nav Variant: [ ♪ PLAY ] / [ ♪ 01:24 ]
  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div className="inline-flex items-center rounded-md border border-white/15 dark:border-white/15 light:border-neutral-300 bg-white/5 dark:bg-white/5 light:bg-white text-xs font-mono transition-all shadow-sm">
        {/* Main Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          onMouseEnter={() => cyberAudio.playHover()}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 transition-colors cursor-pointer select-none ${
            isPlaying
              ? 'text-emerald-400 font-semibold'
              : isAvailable
              ? 'text-neutral-300 hover:text-white dark:text-neutral-300 dark:hover:text-white light:text-neutral-700 light:hover:text-black'
              : 'text-neutral-500 cursor-help'
          }`}
          aria-label={
            !isAvailable
              ? 'No audio file found in /public/music/'
              : isPlaying
              ? `Pause background music (${formattedTime})`
              : 'Play background music'
          }
          title={
            !isAvailable
              ? 'Custom music file portfolio.mp3 not found in /public/music/'
              : isPlaying
              ? `Audio playing: ${formattedTime} (Click to pause)`
              : 'Click to play ambient music'
          }
        >
          {isPlaying ? (
            <>
              {/* Subtle animated mini equalizer */}
              <span className="flex items-end gap-0.5 h-2.5" aria-hidden="true">
                <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse" />
                <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-75" />
                <span className="w-0.5 h-2 bg-emerald-400 animate-pulse delay-150" />
              </span>
              <span className="font-mono text-[11px] tracking-wider text-emerald-400">
                ♪ {formattedTime}
              </span>
            </>
          ) : (
            <>
              <span className="font-mono text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-500">♪</span>
              <span className="font-mono text-[11px] tracking-wider font-semibold">
                OFF
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
            className="px-1.5 py-1.5 border-l border-white/10 dark:border-white/10 light:border-neutral-200 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-black transition-colors cursor-pointer"
            aria-label="Audio volume settings"
            title="Adjust volume"
          >
            {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
          </button>
        )}
      </div>

      {/* Popover Volume Control Panel */}
      {panelOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-lg border border-white/15 dark:border-white/15 light:border-neutral-300 bg-neutral-950/95 dark:bg-neutral-950/95 light:bg-white shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-1 duration-150 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 dark:border-white/10 light:border-neutral-200">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
              AUDIO CONTROL
            </span>
            <button
              onClick={() => {
                cyberAudio.playClick();
                toggleMute();
              }}
              className="text-[10px] text-neutral-300 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
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
              className="w-full accent-emerald-500 cursor-pointer h-1 bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-200 rounded"
              aria-label="Adjust music volume"
            />
            <span className="w-8 text-right font-mono text-[10px] text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          <div className="mt-2 text-[9px] text-neutral-500 font-mono truncate">
            /public/music/portfolio.mp3
          </div>
        </div>
      )}
    </div>
  );
};
