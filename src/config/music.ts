/**
 * ==================================================================
 * TXE MUSIC PLAYER CONFIGURATION
 * ==================================================================
 * To add or change your custom background music:
 * 1. Place your audio file in: /public/music/
 * 2. Update `src` below to match your filename.
 * 
 * Example:
 *   src: '/music/portfolio.mp3'
 *
 * The player uses the native HTML5 Audio API with `preload="metadata"`.
 * Default state is always PAUSED to respect browser autoplay policies.
 * ==================================================================
 */

export interface MusicTrackConfig {
  src: string;
  title: string;
  defaultVolume: number; // 0.0 to 1.0
}

export const MUSIC_CONFIG: MusicTrackConfig = {
  src: '/music/portfolio.mp3',
  title: 'TXE // AMBIENT AUDIO',
  defaultVolume: 0.4,
};
