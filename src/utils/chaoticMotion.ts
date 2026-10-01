/**
 * TXE PORTFOLIO — MOTION UTILITIES
 * Page-wide randomized movement animation has been completely replaced
 * by the ambient TXE Dino Runner music companion.
 */

export const triggerMusicMotion = () => {
  // Retained as clean no-op to maintain API stability without moving website content
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('music-motion-mode');
  }
};
