import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { MUSIC_CONFIG } from '../config/music';

interface MusicContextType {
  isPlaying: boolean;
  isAvailable: boolean;
  isMuted: boolean;
  isMusicActiveIntro: boolean;
  hasActivatedOnce: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  formattedTime: string;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const VOLUME_STORAGE_KEY = 'txe-music-volume';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicActiveIntro, setIsMusicActiveIntro] = useState(false);
  const [hasActivatedOnce, setHasActivatedOnce] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          return parsed;
        }
      }
    }
    return MUSIC_CONFIG.defaultVolume;
  });

  useEffect(() => {
    // Native HTML5 Audio instance
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.loop = true;
    audio.volume = volume;
    audio.src = MUSIC_CONFIG.src;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsAvailable(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsMusicActiveIntro(false);
    };

    const handleError = () => {
      // Audio file not present or unplayable - graceful fallback
      setIsAvailable(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      if (introTimerRef.current) clearTimeout(introTimerRef.current);
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  const play = () => {
    if (!audioRef.current) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger page-wide activation sequence (1.5-2.2s initial, 800ms resume)
    const isFirstTime = !hasActivatedOnce;
    setHasActivatedOnce(true);

    if (introTimerRef.current) clearTimeout(introTimerRef.current);

    setIsPlaying(true);
    setIsMusicActiveIntro(true);
    const introDuration = prefersReducedMotion ? 400 : isFirstTime ? 2200 : 1000;

    introTimerRef.current = setTimeout(() => {
      setIsMusicActiveIntro(false);
    }, introDuration);

    // Audio starts immediately without delay
    audioRef.current
      .play()
      .catch((err) => {
        console.warn('[MusicPlayer] Audio play notice:', err.message);
      });
  };

  const pause = () => {
    if (!audioRef.current) return;
    if (introTimerRef.current) clearTimeout(introTimerRef.current);
    setIsMusicActiveIntro(false);
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
    } catch {
      // Ignore
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isAvailable,
        isMuted,
        isMusicActiveIntro,
        hasActivatedOnce,
        volume,
        currentTime,
        duration,
        formattedTime: formatTime(currentTime),
        togglePlay,
        play,
        pause,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
