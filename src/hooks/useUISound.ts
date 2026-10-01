import { useCallback, useState, useEffect } from 'react';
import { cyberAudio } from '../utils/audio';

export type UISoundType =
  | 'tab'
  | 'toggle'
  | 'play'
  | 'pause'
  | 'confirm'
  | 'hover'
  | 'modal'
  | 'key';

/**
 * Hook to trigger centralized TXE UI sounds
 * e.g. const playTabSound = useUISound('tab');
 */
export const useUISound = (type: UISoundType) => {
  return useCallback(
    (...args: unknown[]) => {
      switch (type) {
        case 'tab':
          cyberAudio.playTab();
          break;
        case 'toggle':
          cyberAudio.playThemeToggle(Boolean(args[0]));
          break;
        case 'play':
          cyberAudio.playMusicStart();
          break;
        case 'pause':
          cyberAudio.playMusicPause();
          break;
        case 'confirm':
          cyberAudio.playConfirm();
          break;
        case 'hover':
          cyberAudio.playHover();
          break;
        case 'modal':
          cyberAudio.playModal();
          break;
        case 'key':
          cyberAudio.playKey();
          break;
        default:
          cyberAudio.playConfirm();
          break;
      }
    },
    [type]
  );
};

/**
 * Hook to read and toggle the global UI sound effects state
 */
export const useSoundSettings = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(cyberAudio.enabled);

  useEffect(() => {
    return cyberAudio.subscribe((enabled) => {
      setIsSoundEnabled(enabled);
    });
  }, []);

  const toggleSound = useCallback(() => {
    return cyberAudio.toggle();
  }, []);

  const setSound = useCallback((enabled: boolean) => {
    cyberAudio.setEnabled(enabled);
  }, []);

  return {
    isSoundEnabled,
    toggleSound,
    setSound,
  };
};
