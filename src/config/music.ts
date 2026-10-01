import portfolioMusicSrc from '../assets/portfolio.mp3';

/**
 * ==================================================================
 * TXE MUSIC PLAYER CONFIGURATION
 * ==================================================================
 * Directly imports and uses the audio file posted in src/assets/portfolio.mp3.
 * Fallback to /music/portfolio.mp3 in public folder.
 * ==================================================================
 */

export interface MusicTrackConfig {
  src: string;
  title: string;
  defaultVolume: number; // 0.0 to 1.0
}

export const MUSIC_CONFIG: MusicTrackConfig = {
  src: portfolioMusicSrc || '/music/portfolio.mp3',
  title: 'TXE // AMBIENT AUDIO',
  defaultVolume: 0.35,
};
