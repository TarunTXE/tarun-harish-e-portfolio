import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Trophy,
  RotateCcw,
  Zap,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMusic } from '../context/MusicContext';
import { cyberAudio } from '../utils/audio';
import {
  getPlayerId,
  getStoredPlayerName,
  setStoredPlayerName,
  submitGlobalScore,
} from '../services/leaderboard';
import { DinoLeaderboardPanel } from './DinoLeaderboardPanel';

// ─── Constants & Storage ───────────────────────────────────────────────────────
const HIGH_SCORE_KEY = 'txe_dino_runner_high_score';
const SFX_MUTED_KEY = 'txe_dino_sfx_muted';

// Physics & Game Tuning
const GRAVITY = 0.68;
const JUMP_FORCE = -11.8;
const DUCK_GRAVITY = 1.35;
const BASE_SPEED = 4.8;
const MAX_SPEED = 10.8;
const DINO_X = 52;
const DINO_W = 34;
const DINO_H = 36;
const DUCK_H = 22;

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type:
    | 'cactus_small'
    | 'cactus_double'
    | 'cactus_triple'
    | 'cactus_tall'
    | 'plasma_barrier'
    | 'drone_low'
    | 'drone_high';
  wingFrame?: number;
  pulsePhase?: number;
}

interface PowerUpItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'shield' | 'multiplier' | 'slowmo' | 'invincible';
  collected: boolean;
  pulsePhase: number;
}

interface NoteItem {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  color: string;
}

