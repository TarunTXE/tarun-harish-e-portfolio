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
  type: 'cactus_small' | 'cactus_double' | 'cactus_tall' | 'drone_low' | 'drone_high';
  wingFrame?: number;
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
  const { isPlaying } = useMusic();

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

  // Toggle SFX
  const toggleSfx = () => {
    const next = !sfxMuted;
    setSfxMuted(next);
    try {
      localStorage.setItem(SFX_MUTED_KEY, next.toString());
    } catch {
      // Ignore
    }
    if (!next) cyberAudio.playConfirm();
  };

  // ── Spawn Helpers ──
  const spawnObstacle = (canvasWidth: number, groundY: number) => {
    entityIdCounter.current += 1;
    const currentScore = rawScore.current;

    // Determine obstacle type based on score progression
    const canSpawnDrones = currentScore > 250;
    const roll = Math.random();

    let type: Obstacle['type'] = 'cactus_small';
    let width = 14;
    let height = 28;
    let y = groundY - height;

    if (canSpawnDrones && roll < 0.28) {
      // Flying Cyber Drone / Pterodactyl
      const isHigh = Math.random() > 0.45;
      type = isHigh ? 'drone_high' : 'drone_low';
      width = 32;
      height = 20;
      y = isHigh ? groundY - 48 : groundY - 26;
    } else if (roll < 0.55 && currentScore > 120) {
      type = 'cactus_double';
      width = 28;
      height = 30;
      y = groundY - height;
    } else if (roll < 0.72 && currentScore > 350) {
      type = 'cactus_tall';
      width = 20;
      height = 38;
      y = groundY - height;
    } else {
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
    });

    // Space out next obstacle proportionally to speed
    const minSpacing = 160 + speed.current * 16;
    const maxSpacing = 310 + speed.current * 24;
    nextSpawnDistance.current = minSpacing + Math.random() * (maxSpacing - minSpacing);
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
      obstacles.current = [];
      notes.current = [];
      particles.current = [];
      floatingTexts.current = [];
      nextSpawnDistance.current = 160;
      nextNoteDistance.current = 380;
      if (!sfxMuted) cyberAudio.playDinoJump();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
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
      obstacles.current = [];
      notes.current = [];
      particles.current = [];
      floatingTexts.current = [];
      nextSpawnDistance.current = 160;
      nextNoteDistance.current = 380;
      if (!sfxMuted) cyberAudio.playDinoJump();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      return;
    }

    if (stateRef.current === 'playing' && !isJumping.current) {
      dinoVy.current = JUMP_FORCE;
      isJumping.current = true;
      jumpHolding.current = true;
      jumpHoldFrames.current = 0;
      if (!sfxMuted) cyberAudio.playDinoJump();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    }
  }, [isInitialized, sfxMuted, showLeaderboard]);

  const handleTouchJump = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      lastTouchTime.current = Date.now();
      triggerJump();
    },
    [triggerJump]
  );

  const handleClickJump = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      // Suppress delayed synthetic click from mobile touch
      if (Date.now() - lastTouchTime.current < 450) return;
      triggerJump();
    },
    [triggerJump]
  );

  const setDuck = useCallback((ducking: boolean) => {
    if (stateRef.current !== 'playing') return;
    isDucking.current = ducking;
    if (ducking && isJumping.current) {
      // Fast fall when ducking in midair
      dinoVy.current += 3.2;
    }
  }, []);

  // ── Global Keyboard Listener ──
  useEffect(() => {
    if (!isPlaying || isDismissed) return;

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
  }, [isPlaying, isDismissed, triggerJump, setDuck, sfxMuted]);

  // ── Main Canvas Rendering Engine (60fps RAF loop) ──
  useEffect(() => {
    if (!isPlaying || isDismissed) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let running = true;

    const renderLoop = () => {
      if (!running) return;

      const currentCanvas = isArcadeModal ? arcadeCanvasRef.current : canvasRef.current;
      if (!currentCanvas) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      const c = currentCanvas.getContext('2d');
      if (!c) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Handle HiDPI scaling
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const cssW = currentCanvas.clientWidth || (isArcadeModal ? 640 : 420);
      const cssH = currentCanvas.clientHeight || (isArcadeModal ? 220 : 120);

      const targetPixelW = Math.floor(cssW * dpr);
      const targetPixelH = Math.floor(cssH * dpr);

      if (currentCanvas.width !== targetPixelW || currentCanvas.height !== targetPixelH) {
        currentCanvas.width = targetPixelW;
        currentCanvas.height = targetPixelH;
      }

      c.save();
      c.scale(dpr, dpr);
      c.imageSmoothingEnabled = false;

      const groundY = cssH - 22;

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
      if (stateRef.current === 'playing') {
        groundOffset.current = (groundOffset.current + speed.current) % 40;
      }
      c.fillStyle = 'rgba(16, 185, 129, 0.45)';
      for (let x = -groundOffset.current; x < cssW; x += 40) {
        c.fillRect(x, groundY + 4, 14, 2);
        c.fillRect(x + 22, groundY + 9, 6, 2);
      }

      // ── Game Physics & Updates ──
      if (stateRef.current === 'playing') {
        // Increment score
        rawScore.current += 0.18;
        const curScoreInt = Math.floor(rawScore.current);
        if (curScoreInt !== scoreDisplayRef.current) {
          scoreDisplayRef.current = curScoreInt;
          setScoreDisplay(curScoreInt);
        }

        // Score milestone chime (every 100 points)
        if (curScoreInt > 0 && curScoreInt % 100 === 0 && curScoreInt !== lastMilestone.current) {
          lastMilestone.current = curScoreInt;
          if (!sfxMuted) cyberAudio.playDinoScoreMilestone();
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
            dinoY.current = 0;
            dinoVy.current = 0;
            isJumping.current = false;
            jumpHolding.current = false;
            spawnDust(DINO_X + 12, groundY, 4);
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
        nextSpawnDistance.current -= speed.current;
        if (nextSpawnDistance.current <= 0) {
          spawnObstacle(cssW, groundY);
        }

        // Spawn notes
        nextNoteDistance.current -= speed.current;
        if (nextNoteDistance.current <= 0) {
          spawnNote(cssW, groundY);
        }

        // Move obstacles
        obstacles.current.forEach((obs) => {
          obs.x -= speed.current;
          if (obs.type.startsWith('drone')) {
            obs.wingFrame = (obs.wingFrame || 0) + 0.15;
          }
        });

        // Filter offscreen obstacles
        obstacles.current = obstacles.current.filter((obs) => obs.x + obs.width > -20);

        // Move notes
        notes.current.forEach((note) => {
          note.x -= speed.current;
          note.pulsePhase += 0.08;
        });
        notes.current = notes.current.filter((note) => note.x + note.width > -20);

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
              rawScore.current += 50;
              if (!sfxMuted) cyberAudio.playDinoCollect();

              entityIdCounter.current += 1;
              floatingTexts.current.push({
                id: entityIdCounter.current,
                text: '+50 BEAT',
                x: note.x,
                y: note.y - 10,
                alpha: 1,
                color: '#34D399',
              });

              for (let p = 0; p < 8; p++) {
                particles.current.push({
                  x: note.x + 8,
                  y: note.y + 8,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#34D399',
                  size: 3,
                  life: 0,
                  maxLife: 20,
                });
              }
            }
          }
        });

        // Obstacle collision check (forgiving bounding box)
        const pad = 5;
        const dinoBox = {
          left: curDinoX + pad,
          right: curDinoX + curDinoW - pad,
          top: curDinoY + pad,
          bottom: curDinoY + curDinoH - 2,
        };

        for (const obs of obstacles.current) {
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
            // CRASH!
            stateRef.current = 'gameover';
            setGameState('gameover');
            if (!sfxMuted) cyberAudio.playDinoHit();
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);

            for (let i = 0; i < 18; i++) {
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
            if (finalS > highScore) {
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
          } else {
            c.fillRect(obs.x + 5, obs.y, 8, obs.height);
            c.fillRect(obs.x, obs.y + 14, 5, 4);
            c.fillRect(obs.x, obs.y + 7, 4, 8);
            c.fillRect(obs.x + 13, obs.y + 18, 5, 4);
            c.fillRect(obs.x + 14, obs.y + 11, 4, 8);
          }
        } else {
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

      // ── Draw Player Dino ──
      const curDinoH = isDucking.current ? DUCK_H : DINO_H;
      const curDinoY = groundY - curDinoH + dinoY.current;
      const isDead = stateRef.current === 'gameover';

      drawPixelDino(
        c,
        DINO_X,
        curDinoY,
        isDucking.current,
        isJumping.current,
        runFrame.current,
        isDead
      );

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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isDismissed, isArcadeModal, isInitialized, showLeaderboard, sfxMuted]);

  // ── Helper to Draw Pixel Dino ──
  const drawPixelDino = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    ducking: boolean,
    jumping: boolean,
    rFrame: number,
    dead: boolean
  ) => {
    c.fillStyle = '#FFFFFF';
    const eyeColor = dead ? '#EF4444' : '#10B981';

    if (ducking && !jumping) {
      c.fillRect(x, y + 10, 16, 6);
      c.fillRect(x + 12, y + 8, 16, 7);
      c.fillRect(x + 26, y + 4, 14, 8);
      c.fillRect(x + 32, y + 12, 8, 3);
      c.fillStyle = eyeColor;
      c.fillRect(x + 33, y + 6, 3, 3);
      c.fillStyle = '#FFFFFF';
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
    c.fillStyle = '#FFFFFF';

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

  // ── Render Guard ──
  if (!isPlaying || isDismissed) return null;

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
                onClick={toggleSfx}
                className="p-1 text-[var(--muted)] hover:text-emerald-400 transition-colors cursor-pointer"
                title={sfxMuted ? 'Unmute SFX' : 'Mute SFX'}
              >
                {sfxMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                onClick={() => {
                  cyberAudio.playConfirm();
                  setIsArcadeModal(false);
                }}
                className="p-1 text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
                title="Exit Arcade Mode"
              >
                <Minimize2 size={15} />
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
              onTouchStart={handleTouchJump}
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
                onClick={handleClickJump}
                onTouchStart={handleTouchJump}
                className="flex-1 py-2.5 bg-emerald-500/20 active:bg-emerald-500/30 border border-emerald-500/60 rounded text-emerald-400 font-bold text-center active:scale-95 transition-transform"
              >
                JUMP 🚀
              </button>
              <button
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
                className="w-24 py-2.5 bg-[var(--surface)] active:bg-emerald-500/10 border border-[var(--border)] rounded text-[var(--foreground)] font-bold text-center active:scale-95 transition-transform select-none touch-none"
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
        <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-[var(--border)] text-[11px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-400 tracking-wider truncate">TXE RUNNER</span>

            {isInitialized && callsign && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCallsignModal();
                }}
                className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-[9px] text-emerald-400 font-bold truncate max-w-[80px] cursor-pointer transition-colors"
                title="Change Name"
              >
                {callsign} ✎
              </button>
            )}

            {/* Global Leaderboard Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                cyberAudio.playConfirm();
                setShowLeaderboard((prev) => !prev);
              }}
              className={`px-1.5 py-0.5 rounded border text-[9px] flex items-center gap-1 font-bold cursor-pointer transition-colors ${
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
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-[var(--muted)] text-[10px]">
              <Trophy size={11} className="text-amber-400 flex-shrink-0" />
              <span>{highScore.toString().padStart(5, '0')}</span>
            </div>
            <div className="text-emerald-400 font-bold text-xs tracking-wider">
              {scoreDisplay.toString().padStart(5, '0')}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 pl-1 border-l border-[var(--border)] text-[var(--muted)]">
              <button
                onClick={toggleSfx}
                className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
                title={sfxMuted ? 'Unmute SFX' : 'Mute SFX'}
                aria-label="Toggle Sound Effects"
              >
                {sfxMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <button
                onClick={() => {
                  cyberAudio.playConfirm();
                  setIsArcadeModal(true);
                }}
                className="p-1 hover:text-emerald-400 transition-colors cursor-pointer hidden sm:block"
                title="Expand to Full Arcade Cabinet"
                aria-label="Arcade Mode"
              >
                <Maximize2 size={13} />
              </button>
              <button
                onClick={() => {
                  cyberAudio.playConfirm();
                  setIsMinimized(true);
                }}
                className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Minimize Game"
                aria-label="Minimize Game"
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={() => {
                  cyberAudio.playConfirm();
                  setIsDismissed(true);
                }}
                className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                title="Close Game (resumes when music restarts)"
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
            className="relative w-full h-[110px] md:h-[120px] bg-black cursor-pointer overflow-hidden touch-none"
            onClick={handleClickJump}
            onTouchStart={handleTouchJump}
          >
            <canvas ref={canvasRef} className="w-full h-full block touch-none" />

            {gameState === 'playing' && (
              <div className="absolute top-1.5 left-2 pointer-events-none opacity-40 text-[9px] text-[var(--muted)]">
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
                onClick={() => setShowLeaderboard(true)}
                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Trophy size={11} />
                <span>LEADERBOARD</span>
              </button>
              <button
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
          <div className="flex md:hidden items-center gap-2 p-1.5 bg-[var(--surface-secondary)] border-t border-[var(--border)]">
            <button
              onClick={handleClickJump}
              onTouchStart={handleTouchJump}
              className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 bg-emerald-500/15 active:bg-emerald-500/30 border border-emerald-500/50 rounded text-emerald-400 font-bold active:scale-95 transition-all text-xs touch-none select-none cursor-pointer"
            >
              <Zap size={13} /> JUMP
            </button>
            <button
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
              className="w-20 min-h-[38px] flex items-center justify-center bg-[var(--surface)] active:bg-emerald-500/10 border border-[var(--border)] rounded text-[var(--foreground)] font-bold active:scale-95 transition-all text-xs touch-none select-none cursor-pointer"
            >
              DUCK ⬇
            </button>
            {gameState === 'gameover' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickJump(e);
                }}
                onTouchStart={handleTouchJump}
                className="px-2.5 min-h-[38px] flex items-center justify-center bg-emerald-500 text-black font-bold rounded active:scale-95 transition-all text-xs touch-none cursor-pointer"
              >
                <RotateCcw size={13} />
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