export const TXEDinoRunner: React.FC = () => {
  const { isPlaying, isDinoOpen, closeDino } = useMusic();

  // ── UI States ──
  const [isMinimized, setIsMinimized] = useState(false);
  const [isArcadeModal, setIsArcadeModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [sfxMuted, setSfxMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SFX_MUTED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Reactive scores for HUD display
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  // ── Player Initialization & Callsign State ──
  const [callsign, setCallsign] = useState(() => getStoredPlayerName());
  const [isInitialized, setIsInitialized] = useState(() => {
    const stored = getStoredPlayerName();
    return Boolean(stored && stored.trim().length >= 2);
  });
  const [showCallsignModal, setShowCallsignModal] = useState(false);
  const [callsignInput, setCallsignInput] = useState('');
  const [callsignError, setCallsignError] = useState<string | null>(null);

  // ── Global Leaderboard Auto-Sync States ──
  const [autoSyncStatus, setAutoSyncStatus] = useState<
    'idle' | 'syncing' | 'synced' | 'failed'
  >('idle');
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);

  // Refs for race-condition prevention & animation loop
  const runIdRef = useRef(1);
  const lastSubmittedRunIdRef = useRef(0);
  const autoSyncStatusRef = useRef<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  const callsignRef = useRef(callsign);
  const isNewRecordRef = useRef(false);
  const lastCrashScoreRef = useRef(0);
  const highScoreRef = useRef(highScore);
  const scoreDisplayRef = useRef(0);
  const lastTouchTime = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  // Audio mute ref to prevent tearing down render loop on sound changes
  const sfxMutedRef = useRef(sfxMuted);
  useEffect(() => {
    sfxMutedRef.current = sfxMuted;
  }, [sfxMuted]);

  // When user clicks Play Music / opens Dino, reset isDismissed
  useEffect(() => {
    if (isDinoOpen) {
      setIsDismissed(false);
    }
  }, [isDinoOpen]);

  // Layout size cache to eliminate layout thrashing in render loop
  const canvasSizeRef = useRef({ w: 420, h: 120 });

  // DOM Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const arcadeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // ── Game Engine Physics (Refs for 60-120fps zero React overhead) ──
  const stateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const dinoY = useRef(0);
  const dinoVy = useRef(0);
  const isJumping = useRef(false);
  const isDucking = useRef(false);
  const jumpHolding = useRef(false);
  const jumpHoldFrames = useRef(0);
  const speed = useRef(BASE_SPEED);
  const rawScore = useRef(0);
  const lastMilestone = useRef(0);
  const runFrame = useRef(0);
  const frameTick = useRef(0);
  const groundOffset = useRef(0);
  const nextSpawnDistance = useRef(140);
  const nextNoteDistance = useRef(380);
  const nextPowerUpDistance = useRef(480);

  // Power-Ups & Gameplay Enhancements
  const powerUps = useRef<PowerUpItem[]>([]);
  const shieldActive = useRef(false);
  const multiplierTimer = useRef(0);
  const slowmoTimer = useRef(0);
  const invincibleTimer = useRef(0);
  const graceInvulnTimer = useRef(0);

  // Obstacles, Notes & Particles
  const obstacles = useRef<Obstacle[]>([]);
  const notes = useRef<NoteItem[]>([]);
  const particles = useRef<Particle[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const entityIdCounter = useRef(1);

  // Audio beat visualizer pulse
  const beatTime = useRef(0);

  // Sync stateRef with state
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  // Reset dismissal when music starts playing again
  useEffect(() => {
    if (isPlaying) {
      setIsDismissed(false);
    }
  }, [isPlaying]);

  // Toggle SFX with audio context resume and instant acoustic feedback
  const toggleSfx = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    // Direct user interaction resumes Web Audio context
    cyberAudio.resume().catch(() => {});

    setSfxMuted((prev) => {
      const next = !prev;
      sfxMutedRef.current = next;
      try {
        localStorage.setItem(SFX_MUTED_KEY, next.toString());
      } catch {
        // Ignore
      }
      if (!next) {
        // Unmuted: ensure global cyberAudio is active & give audio feedback
        cyberAudio.setEnabled(true);
        cyberAudio.playDinoCollect(true);
      }
      return next;
    });
  }, []);

  // ── Spawn Helpers ──
  const spawnObstacle = (canvasWidth: number, groundY: number) => {
    entityIdCounter.current += 1;
    const currentScore = rawScore.current;

    // Determine obstacle type based on progressive difficulty
    const canSpawnDrones = currentScore > 200;
    const canSpawnBarriers = currentScore > 380;
    const roll = Math.random();

    let type: Obstacle['type'] = 'cactus_small';
    let width = 16;
    let height = 28;
    let y = groundY - height;

    if (canSpawnBarriers && roll < 0.2) {
      // Cyber Plasma Barrier (pulsing laser beam with cyber nodes)
      type = 'plasma_barrier';
      width = 16;
      height = 38;
      y = groundY - height;
    } else if (canSpawnDrones && roll < 0.44) {
      // Flying Cyber Drone / Pterodactyl
      const isHigh = Math.random() > 0.45;
      type = isHigh ? 'drone_high' : 'drone_low';
      width = 32;
      height = 20;
      y = isHigh ? groundY - 48 : groundY - 26;
    } else if (roll < 0.65 && currentScore > 250) {
      // Triple Cactus Cluster
      type = 'cactus_triple';
      width = 42;
      height = 32;
      y = groundY - height;
    } else if (roll < 0.82 && currentScore > 100) {
      // Double Cactus
      type = 'cactus_double';
      width = 28;
      height = 30;
      y = groundY - height;
    } else if (roll < 0.92 && currentScore > 320) {
      // Giant Cactus
      type = 'cactus_tall';
      width = 20;
      height = 40;
      y = groundY - height;
    } else {
      // Standard Single Cactus
      type = 'cactus_small';
      width = 16;
      height = 28;
      y = groundY - height;
    }

    obstacles.current.push({
      id: entityIdCounter.current,
      x: canvasWidth + 20,
      y,
      width,
      height,
      type,
      wingFrame: 0,
      pulsePhase: Math.random() * Math.PI * 2,
    });

    // Space out next obstacle proportionally to speed (ensuring fair jumpability)
    const minSpacing = 165 + speed.current * 16;
    const maxSpacing = 320 + speed.current * 24;
    nextSpawnDistance.current = minSpacing + Math.random() * (maxSpacing - minSpacing);
  };

  const spawnPowerUp = (canvasWidth: number, groundY: number) => {
    entityIdCounter.current += 1;
    // Weighted selection for power-ups
    const roll = Math.random();
    let type: PowerUpItem['type'] = 'shield';
    if (roll < 0.35) {
      type = 'shield';
    } else if (roll < 0.65) {
      type = 'multiplier';
    } else if (roll < 0.85) {
      type = 'slowmo';
    } else {
      type = 'invincible';
    }

    powerUps.current.push({
      id: entityIdCounter.current,
      x: canvasWidth + 40,
      y: groundY - 42 - Math.random() * 16,
      width: 20,
      height: 20,
      type,
      collected: false,
      pulsePhase: Math.random() * Math.PI * 2,
    });

    nextPowerUpDistance.current = 650 + Math.random() * 600;
  };

  const spawnNote = (canvasWidth: number, groundY: number) => {
    entityIdCounter.current += 1;
    notes.current.push({
      id: entityIdCounter.current,
      x: canvasWidth + 40,
      y: groundY - 46 - Math.random() * 14,
      width: 18,
      height: 18,
      collected: false,
      pulsePhase: Math.random() * Math.PI * 2,
    });
    nextNoteDistance.current = 400 + Math.random() * 500;
  };

  const spawnDust = (x: number, y: number, count = 3) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x + (Math.random() * 8 - 4),
        y: y + Math.random() * 3,
        vx: -(1.5 + Math.random() * 2.5),
        vy: -(0.5 + Math.random() * 1.5),
        color: '#10b981',
        size: 2 + Math.random() * 2,
        life: 0,
        maxLife: 16 + Math.random() * 10,
      });
    }
  };

  const spawnConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8, x: 0.85 },
        colors: ['#10B981', '#34D399', '#6EE7B7', '#F59E0B'],
      });
    } catch {
      // Fallback safe
    }
  };

  // ── Auto-Score Submission Logic ──
  const triggerAutoSubmit = useCallback(async (finalScore: number, _runId: number) => {
    const currentName = getStoredPlayerName().trim() || callsignRef.current.trim();
    if (!currentName || currentName.length < 2) return;

    setAutoSyncStatus('syncing');
    autoSyncStatusRef.current = 'syncing';
    setSyncErrorMessage(null);

    try {
      const res = await submitGlobalScore(finalScore, currentName);
      setAutoSyncStatus('synced');
      autoSyncStatusRef.current = 'synced';
      setLeaderboardRefreshKey((prev) => prev + 1);

      if (res.updated && res.high_score) {
        setHighScore(res.high_score);
        try {
          localStorage.setItem(HIGH_SCORE_KEY, res.high_score.toString());
        } catch {
          // Ignore
        }
      }
    } catch (err: any) {
      console.warn('[Leaderboard Auto-Sync Notice]:', err.message);
      setAutoSyncStatus('failed');
      autoSyncStatusRef.current = 'failed';
      setSyncErrorMessage(err.message || 'LEADERBOARD SYNC FAILED');
    }
  }, []);

  const triggerAutoSubmitRef = useRef(triggerAutoSubmit);
  useEffect(() => {
    triggerAutoSubmitRef.current = triggerAutoSubmit;
  }, [triggerAutoSubmit]);

  const retryAutoSubmit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    cyberAudio.playConfirm();
    triggerAutoSubmit(lastCrashScoreRef.current, runIdRef.current);
  };

  const handleInitializePlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = callsignInput.trim();
    if (clean.length < 2 || clean.length > 16) {
      setCallsignError('Name must be 2–16 characters.');
      return;
    }

    setStoredPlayerName(clean);
    getPlayerId(); // Guarantees txe_dino_player_id exists in localStorage
    setCallsign(clean);
    callsignRef.current = clean;
    setIsInitialized(true);
    setShowCallsignModal(false);
    setCallsignError(null);
    cyberAudio.playConfirm();
  };

  const openCallsignModal = () => {
    setCallsignInput(callsign || getStoredPlayerName());
    setCallsignError(null);
    setShowCallsignModal(true);
  };

  // ── Jump & Action Trigger ──
  const triggerJump = useCallback(() => {
    // If not initialized, player must enter callsign first
    if (!isInitialized) {
      return;
    }

    // If viewing leaderboard, tapping/jumping returns to game
    if (showLeaderboard) {
      setShowLeaderboard(false);
      return;
    }

    if (stateRef.current === 'idle') {
      stateRef.current = 'playing';
      setGameState('playing');
      runIdRef.current += 1;
      setAutoSyncStatus('idle');
      autoSyncStatusRef.current = 'idle';
      setSyncErrorMessage(null);
      rawScore.current = 0;
      scoreDisplayRef.current = 0;
      setScoreDisplay(0);
      setIsNewRecord(false);
      isNewRecordRef.current = false;
      speed.current = BASE_SPEED;
      dinoY.current = 0;
      dinoVy.current = JUMP_FORCE;
      isJumping.current = true;
      isDucking.current = false;
      jumpHolding.current = true;
      jumpHoldFrames.current = 0;
      shieldActive.current = false;
      multiplierTimer.current = 0;
      slowmoTimer.current = 0;
      invincibleTimer.current = 0;
      graceInvulnTimer.current = 0;
      powerUps.current = [];
      obstacles.current = [];
      notes.current = [];
      particles.current = [];
      floatingTexts.current = [];
      nextSpawnDistance.current = 160;
      nextNoteDistance.current = 380;
      nextPowerUpDistance.current = 480;
      if (!sfxMutedRef.current) cyberAudio.playDinoJump(true);
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      } catch {}
      return;
    }

    if (stateRef.current === 'gameover') {
      // Instant Restart
      stateRef.current = 'playing';
      setGameState('playing');
      runIdRef.current += 1;
      setAutoSyncStatus('idle');
      autoSyncStatusRef.current = 'idle';
      setSyncErrorMessage(null);
      rawScore.current = 0;
      scoreDisplayRef.current = 0;
      setScoreDisplay(0);
      setIsNewRecord(false);
      isNewRecordRef.current = false;
      speed.current = BASE_SPEED;
      dinoY.current = 0;
      dinoVy.current = JUMP_FORCE;
      isJumping.current = true;
      isDucking.current = false;
      jumpHolding.current = true;
      jumpHoldFrames.current = 0;
      shieldActive.current = false;
      multiplierTimer.current = 0;
      slowmoTimer.current = 0;
      invincibleTimer.current = 0;
      graceInvulnTimer.current = 0;
      powerUps.current = [];
      obstacles.current = [];
      notes.current = [];
      particles.current = [];
      floatingTexts.current = [];
      nextSpawnDistance.current = 160;
      nextNoteDistance.current = 380;
      nextPowerUpDistance.current = 480;
      if (!sfxMutedRef.current) cyberAudio.playDinoJump(true);
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      } catch {}
      return;
    }

    if (stateRef.current === 'playing' && !isJumping.current) {
      dinoVy.current = JUMP_FORCE;
      isJumping.current = true;
      jumpHolding.current = true;
      jumpHoldFrames.current = 0;
      if (!sfxMutedRef.current) cyberAudio.playDinoJump(true);
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      } catch {}
    }
  }, [isInitialized, showLeaderboard]);

  const setDuck = useCallback((ducking: boolean) => {
    if (stateRef.current !== 'playing') return;
    isDucking.current = ducking;
    if (ducking && isJumping.current) {
      // Fast fall when ducking in midair
      dinoVy.current += 3.2;
    }
  }, []);

  // ── Mobile Tactile & Touch Gesture Handlers ──
  const handleTouchJumpStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      cyberAudio.resume().catch(() => {});
      lastTouchTime.current = Date.now();
      jumpHolding.current = true;
      jumpHoldFrames.current = 0;
      triggerJump();
    },
    [triggerJump]
  );

  const handleTouchJumpEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    jumpHolding.current = false;
  }, []);

  const handleCanvasTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      cyberAudio.resume().catch(() => {});
      lastTouchTime.current = Date.now();
      if (e.touches && e.touches[0]) {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
        isSwiping.current = false;
      }
      jumpHolding.current = true;
      jumpHoldFrames.current = 0;
      triggerJump();
    },
    [triggerJump]
  );

  const handleCanvasTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (stateRef.current !== 'playing') return;
      if (!e.touches || !e.touches[0]) return;
      const deltaY = e.touches[0].clientY - touchStartY.current;
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);

      // Downward swipe on canvas triggers DUCK
      if (deltaY > 20 && deltaY > deltaX) {
        setDuck(true);
        isSwiping.current = true;
      }
    },
    [setDuck]
  );

  const handleCanvasTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      jumpHolding.current = false;
      if (isSwiping.current) {
        setDuck(false);
        isSwiping.current = false;
      }
    },
    [setDuck]
  );

  const handleCanvasTouchCancel = useCallback(() => {
    jumpHolding.current = false;
    setDuck(false);
    isSwiping.current = false;
  }, [setDuck]);

  const handleClickJump = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      cyberAudio.resume().catch(() => {});
      // Suppress delayed synthetic click from mobile touch
      if (Date.now() - lastTouchTime.current < 450) return;
      triggerJump();
    },
    [triggerJump]
  );

  // ── Global Keyboard Listener ──
  useEffect(() => {
    if (!isDinoOpen || isDismissed) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input, textarea or contenteditable element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setDuck(true);
      } else if (e.code === 'KeyR' && stateRef.current === 'gameover') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'KeyM') {
        toggleSfx();
      } else if (e.code === 'KeyL') {
        setShowLeaderboard((prev) => !prev);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        jumpHolding.current = false;
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setDuck(false);
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isDinoOpen, isDismissed, triggerJump, setDuck, toggleSfx]);

  // ── Main Canvas Rendering Engine (Deterministic 60Hz Physics + High-FPS RAF loop) ──
  useEffect(() => {
    if (!isDinoOpen || isDismissed) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let running = true;
    const FIXED_STEP = 1000 / 60; // 16.6667ms standard tick
    let lastTime = performance.now();
    let accumulator = 0;

    const updateCanvasSize = () => {
      const c = isArcadeModal ? arcadeCanvasRef.current : canvasRef.current;
      if (!c) return;
      const rect = c.getBoundingClientRect();
      const w = Math.floor(rect.width || c.clientWidth || (isArcadeModal ? 640 : 420));
      const h = Math.floor(rect.height || c.clientHeight || (isArcadeModal ? 220 : 120));
      if (w > 0 && h > 0) {
        canvasSizeRef.current = { w, h };
      }
    };

    updateCanvasSize();

    // Use ResizeObserver for accurate sizing across normal dock, responsive mobile, and modal transitions
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize();
      });
      if (canvasRef.current) resizeObserver.observe(canvasRef.current);
      if (arcadeCanvasRef.current) resizeObserver.observe(arcadeCanvasRef.current);
      if (containerRef.current) resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateCanvasSize, { passive: true });

    const renderLoop = (timestamp: number) => {
      if (!running) return;

      const currentCanvas = isArcadeModal ? arcadeCanvasRef.current : canvasRef.current;
      if (!currentCanvas) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Check current rendered client dimensions dynamically to prevent zero-dimension / blank canvas issues
      const rect = currentCanvas.getBoundingClientRect();
      const measuredW = Math.floor(rect.width || currentCanvas.clientWidth);
      const measuredH = Math.floor(rect.height || currentCanvas.clientHeight);

      if (measuredW > 0 && measuredH > 0) {
        canvasSizeRef.current = { w: measuredW, h: measuredH };
      }

      const cssW = canvasSizeRef.current.w || (isArcadeModal ? 640 : 420);
      const cssH = canvasSizeRef.current.h || (isArcadeModal ? 220 : 120);

      // Do not attempt to render into a zero-dimension canvas
      if (cssW <= 0 || cssH <= 0) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const c = currentCanvas.getContext('2d');
      if (!c) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Delta time calculation clamped to max 100ms
      const elapsed = Math.min(timestamp - lastTime, 100);
      lastTime = timestamp;
      accumulator += elapsed;

      // Handle HiDPI scaling smoothly
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const targetPixelW = Math.floor(cssW * dpr);
      const targetPixelH = Math.floor(cssH * dpr);

      if (currentCanvas.width !== targetPixelW || currentCanvas.height !== targetPixelH) {
        currentCanvas.width = targetPixelW;
        currentCanvas.height = targetPixelH;
      }

      const groundY = cssH - 22;

      // ── Fixed Timestep Physics (Rock-solid 60Hz physics across 60Hz, 90Hz, 120Hz displays) ──
      let steps = 0;
      while (accumulator >= FIXED_STEP && steps < 5) {
        if (stateRef.current === 'playing') {
          // Slow-Motion Speed Factor & Score Multiplier
          const isSlowmo = slowmoTimer.current > 0;
          const effectiveSpeed = speed.current * (isSlowmo ? 0.6 : 1.0);
          const scoreMult = multiplierTimer.current > 0 ? 2 : 1;

          // Increment score
          rawScore.current += 0.18 * scoreMult;
          const curScoreInt = Math.floor(rawScore.current);
          if (curScoreInt !== scoreDisplayRef.current) {
            scoreDisplayRef.current = curScoreInt;
            setScoreDisplay(curScoreInt);
          }

          // Decrement power-up effect timers
          if (multiplierTimer.current > 0) multiplierTimer.current -= 1;
          if (slowmoTimer.current > 0) slowmoTimer.current -= 1;
          if (invincibleTimer.current > 0) invincibleTimer.current -= 1;
          if (graceInvulnTimer.current > 0) graceInvulnTimer.current -= 1;

          // Score milestone chime (every 100 points)
          if (curScoreInt > 0 && curScoreInt % 100 === 0 && curScoreInt !== lastMilestone.current) {
            lastMilestone.current = curScoreInt;
            if (!sfxMutedRef.current) cyberAudio.playDinoScoreMilestone(true);
          }

          // High score detection (local record in-memory during run)
          if (curScoreInt > highScoreRef.current) {
            highScoreRef.current = curScoreInt;
            setHighScore(curScoreInt);
            if (!isNewRecordRef.current) {
              isNewRecordRef.current = true;
              setIsNewRecord(true);
              spawnConfetti();
            }
          }

          // Speed ramp up smoothly
          speed.current = Math.min(MAX_SPEED, BASE_SPEED + Math.floor(rawScore.current / 100) * 0.45);

          // Scrolling ground markings
          groundOffset.current = (groundOffset.current + effectiveSpeed) % 40;

          // Jump physics
          if (isJumping.current) {
            if (jumpHolding.current && jumpHoldFrames.current < 6) {
              dinoVy.current -= 0.4;
              jumpHoldFrames.current += 1;
            }

            const currentGravity = isDucking.current ? DUCK_GRAVITY : GRAVITY;
            dinoVy.current += currentGravity;
            dinoY.current += dinoVy.current;

            if (dinoY.current >= 0) {
              const wasAirborne = isJumping.current;
              dinoY.current = 0;
              dinoVy.current = 0;
              isJumping.current = false;
              jumpHolding.current = false;
              spawnDust(DINO_X + 12, groundY, 4);
              if (wasAirborne && !sfxMutedRef.current) {
                cyberAudio.playDinoLand(true);
              }
            }
          }

          // Dino running animation cycle
          frameTick.current += 1;
          if (frameTick.current % 4 === 0) {
            runFrame.current = (runFrame.current + 1) % 4;
            if (!isJumping.current && Math.random() > 0.4) {
              spawnDust(DINO_X + 4, groundY, 1);
            }
          }

          // Spawn obstacles
          nextSpawnDistance.current -= effectiveSpeed;
          if (nextSpawnDistance.current <= 0) {
            spawnObstacle(cssW, groundY);
          }

          // Spawn notes
          nextNoteDistance.current -= effectiveSpeed;
          if (nextNoteDistance.current <= 0) {
            spawnNote(cssW, groundY);
          }

          // Spawn power-ups
          nextPowerUpDistance.current -= effectiveSpeed;
          if (nextPowerUpDistance.current <= 0) {
            spawnPowerUp(cssW, groundY);
          }

          // Move obstacles
          obstacles.current.forEach((obs) => {
            obs.x -= effectiveSpeed;
            if (obs.type.startsWith('drone')) {
              obs.wingFrame = (obs.wingFrame || 0) + 0.15;
            }
            if (obs.pulsePhase !== undefined) {
              obs.pulsePhase += 0.08;
            }
          });
          obstacles.current = obstacles.current.filter((obs) => obs.x + obs.width > -20);

          // Move notes & pulse
          notes.current.forEach((note) => {
            note.x -= effectiveSpeed;
            note.pulsePhase += 0.08;
          });
          notes.current = notes.current.filter((note) => note.x + note.width > -20);

          // Move power-ups & pulse
          powerUps.current.forEach((pu) => {
            pu.x -= effectiveSpeed;
            pu.pulsePhase += 0.08;
          });
          powerUps.current = powerUps.current.filter((pu) => pu.x + pu.width > -20);

          // ── Collision Detection ──
          const curDinoH = isDucking.current ? DUCK_H : DINO_H;
          const curDinoW = isDucking.current ? DINO_W + 6 : DINO_W;
          const curDinoY = groundY - curDinoH + dinoY.current;
          const curDinoX = DINO_X;

          // Note collection check
          notes.current.forEach((note) => {
            if (!note.collected) {
              const hitNote =
                curDinoX < note.x + note.width &&
                curDinoX + curDinoW > note.x &&
                curDinoY < note.y + note.height &&
                curDinoY + curDinoH > note.y;

              if (hitNote) {
                note.collected = true;
                const bonus = multiplierTimer.current > 0 ? 100 : 50;
                rawScore.current += bonus;
                if (!sfxMutedRef.current) cyberAudio.playDinoCollect(true);

                entityIdCounter.current += 1;
                floatingTexts.current.push({
                  id: entityIdCounter.current,
                  text: multiplierTimer.current > 0 ? '+100 2X BEAT!' : '+50 BEAT',
                  x: note.x,
                  y: note.y - 10,
                  alpha: 1,
                  color: multiplierTimer.current > 0 ? '#F59E0B' : '#34D399',
                });

                for (let p = 0; p < 8; p++) {
                  particles.current.push({
                    x: note.x + 8,
                    y: note.y + 8,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: multiplierTimer.current > 0 ? '#F59E0B' : '#34D399',
                    size: 3,
                    life: 0,
                    maxLife: 20,
                  });
                }
              }
            }
          });

          // Power-Up collection check
          powerUps.current.forEach((pu) => {
            if (!pu.collected) {
              const hit =
                curDinoX < pu.x + pu.width &&
                curDinoX + curDinoW > pu.x &&
                curDinoY < pu.y + pu.height &&
                curDinoY + curDinoH > pu.y;

              if (hit) {
                pu.collected = true;
                if (!sfxMutedRef.current) cyberAudio.playDinoPowerup(pu.type, true);

                entityIdCounter.current += 1;
                let pText = '+100 2X BOOST!';
                let pColor = '#F59E0B';

                if (pu.type === 'shield') {
                  shieldActive.current = true;
                  pText = 'SHIELD EQUIPPED!';
                  pColor = '#38BDF8';
                } else if (pu.type === 'multiplier') {
                  multiplierTimer.current = 480; // 8 seconds
                  pText = '2X SCORE (8S)!';
                  pColor = '#F59E0B';
                } else if (pu.type === 'slowmo') {
                  slowmoTimer.current = 420; // 7 seconds
                  pText = 'TIME WARP (0.6X)!';
                  pColor = '#06B6D4';
                } else if (pu.type === 'invincible') {
                  invincibleTimer.current = 300; // 5 seconds
                  pText = 'OVERDRIVE ACTIVE!';
                  pColor = '#EC4899';
                }

                floatingTexts.current.push({
                  id: entityIdCounter.current,
                  text: pText,
                  x: pu.x,
                  y: pu.y - 12,
                  alpha: 1,
                  color: pColor,
                });

                for (let p = 0; p < 12; p++) {
                  particles.current.push({
                    x: pu.x + 10,
                    y: pu.y + 10,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: pColor,
                    size: 3,
                    life: 0,
                    maxLife: 24,
                  });
                }
              }
            }
          });

          // Obstacle collision check (with Overdrive Smash & Shield Absorption)
          const pad = 5;
          const dinoBox = {
            left: curDinoX + pad,
            right: curDinoX + curDinoW - pad,
            top: curDinoY + pad,
            bottom: curDinoY + curDinoH - 2,
          };

          for (let i = obstacles.current.length - 1; i >= 0; i--) {
            const obs = obstacles.current[i];
            const obsBox = {
              left: obs.x + pad,
              right: obs.x + obs.width - pad,
              top: obs.y + pad,
              bottom: obs.y + obs.height - pad,
            };

            if (
              dinoBox.right > obsBox.left &&
              dinoBox.left < obsBox.right &&
              dinoBox.bottom > obsBox.top &&
              dinoBox.top < obsBox.bottom
            ) {
              // 1. Invincibility / Overdrive active: smash obstacle
              if (invincibleTimer.current > 0) {
                obstacles.current.splice(i, 1);
                rawScore.current += 30;
                if (!sfxMutedRef.current) cyberAudio.playDinoHit(true);

                entityIdCounter.current += 1;
                floatingTexts.current.push({
                  id: entityIdCounter.current,
                  text: '+30 SMASH!',
                  x: obs.x,
                  y: obs.y - 8,
                  alpha: 1,
                  color: '#EC4899',
                });

                for (let p = 0; p < 14; p++) {
                  particles.current.push({
                    x: obs.x + obs.width / 2,
                    y: obs.y + obs.height / 2,
                    vx: (Math.random() - 0.5) * 7,
                    vy: (Math.random() - 0.5) * 7,
                    color: '#EC4899',
                    size: 3,
                    life: 0,
                    maxLife: 20,
                  });
                }
                continue;
              }

              // 2. Grace invulnerability active: ignore hit
              if (graceInvulnTimer.current > 0) {
                continue;
              }

              // 3. Shield active: absorb hit, shatter shield & grant grace window
              if (shieldActive.current) {
                shieldActive.current = false;
                graceInvulnTimer.current = 40; // ~0.66s grace
                if (!sfxMutedRef.current) cyberAudio.playDinoShieldBreak(true);

                entityIdCounter.current += 1;
                floatingTexts.current.push({
                  id: entityIdCounter.current,
                  text: 'SHIELD BROKEN!',
                  x: curDinoX,
                  y: curDinoY - 14,
                  alpha: 1,
                  color: '#38BDF8',
                });

                for (let p = 0; p < 16; p++) {
                  particles.current.push({
                    x: curDinoX + DINO_W / 2,
                    y: curDinoY + curDinoH / 2,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: '#38BDF8',
                    size: 3,
                    life: 0,
                    maxLife: 22,
                  });
                }
                continue;
              }

              // 4. Fatal collision: Game Over
              stateRef.current = 'gameover';
              setGameState('gameover');
              if (!sfxMutedRef.current) {
                cyberAudio.playDinoHit(true);
                cyberAudio.playDinoGameOver(true);
              }
              try {
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
              } catch {}

              for (let p = 0; p < 18; p++) {
                particles.current.push({
                  x: curDinoX + DINO_W / 2,
                  y: curDinoY + curDinoH / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.7) * 6,
                  color: Math.random() > 0.5 ? '#EF4444' : '#10B981',
                  size: 2 + Math.random() * 3,
                  life: 0,
                  maxLife: 26,
                });
              }

              const finalS = Math.floor(rawScore.current);
              lastCrashScoreRef.current = finalS;
              setScoreDisplay(finalS);

              // Record check
              if (finalS > highScoreRef.current) {
                highScoreRef.current = finalS;
                setHighScore(finalS);
                setIsNewRecord(true);
                isNewRecordRef.current = true;
                try {
                  localStorage.setItem(HIGH_SCORE_KEY, finalS.toString());
                } catch {
                  // Ignore
                }
                spawnConfetti();
              } else {
                setIsNewRecord(false);
                isNewRecordRef.current = false;
              }

              // AUTO SCORE SUBMISSION (strictly once per run)
              const thisRunId = runIdRef.current;
              if (lastSubmittedRunIdRef.current !== thisRunId) {
                lastSubmittedRunIdRef.current = thisRunId;
                triggerAutoSubmitRef.current(finalS, thisRunId);
              }
              break;
            }
          }
        }

        accumulator -= FIXED_STEP;
        steps++;
      }
      if (accumulator >= FIXED_STEP) {
        accumulator = 0;
      }

      c.save();
      c.scale(dpr, dpr);
      c.imageSmoothingEnabled = false;

      // ── Background & Audio Visualizer ──
      c.fillStyle = '#080808';
      c.fillRect(0, 0, cssW, cssH);

      // Subtle background grid
      c.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      c.lineWidth = 1;
      for (let x = 0; x < cssW; x += 32) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, groundY);
        c.stroke();
      }

      // Audio beat rhythm wave / equalizer in background
      beatTime.current += 0.04;
      const beatPulse = (Math.sin(beatTime.current * 4) + 1) * 0.5;

      c.fillStyle = 'rgba(16, 185, 129, 0.07)';
      const barCount = Math.floor(cssW / 18);
      for (let i = 0; i < barCount; i++) {
        const barH = 6 + Math.sin(beatTime.current * 3 + i * 0.45) * 12 * (0.6 + beatPulse * 0.4);
        c.fillRect(i * 18 + 4, groundY - barH - 4, 8, barH);
      }

      // ── Ground Line & Cyber Dashes ──
      c.strokeStyle = '#10B981';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, groundY);
      c.lineTo(cssW, groundY);
      c.stroke();

      // Scrolling ground markings
      c.fillStyle = 'rgba(16, 185, 129, 0.45)';
      for (let x = -groundOffset.current; x < cssW; x += 40) {
        c.fillRect(x, groundY + 4, 14, 2);
        c.fillRect(x + 22, groundY + 9, 6, 2);
      }

      // ── Draw Obstacles ──
      obstacles.current.forEach((obs) => {
        if (obs.type.startsWith('cactus')) {
          c.fillStyle = '#10B981';
          c.strokeStyle = '#34D399';
          c.lineWidth = 1;

          if (obs.type === 'cactus_small') {
            c.fillRect(obs.x + 4, obs.y, 6, obs.height);
            c.fillRect(obs.x, obs.y + 8, 4, 3);
            c.fillRect(obs.x, obs.y + 3, 3, 6);
            c.fillRect(obs.x + 10, obs.y + 11, 4, 3);
            c.fillRect(obs.x + 11, obs.y + 6, 3, 6);
          } else if (obs.type === 'cactus_double') {
            c.fillRect(obs.x + 3, obs.y + 4, 6, obs.height - 4);
            c.fillRect(obs.x + 15, obs.y, 6, obs.height);
            c.fillRect(obs.x, obs.y + 12, 4, 3);
            c.fillRect(obs.x + 21, obs.y + 9, 4, 3);
          } else if (obs.type === 'cactus_triple') {
            c.fillRect(obs.x + 2, obs.y + 6, 6, obs.height - 6);
            c.fillRect(obs.x + 14, obs.y, 7, obs.height);
            c.fillRect(obs.x + 28, obs.y + 4, 6, obs.height - 4);
            c.fillRect(obs.x, obs.y + 12, 3, 3);
            c.fillRect(obs.x + 20, obs.y + 8, 3, 3);
            c.fillRect(obs.x + 34, obs.y + 10, 3, 3);
          } else {
            // Cactus Tall
            c.fillRect(obs.x + 5, obs.y, 8, obs.height);
            c.fillRect(obs.x, obs.y + 14, 5, 4);
            c.fillRect(obs.x, obs.y + 7, 4, 8);
            c.fillRect(obs.x + 13, obs.y + 18, 5, 4);
            c.fillRect(obs.x + 14, obs.y + 11, 4, 8);
          }
        } else if (obs.type === 'plasma_barrier') {
          const pPhase = (obs.pulsePhase || 0) + Date.now() / 200;
          const glow = Math.sin(pPhase) * 0.3 + 0.7;
          // Cyber base emitters
          c.fillStyle = '#6366F1';
          c.fillRect(obs.x + 1, obs.y, 14, 4);
          c.fillRect(obs.x + 1, obs.y + obs.height - 4, 14, 4);
          // Pulsing laser energy beam
          c.fillStyle = `rgba(168, 85, 247, ${glow})`;
          c.fillRect(obs.x + 4, obs.y + 4, 8, obs.height - 8);
          c.fillStyle = `rgba(244, 114, 182, ${glow})`;
          c.fillRect(obs.x + 6, obs.y + 4, 4, obs.height - 8);
          c.fillStyle = '#FFFFFF';
          c.fillRect(obs.x + 7, obs.y + 4, 2, obs.height - 8);
        } else {
          // Drone (Low / High)
          const wingUp = Math.sin(obs.wingFrame || 0) > 0;
          c.fillStyle = '#F59E0B';
          c.fillRect(obs.x + 8, obs.y + 6, 16, 6);
          c.fillRect(obs.x + 22, obs.y + 4, 8, 5);
          c.fillStyle = '#10B981';
          c.fillRect(obs.x + 24, obs.y + 5, 3, 2);

          c.fillStyle = '#F59E0B';
          if (wingUp) {
            c.fillRect(obs.x + 10, obs.y - 4, 8, 10);
            c.fillRect(obs.x + 6, obs.y - 7, 6, 4);
          } else {
            c.fillRect(obs.x + 10, obs.y + 10, 8, 9);
            c.fillRect(obs.x + 6, obs.y + 17, 6, 3);
          }
        }
      });

      // ── Draw Power-Up Collectibles ──
      powerUps.current.forEach((pu) => {
        if (pu.collected) return;
        const pulse = Math.sin(pu.pulsePhase) * 2.5;
        const px = pu.x;
        const py = pu.y + pulse;

        c.save();
        if (pu.type === 'shield') {
          c.beginPath();
          c.arc(px + 10, py + 10, 9, 0, Math.PI * 2);
          c.fillStyle = 'rgba(56, 189, 248, 0.25)';
          c.fill();
          c.strokeStyle = '#38BDF8';
          c.lineWidth = 1.5;
          c.stroke();
          // Shield symbol
          c.fillStyle = '#38BDF8';
          c.fillRect(px + 7, py + 6, 6, 5);
          c.fillRect(px + 8, py + 11, 4, 3);
          c.fillRect(px + 9, py + 14, 2, 2);
        } else if (pu.type === 'multiplier') {
          c.beginPath();
          c.arc(px + 10, py + 10, 9, 0, Math.PI * 2);
          c.fillStyle = 'rgba(245, 158, 11, 0.25)';
          c.fill();
          c.strokeStyle = '#F59E0B';
          c.lineWidth = 1.5;
          c.stroke();
          // 2X text glyph
          c.fillStyle = '#F59E0B';
          c.font = 'bold 9px monospace';
          c.textAlign = 'center';
          c.fillText('2X', px + 10, py + 13);
        } else if (pu.type === 'slowmo') {
          c.beginPath();
          c.arc(px + 10, py + 10, 9, 0, Math.PI * 2);
          c.fillStyle = 'rgba(6, 182, 212, 0.25)';
          c.fill();
          c.strokeStyle = '#06B6D4';
          c.lineWidth = 1.5;
          c.stroke();
          // Hourglass glyph
          c.fillStyle = '#06B6D4';
          c.fillRect(px + 6, py + 6, 8, 2);
          c.fillRect(px + 7, py + 8, 6, 2);
          c.fillRect(px + 9, py + 10, 2, 2);
          c.fillRect(px + 7, py + 12, 6, 2);
          c.fillRect(px + 6, py + 14, 8, 2);
        } else if (pu.type === 'invincible') {
          c.beginPath();
          c.arc(px + 10, py + 10, 9, 0, Math.PI * 2);
          c.fillStyle = 'rgba(236, 72, 153, 0.3)';
          c.fill();
          c.strokeStyle = '#EC4899';
          c.lineWidth = 1.5;
          c.stroke();
          // Star glyph
          c.fillStyle = '#EC4899';
          c.fillRect(px + 9, py + 4, 2, 12);
          c.fillRect(px + 4, py + 9, 12, 2);
          c.fillRect(px + 7, py + 7, 6, 6);
        }
        c.restore();
      });

      // ── Draw Notes (Beat collectibles) ──
      notes.current.forEach((note) => {
        if (note.collected) return;
        const pulse = Math.sin(note.pulsePhase) * 2;
        c.fillStyle = '#34D399';
        c.shadowColor = '#10B981';
        c.shadowBlur = 8;

        const nx = note.x;
        const ny = note.y + pulse;
        c.fillRect(nx + 4, ny, 10, 3);
        c.fillRect(nx + 4, ny + 3, 3, 9);
        c.fillRect(nx + 11, ny + 3, 3, 9);
        c.fillRect(nx + 1, ny + 9, 6, 5);
        c.fillRect(nx + 8, ny + 9, 6, 5);

        c.shadowBlur = 0;
      });

      // ── Draw Active Power-Up HUD Indicators ──
      if (stateRef.current === 'playing') {
        let badgeX = 8;
        if (shieldActive.current) {
          c.fillStyle = 'rgba(56, 189, 248, 0.2)';
          c.strokeStyle = '#38BDF8';
          c.lineWidth = 1;
          c.strokeRect(badgeX, 6, 48, 13);
          c.fillRect(badgeX, 6, 48, 13);
          c.fillStyle = '#38BDF8';
          c.font = 'bold 8px monospace';
          c.textAlign = 'left';
          c.fillText('SHIELD', badgeX + 5, 15);
          badgeX += 53;
        }
        if (multiplierTimer.current > 0) {
          const sec = Math.ceil(multiplierTimer.current / 60);
          c.fillStyle = 'rgba(245, 158, 11, 0.2)';
          c.strokeStyle = '#F59E0B';
          c.lineWidth = 1;
          c.strokeRect(badgeX, 6, 44, 13);
          c.fillRect(badgeX, 6, 44, 13);
          c.fillStyle = '#F59E0B';
          c.font = 'bold 8px monospace';
          c.textAlign = 'left';
          c.fillText(`2X ${sec}s`, badgeX + 5, 15);
          badgeX += 49;
        }
        if (slowmoTimer.current > 0) {
          const sec = Math.ceil(slowmoTimer.current / 60);
          c.fillStyle = 'rgba(6, 182, 212, 0.2)';
          c.strokeStyle = '#06B6D4';
          c.lineWidth = 1;
          c.strokeRect(badgeX, 6, 48, 13);
          c.fillRect(badgeX, 6, 48, 13);
          c.fillStyle = '#06B6D4';
          c.font = 'bold 8px monospace';
          c.textAlign = 'left';
          c.fillText(`SLOW ${sec}s`, badgeX + 4, 15);
          badgeX += 53;
        }
        if (invincibleTimer.current > 0) {
          const sec = Math.ceil(invincibleTimer.current / 60);
          c.fillStyle = 'rgba(236, 72, 153, 0.25)';
          c.strokeStyle = '#EC4899';
          c.lineWidth = 1;
          c.strokeRect(badgeX, 6, 48, 13);
          c.fillRect(badgeX, 6, 48, 13);
          c.fillStyle = '#EC4899';
          c.font = 'bold 8px monospace';
          c.textAlign = 'left';
          c.fillText(`STAR ${sec}s`, badgeX + 4, 15);
          badgeX += 53;
        }
      }

      // ── Draw Particles ──
      particles.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        c.fillStyle = p.color;
        c.globalAlpha = alpha;
        c.fillRect(p.x, p.y, p.size, p.size);
      });
      c.globalAlpha = 1;
      particles.current = particles.current.filter((p) => p.life < p.maxLife);

      // ── Draw Floating Texts ──
      floatingTexts.current.forEach((ft) => {
        ft.y -= 0.8;
        ft.alpha -= 0.025;
        c.fillStyle = ft.color;
        c.globalAlpha = Math.max(0, ft.alpha);
        c.font = 'bold 10px monospace';
        c.fillText(ft.text, ft.x, ft.y);
      });
      c.globalAlpha = 1;
      floatingTexts.current = floatingTexts.current.filter((ft) => ft.alpha > 0);

      // ── Draw Player Dino with Auras & Invulnerability ──
      const curDinoH = isDucking.current ? DUCK_H : DINO_H;
      const curDinoY = groundY - curDinoH + dinoY.current;
      const isDead = stateRef.current === 'gameover';

      // Grace period flicker
      const isFlickering = graceInvulnTimer.current > 0 && Math.floor(Date.now() / 60) % 2 === 0;

      if (!isFlickering) {
        // Slow-Mo Motion Trail
        if (slowmoTimer.current > 0 && !isDead) {
          c.save();
          c.globalAlpha = 0.35;
          drawPixelDino(
            c,
            DINO_X - 6,
            curDinoY,
            isDucking.current,
            isJumping.current,
            runFrame.current,
            false,
            '#06B6D4'
          );
          c.restore();
        }

        // Invincible Overdrive Rainbow Particle / Aura
        if (invincibleTimer.current > 0 && !isDead) {
          c.save();
          const rainbowColors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
          const rColor = rainbowColors[Math.floor(Date.now() / 80) % rainbowColors.length];
          c.shadowColor = rColor;
          c.shadowBlur = 10;
          drawPixelDino(
            c,
            DINO_X,
            curDinoY,
            isDucking.current,
            isJumping.current,
            runFrame.current,
            false,
            rColor
          );
          c.restore();
        } else {
          drawPixelDino(
            c,
            DINO_X,
            curDinoY,
            isDucking.current,
            isJumping.current,
            runFrame.current,
            isDead
          );
        }

        // Shield Bubble Aura
        if (shieldActive.current && !isDead) {
          c.save();
          c.beginPath();
          c.arc(
            DINO_X + (isDucking.current ? 20 : 16),
            curDinoY + (isDucking.current ? 12 : 18),
            isDucking.current ? 18 : 22,
            0,
            Math.PI * 2
          );
          c.fillStyle = 'rgba(56, 189, 248, 0.2)';
          c.fill();
          c.strokeStyle = '#38BDF8';
          c.lineWidth = 1.5;
          c.stroke();
          c.restore();
        }
      }

      // ── State Overlays ──
      if (stateRef.current === 'idle') {
        c.fillStyle = 'rgba(0, 0, 0, 0.4)';
        c.fillRect(0, 0, cssW, cssH);

        c.fillStyle = '#FFFFFF';
        c.font = 'bold 12px monospace';
        c.textAlign = 'center';
        c.fillText('TXE DINO RUNNER // MUSIC MODE', cssW / 2, cssH / 2 - 10);

        const blink = Math.floor(Date.now() / 450) % 2 === 0;
        if (blink) {
          c.fillStyle = '#10B981';
          c.font = 'bold 11px monospace';
          c.fillText('PRESS SPACE OR TAP TO PLAY', cssW / 2, cssH / 2 + 12);
        }
      } else if (stateRef.current === 'gameover') {
        c.fillStyle = 'rgba(0, 0, 0, 0.65)';
        c.fillRect(0, 0, cssW, cssH);

        c.fillStyle = '#EF4444';
        c.font = 'bold 13px monospace';
        c.textAlign = 'center';
        c.fillText('SYSTEM CRASH // GAME OVER', cssW / 2, cssH / 2 - 20);

        c.fillStyle = '#FFFFFF';
        c.font = '11px monospace';
        const finalS = Math.floor(rawScore.current);
        c.fillText(
          `SCORE: ${finalS}  •  BEST: ${highScore}`,
          cssW / 2,
          cssH / 2 - 5
        );

        const currentName = callsignRef.current || 'TXE';
        if (isNewRecordRef.current) {
          c.fillStyle = '#F59E0B';
          c.font = 'bold 10px monospace';
          c.fillText('★ NEW RECORD', cssW / 2, cssH / 2 + 9);

          c.fillStyle = '#10B981';
          c.font = '10px monospace';
          const statusText =
            autoSyncStatusRef.current === 'syncing'
              ? `${currentName} // SYNCING...`
              : autoSyncStatusRef.current === 'failed'
              ? `${currentName} // SYNC FAILED`
              : `${currentName} // SCORE AUTO-SAVED`;
          c.fillText(statusText, cssW / 2, cssH / 2 + 21);
        } else {
          c.fillStyle = '#10B981';
          c.font = '10px monospace';
          const statusText =
            autoSyncStatusRef.current === 'syncing'
              ? `${currentName} // SYNCING...`
              : autoSyncStatusRef.current === 'failed'
              ? `${currentName} // SYNC FAILED`
              : `${currentName} // SCORE AUTO-SAVED`;
          c.fillText(statusText, cssW / 2, cssH / 2 + 10);
        }

        const blink = Math.floor(Date.now() / 400) % 2 === 0;
        if (blink) {
          c.fillStyle = '#9CA3AF';
          c.font = 'bold 9px monospace';
          c.fillText(
            'PRESS SPACE OR TAP TO RETRY',
            cssW / 2,
            cssH / 2 + (isNewRecordRef.current ? 33 : 24)
          );
        }
      }

      c.restore();
      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isDinoOpen, isDismissed, isArcadeModal, isInitialized, showLeaderboard]);

  // ── Helper to Draw Pixel Dino ──
  const drawPixelDino = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    ducking: boolean,
    jumping: boolean,
    rFrame: number,
    dead: boolean,
    customColor?: string
  ) => {
    c.fillStyle = customColor || '#FFFFFF';
    const eyeColor = dead ? '#EF4444' : '#10B981';

    if (ducking && !jumping) {
      c.fillRect(x, y + 10, 16, 6);
      c.fillRect(x + 12, y + 8, 16, 7);
      c.fillRect(x + 26, y + 4, 14, 8);
      c.fillRect(x + 32, y + 12, 8, 3);
      c.fillStyle = eyeColor;
      c.fillRect(x + 33, y + 6, 3, 3);
      c.fillStyle = customColor || '#FFFFFF';
      if (rFrame % 2 === 0) {
        c.fillRect(x + 10, y + 16, 4, 5);
        c.fillRect(x + 22, y + 16, 4, 3);
      } else {
        c.fillRect(x + 10, y + 16, 4, 3);
        c.fillRect(x + 22, y + 16, 4, 5);
      }
      return;
    }

    c.fillRect(x + 10, y + 0, 14, 2);
    c.fillRect(x + 8, y + 2, 18, 2);
    c.fillRect(x + 8, y + 4, 20, 4);
    c.fillRect(x + 8, y + 8, 12, 2);
    c.fillRect(x + 8, y + 10, 18, 2);
    c.fillRect(x + 8, y + 12, 9, 2);

    c.fillStyle = eyeColor;
    if (dead) {
      c.fillRect(x + 13, y + 4, 2, 2);
      c.fillRect(x + 16, y + 4, 2, 2);
      c.fillRect(x + 14, y + 6, 2, 2);
      c.fillRect(x + 13, y + 8, 2, 2);
      c.fillRect(x + 16, y + 8, 2, 2);
    } else {
      c.fillRect(x + 13, y + 4, 3, 3);
    }
    c.fillStyle = customColor || '#FFFFFF';

    c.fillRect(x + 14, y + 12, 12, 2);
    c.fillRect(x + 17, y + 14, 8, 2);

    c.fillRect(x + 6, y + 14, 8, 3);
    c.fillRect(x + 5, y + 17, 10, 4);
    c.fillRect(x + 18, y + 17, 3, 3);
    c.fillRect(x + 19, y + 20, 2, 3);

    c.fillRect(x + 2, y + 18, 4, 3);
    c.fillRect(x + 0, y + 21, 17, 4);
    c.fillRect(x + 2, y + 25, 14, 2);
    c.fillRect(x + 4, y + 27, 10, 2);

    if (jumping) {
      c.fillRect(x + 6, y + 29, 3, 3);
      c.fillRect(x + 4, y + 32, 4, 2);
      c.fillRect(x + 12, y + 29, 3, 3);
      c.fillRect(x + 10, y + 32, 4, 2);
    } else if (rFrame === 1) {
      c.fillRect(x + 4, y + 29, 3, 4);
      c.fillRect(x + 2, y + 33, 4, 2);
      c.fillRect(x + 12, y + 29, 3, 5);
      c.fillRect(x + 14, y + 34, 4, 2);
    } else if (rFrame === 3) {
      c.fillRect(x + 6, y + 29, 3, 5);
      c.fillRect(x + 7, y + 34, 4, 2);
      c.fillRect(x + 12, y + 29, 3, 4);
      c.fillRect(x + 13, y + 33, 4, 2);
    } else {
      c.fillRect(x + 6, y + 29, 3, 5);
      c.fillRect(x + 6, y + 34, 4, 2);
      c.fillRect(x + 12, y + 29, 3, 5);
      c.fillRect(x + 12, y + 34, 4, 2);
    }
  };

  // ── Render Guard: ONLY visible when isDinoOpen is TRUE and not dismissed ──
  if (!isDinoOpen || isDismissed) {
    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Minimized Pill Badge
  // ─────────────────────────────────────────────────────────────────────────────
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+56px)] md:bottom-6 right-3 md:right-8 z-[45] animate-in fade-in slide-in-from-bottom-2 select-none"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          onClick={() => {
            cyberAudio.playConfirm();
            setIsMinimized(false);
          }}
          className="group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[var(--surface)]/95 border border-[var(--border-strong)] text-[var(--foreground)] shadow-xl backdrop-blur-md hover:border-emerald-500/60 hover:shadow-emerald-500/10 transition-all cursor-pointer font-mono text-xs active:scale-95"
          aria-label="Expand Dino Runner Mini Game"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-500 font-bold tracking-wider">🦖 TXE RUNNER</span>
          <span className="text-[var(--muted)]">|</span>
          <span className="font-semibold">{scoreDisplay.toString().padStart(5, '0')}</span>
          <span className="text-[10px] text-emerald-400 group-hover:translate-y-[-1px] transition-transform">
            [PLAY 🎮]
          </span>
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Full Arcade Cabinet Modal
  // ─────────────────────────────────────────────────────────────────────────────
  if (isArcadeModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
        <div className="relative w-full max-w-2xl max-h-[94vh] bg-[var(--surface)] border border-emerald-500/50 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono my-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-black/40 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-bold text-xs tracking-wider">
                TXE CYBER ARCADE // DINO RUNNER
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              {/* Leaderboard toggle in arcade header */}
              <button
                onClick={() => {
                  cyberAudio.playConfirm();
                  setShowLeaderboard((prev) => !prev);
                }}
                className={`px-2 py-1 rounded border flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                  showLeaderboard
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-black/40 border-[var(--border)] text-[var(--muted)] hover:text-white'
                }`}
                title="Global Leaderboard"
              >
                <Trophy size={13} className="text-amber-400" />
                <span>{showLeaderboard ? 'GAME' : 'LEADERBOARD'}</span>
              </button>

              {isInitialized && callsign && (
                <button
                  onClick={openCallsignModal}
                  className="px-2 py-0.5 rounded bg-black/40 hover:bg-emerald-500/15 border border-[var(--border)] hover:border-emerald-500/40 text-xs text-emerald-400 font-bold cursor-pointer transition-colors flex items-center gap-1"
                  title="Change Name"
                >
                  <span>{callsign}</span>
                  <span className="text-[10px] text-[var(--muted)]">✎</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 text-[var(--muted)]">
                <Trophy size={13} className="text-amber-400" />
                <span>HI: {highScore.toString().padStart(5, '0')}</span>
              </div>
              <div className="text-emerald-400 font-bold">
                SCORE: {scoreDisplay.toString().padStart(5, '0')}
              </div>
              <button
                type="button"
                onClick={toggleSfx}
                onTouchEnd={(e) => e.stopPropagation()}
                className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 touch-manipulation active:scale-95 ${
                  sfxMuted
                    ? 'text-[var(--muted)] hover:text-white bg-black/40 border border-[var(--border)]'
                    : 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                }`}
                title={sfxMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                aria-label={sfxMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              >
                {sfxMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span className="hidden sm:inline text-[11px] font-bold">
                  {sfxMuted ? 'MUTED' : 'SFX'}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cyberAudio.playConfirm(true);
                  setIsArcadeModal(false);
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                className="p-1.5 rounded hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-95"
                title="Exit Arcade Mode"
              >
                <Minimize2 size={15} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cyberAudio.playConfirm(true);
                  setIsDismissed(true);
                  setIsArcadeModal(false);
                  closeDino();
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                className="p-1.5 rounded hover:bg-white/10 text-[var(--muted)] hover:text-red-400 transition-colors cursor-pointer touch-manipulation active:scale-95"
                title="Close Game Panel"
                aria-label="Close Game Panel"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Large Game View: Player Initialization OR Leaderboard OR Game Canvas */}
          {!isInitialized ? (
            <div className="w-full h-[220px] sm:h-[260px] bg-black flex flex-col items-center justify-center p-6 text-center font-mono">
              <div className="text-xs text-emerald-500 font-bold tracking-widest mb-1">
                TXE CYBER ARCADE
              </div>
              <div className="text-[10px] text-[var(--muted)] tracking-wider mb-2">
                // DINO RUNNER
              </div>
              <div className="text-sm text-emerald-400 font-bold tracking-wider mb-1">
                PLAYER INITIALIZATION
              </div>
              <p className="text-[11px] text-[var(--muted)] mb-3 uppercase tracking-wider">
                ENTER YOUR NAME
              </p>
              <form
                onSubmit={handleInitializePlayer}
                className="w-full max-w-[280px] flex flex-col gap-2.5"
              >
                <input
                  type="text"
                  autoFocus
                  placeholder="ENTER YOUR NAME"
                  maxLength={16}
                  value={callsignInput}
                  onChange={(e) => {
                    setCallsignInput(e.target.value);
                    if (callsignError) setCallsignError(null);
                  }}
                  className="w-full bg-neutral-900 border border-emerald-500/50 focus:border-emerald-400 text-emerald-400 text-center text-sm py-2 px-3 rounded uppercase font-bold tracking-wider outline-none placeholder:text-neutral-600"
                />
                <div className="flex items-center justify-between text-[10px] text-[var(--muted)] px-1">
                  <span>2–16 CHARACTERS</span>
                  <span>{callsignInput.trim().length}/16</span>
                </div>
                {callsignError && (
                  <div className="text-red-400 text-[10px] font-bold">{callsignError}</div>
                )}
                <button
                  type="submit"
                  disabled={callsignInput.trim().length < 2}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-40 text-black font-bold text-xs rounded uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  START PLAYING
                </button>
              </form>
            </div>
          ) : showLeaderboard ? (
            <div className="w-full h-[220px] sm:h-[260px] bg-black">
              <DinoLeaderboardPanel
                className="w-full h-full"
                refreshTrigger={leaderboardRefreshKey}
                currentCallsign={callsign}
                onChangeCallsign={openCallsignModal}
                onClose={() => setShowLeaderboard(false)}
              />
            </div>
          ) : (
            <div
              className="relative w-full h-[220px] sm:h-[260px] bg-black cursor-pointer select-none touch-none"
              onClick={handleClickJump}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
              onTouchCancel={handleCanvasTouchCancel}
            >
              <canvas ref={arcadeCanvasRef} className="w-full h-full block touch-none" />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] opacity-80" />
            </div>
          )}

          {/* Arcade Score Auto-Saved HUD on Game Over */}
          {gameState === 'gameover' && !showLeaderboard && isInitialized && (
            <div
              className="px-4 py-2.5 bg-neutral-950 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">{callsign}</span>
                  <button
                    onClick={openCallsignModal}
                    className="text-[10px] text-[var(--muted)] hover:text-white transition-colors"
                    title="Change Name"
                  >
                    ✎
                  </button>
                </div>
                <span className="text-[var(--muted)]">•</span>
                <span className="text-[var(--muted)] font-bold text-[11px]">SCORE:</span>
                <span className="text-white font-bold text-sm">{scoreDisplay}</span>

                {autoSyncStatus === 'syncing' && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1.5 ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    SYNCING TO LEADERBOARD...
                  </span>
                )}
                {autoSyncStatus === 'synced' && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 ml-2">
                    ✓ SCORE AUTO-SAVED
                  </span>
                )}
                {autoSyncStatus === 'failed' && (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-red-400 text-xs font-bold">
                      {syncErrorMessage || 'LEADERBOARD SYNC FAILED'}
                    </span>
                    <button
                      onClick={retryAutoSubmit}
                      className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded text-[10px] font-bold cursor-pointer"
                    >
                      RETRY
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLeaderboard(true)}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trophy size={12} />
                  <span>VIEW LEADERBOARD</span>
                </button>
                <button
                  onClick={handleClickJump}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={12} />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[var(--surface-secondary)] border-t border-[var(--border)] text-xs text-[var(--muted)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-[var(--border)]">
                <span className="text-emerald-400 font-bold">SPACE / ↑</span> JUMP
              </span>
              <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-[var(--border)]">
                <span className="text-emerald-400 font-bold">↓</span> DUCK
              </span>
              <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-[var(--border)]">
                <span className="text-emerald-400 font-bold">L</span> LEADERBOARD
              </span>
            </div>

            {/* Mobile Touch Controls inside Arcade Modal */}
            <div className="flex items-center gap-2 sm:hidden w-full pt-1">
              <button
                type="button"
                onClick={handleClickJump}
                onTouchStart={handleTouchJumpStart}
                onTouchEnd={handleTouchJumpEnd}
                onTouchCancel={() => { jumpHolding.current = false; }}
                className="flex-1 py-2.5 bg-emerald-500/20 active:bg-emerald-500/35 border border-emerald-500/60 rounded text-emerald-400 font-bold text-center active:scale-95 transition-transform touch-manipulation select-none cursor-pointer"
              >
                JUMP 🚀
              </button>
              <button
                type="button"
                onTouchStart={(e) => {
                  e.preventDefault();
                  setDuck(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setDuck(false);
                }}
                onTouchCancel={() => setDuck(false)}
                onMouseDown={() => setDuck(true)}
                onMouseUp={() => setDuck(false)}
                onMouseLeave={() => setDuck(false)}
                className="w-24 py-2.5 bg-[var(--surface)] active:bg-emerald-500/10 border border-[var(--border)] rounded text-[var(--foreground)] font-bold text-center active:scale-95 transition-transform select-none touch-none touch-manipulation cursor-pointer"
              >
                DUCK ⚡
              </button>
            </div>

            <button
              onClick={() => {
                cyberAudio.playConfirm();
                setIsArcadeModal(false);
              }}
              className="text-xs text-emerald-500 hover:underline cursor-pointer hidden sm:block"
            >
              Dock to bottom →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Compact Floating Dock Mini Game (Default View: Desktop & Mobile)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="fixed z-[42] transition-all duration-300 select-none bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+56px)] left-2.5 right-2.5 md:bottom-6 md:left-auto md:right-8 md:w-[460px]"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="bg-[var(--surface)]/95 border border-[var(--border-strong)] hover:border-emerald-500/40 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col font-mono text-xs transition-colors">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 bg-black/40 border-b border-[var(--border)] text-[11px] gap-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400 tracking-wider truncate text-[11px]">TXE</span>

            {isInitialized && callsign && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openCallsignModal();
                }}
                className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-[9px] text-emerald-400 font-bold truncate max-w-[65px] sm:max-w-[80px] cursor-pointer transition-colors"
                title="Change Name"
              >
                {callsign} ✎
              </button>
            )}

            {/* Global Leaderboard Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cyberAudio.playConfirm(true);
                setShowLeaderboard((prev) => !prev);
              }}
              className={`px-1.5 py-0.5 rounded border text-[9px] flex items-center gap-1 font-bold cursor-pointer transition-colors flex-shrink-0 ${
                showLeaderboard
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-white/5 border-[var(--border)] text-[var(--muted)] hover:text-white'
              }`}
              title="Global Leaderboard"
              aria-label="Toggle Leaderboard"
            >
              <Trophy size={10} className="text-amber-400" />
              <span>{showLeaderboard ? 'GAME' : 'RANKS'}</span>
            </button>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="hidden xs:flex items-center gap-1 text-[var(--muted)] text-[10px]">
              <Trophy size={11} className="text-amber-400 flex-shrink-0" />
              <span>{highScore.toString().padStart(5, '0')}</span>
            </div>
            <div className="text-emerald-400 font-bold text-xs tracking-wider">
              {scoreDisplay.toString().padStart(5, '0')}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 pl-1 border-l border-[var(--border)] text-[var(--muted)]">
              <button
                type="button"
                onClick={toggleSfx}
                onTouchEnd={(e) => e.stopPropagation()}
                className={`w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded transition-all cursor-pointer touch-manipulation active:scale-90 ${
                  sfxMuted
                    ? 'text-[var(--muted)] hover:text-white bg-white/5 border border-white/10'
                    : 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                }`}
                title={sfxMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
                aria-label={sfxMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              >
                {sfxMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cyberAudio.playConfirm(true);
                  setIsArcadeModal(true);
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center hover:text-emerald-400 rounded hover:bg-white/5 transition-colors cursor-pointer hidden sm:flex touch-manipulation active:scale-90"
                title="Expand to Full Arcade Cabinet"
                aria-label="Arcade Mode"
              >
                <Maximize2 size={13} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cyberAudio.playConfirm(true);
                  setIsMinimized(true);
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center hover:text-emerald-400 rounded hover:bg-white/5 transition-colors cursor-pointer touch-manipulation active:scale-90"
                title="Minimize Game"
                aria-label="Minimize Game"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cyberAudio.playConfirm(true);
                  setIsDismissed(true);
                  closeDino();
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center hover:text-red-400 rounded hover:bg-white/5 transition-colors cursor-pointer touch-manipulation active:scale-90"
                title="Close Game"
                aria-label="Close Game"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content: Player Initialization OR Leaderboard OR Game Canvas */}
        {!isInitialized ? (
          <div className="p-4 bg-black/95 flex flex-col items-center justify-center text-center font-mono">
            <div className="text-[10px] text-emerald-500 font-bold tracking-widest mb-0.5">
              TXE CYBER ARCADE
            </div>
            <div className="text-[9px] text-[var(--muted)] tracking-wider mb-2">
              // DINO RUNNER
            </div>
            <div className="text-xs text-emerald-400 font-bold tracking-wider mb-1 uppercase">
              PLAYER INITIALIZATION
            </div>
            <p className="text-[10px] text-[var(--muted)] mb-2 uppercase tracking-wider">
              ENTER YOUR NAME
            </p>
            <form
              onSubmit={handleInitializePlayer}
              className="w-full max-w-[260px] flex flex-col gap-2"
            >
              <input
                type="text"
                autoFocus
                placeholder="ENTER YOUR NAME"
                maxLength={16}
                value={callsignInput}
                onChange={(e) => {
                  setCallsignInput(e.target.value);
                  if (callsignError) setCallsignError(null);
                }}
                className="w-full bg-neutral-900 border border-emerald-500/50 focus:border-emerald-400 text-emerald-400 text-center text-xs py-1.5 px-3 rounded uppercase font-bold tracking-wider outline-none placeholder:text-neutral-600"
              />
              <div className="flex items-center justify-between text-[9px] text-[var(--muted)] px-1">
                <span>2–16 CHARACTERS</span>
                <span>{callsignInput.trim().length}/16</span>
              </div>
              {callsignError && (
                <div className="text-red-400 text-[10px] font-bold">{callsignError}</div>
              )}
              <button
                type="submit"
                disabled={callsignInput.trim().length < 2}
                className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-40 text-black font-bold text-xs rounded uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
              >
                START PLAYING
              </button>
            </form>
          </div>
        ) : showLeaderboard ? (
          <div className="w-full h-[145px] bg-black">
            <DinoLeaderboardPanel
              compact
              refreshTrigger={leaderboardRefreshKey}
              currentCallsign={callsign}
              onChangeCallsign={openCallsignModal}
              onClose={() => setShowLeaderboard(false)}
            />
          </div>
        ) : (
          <div
            className="relative w-full h-[110px] md:h-[120px] bg-black cursor-pointer overflow-hidden touch-none select-none"
            onClick={handleClickJump}
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchCancel={handleCanvasTouchCancel}
          >
            <canvas ref={canvasRef} className="w-full h-full block touch-none" />

            {gameState === 'playing' && (
              <div className="absolute top-1.5 left-2 pointer-events-none opacity-40 text-[9px] text-[var(--muted)] hidden sm:block">
                TAP OR SPACE TO JUMP
              </div>
            )}
          </div>
        )}

        {/* Game Over Auto-Saved HUD Bar */}
        {gameState === 'gameover' && !showLeaderboard && isInitialized && (
          <div
            className="p-2 bg-neutral-950 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-1.5 text-xs animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{callsign}</span>
              <button
                type="button"
                onClick={openCallsignModal}
                className="text-[9px] text-[var(--muted)] hover:text-white transition-colors"
                title="Change Name"
              >
                ✎
              </button>
              <span className="text-[var(--muted)]">•</span>
              <span className="text-[var(--muted)] text-[10px]">CRASH:</span>
              <span className="text-white font-bold">{scoreDisplay}</span>

              {autoSyncStatus === 'syncing' && (
                <span className="text-emerald-400 text-[10px] flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SYNCING...
                </span>
              )}
              {autoSyncStatus === 'synced' && (
                <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1 ml-1">
                  ✓ AUTO-SAVED
                </span>
              )}
              {autoSyncStatus === 'failed' && (
                <div className="flex items-center gap-1 ml-1">
                  <span className="text-red-400 text-[10px] font-bold">SYNC FAILED</span>
                  <button
                    type="button"
                    onClick={retryAutoSubmit}
                    className="px-1.5 py-0.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded text-[9px] font-bold cursor-pointer"
                  >
                    RETRY
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Trophy size={11} />
                <span>LEADERBOARD</span>
              </button>
              <button
                type="button"
                onClick={triggerJump}
                className="px-2.5 py-1 bg-emerald-500 text-black font-bold text-[10px] rounded hover:bg-emerald-400 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
              >
                <RotateCcw size={11} />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile Tactile Action Buttons */}
        {!showLeaderboard && isInitialized && (
          <div className="flex md:hidden items-center gap-2 p-1.5 bg-[var(--surface-secondary)] border-t border-[var(--border)] select-none">
            <button
              type="button"
              onClick={handleClickJump}
              onTouchStart={handleTouchJumpStart}
              onTouchEnd={handleTouchJumpEnd}
              onTouchCancel={() => { jumpHolding.current = false; }}
              className="flex-1 min-h-[40px] flex items-center justify-center gap-1.5 bg-emerald-500/15 active:bg-emerald-500/30 border border-emerald-500/50 rounded-lg text-emerald-400 font-bold active:scale-95 transition-all text-xs touch-none select-none cursor-pointer touch-manipulation"
            >
              <Zap size={14} /> JUMP
            </button>
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                setDuck(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setDuck(false);
              }}
              onTouchCancel={() => setDuck(false)}
              onMouseDown={() => setDuck(true)}
              onMouseUp={() => setDuck(false)}
              onMouseLeave={() => setDuck(false)}
              className="w-20 min-h-[40px] flex items-center justify-center bg-[var(--surface)] active:bg-emerald-500/10 border border-[var(--border)] rounded-lg text-[var(--foreground)] font-bold active:scale-95 transition-all text-xs touch-none select-none cursor-pointer touch-manipulation"
            >
              DUCK ⬇
            </button>
            {gameState === 'gameover' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickJump(e);
                }}
                onTouchStart={handleTouchJumpStart}
                onTouchEnd={handleTouchJumpEnd}
                className="px-3 min-h-[40px] flex items-center justify-center bg-emerald-500 text-black font-bold rounded-lg active:scale-95 transition-all text-xs touch-none cursor-pointer touch-manipulation"
                aria-label="Restart Game"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        )}

        {/* Desktop Controls Quick Hint */}
        <div className="hidden md:flex items-center justify-between px-3 py-1 bg-[var(--surface-secondary)] border-t border-[var(--border)] text-[10px] text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <span>[SPACE] JUMP</span>
            <span>•</span>
            <span>[↓] DUCK</span>
            <span>•</span>
            <span>[L] RANKS</span>
          </div>
          {isNewRecord && (
            <span className="text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
              <Sparkles size={11} /> NEW RECORD!
            </span>
          )}
        </div>
      </div>

      {/* Callsign Change Modal */}
      {showCallsignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setShowCallsignModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-neutral-950 border border-emerald-500/50 rounded-xl p-5 shadow-2xl font-mono text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCallsignModal(false)}
              className="absolute top-3 right-3 text-[var(--muted)] hover:text-white p-1 cursor-pointer"
            >
              <X size={15} />
            </button>
            <div className="text-xs text-emerald-400 font-bold tracking-wider mb-1">
              TXE CYBER ARCADE
            </div>
            <div className="text-sm text-white font-bold tracking-wider mb-4">
              UPDATE YOUR NAME
            </div>
            <form onSubmit={handleInitializePlayer} className="flex flex-col gap-2.5">
              <input
                type="text"
                autoFocus
                placeholder="ENTER YOUR NAME"
                maxLength={16}
                value={callsignInput}
                onChange={(e) => {
                  setCallsignInput(e.target.value);
                  if (callsignError) setCallsignError(null);
                }}
                className="w-full bg-black border border-emerald-500/50 focus:border-emerald-400 text-emerald-400 text-center text-sm py-2 px-3 rounded uppercase font-bold tracking-wider outline-none placeholder:text-neutral-600"
              />
              <div className="flex items-center justify-between text-[10px] text-[var(--muted)] px-1">
                <span>2–16 CHARACTERS</span>
                <span>{callsignInput.trim().length}/16</span>
              </div>
              {callsignError && (
                <div className="text-red-400 text-[10px] font-bold">{callsignError}</div>
              )}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCallsignModal(false)}
                  className="flex-1 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[var(--muted)] hover:text-white font-bold text-xs rounded border border-white/10 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={callsignInput.trim().length < 2}
                  className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs rounded cursor-pointer"
                >
                  SAVE NAME
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TXEDinoRunner;
