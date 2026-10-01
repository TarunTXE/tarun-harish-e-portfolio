import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { cyberAudio } from '../utils/audio';

/**
 * TXE PORTFOLIO — DINO RUNNER WITH CURSOR INTERACTION
 *
 * A small autonomous pixel-art companion that:
 *  - Roams the viewport while music plays
 *  - Detects cursor proximity and intelligently flees
 *  - Jumps + boops when "touched" by the cursor
 *  - Reacts to mobile touches
 *  - Is 100% non-blocking (pointer-events: none, fixed overlay)
 *  - Zero CPU overhead when music is paused
 */

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

type DinoState =
  | 'roaming'    // Normal autonomous exploration
  | 'alert'      // Cursor approaching — slight speed-up, about to evade
  | 'evading'    // Actively fleeing the cursor
  | 'jumping'    // Mid-jump arc
  | 'paused';    // Brief autonomous rest

// ─── Constants ────────────────────────────────────────────────────────────────

const DINO_W = 34;   // px — matches SVG width
const DINO_H = 36;   // px — matches SVG height
const BASE_SPEED_DESKTOP = 2.4;
const BASE_SPEED_MOBILE  = 1.7;
const EVADE_SPEED_MULT   = 2.2;   // Sprint multiplier while fleeing
const ALERT_SPEED_MULT   = 1.45;  // Slight acceleration in alert zone
const ALERT_RADIUS_DESKTOP  = 140; // px — cursor proximity: alert zone
const ALERT_RADIUS_MOBILE   = 90;
const TOUCH_RADIUS_DESKTOP  = 42;  // px — cursor proximity: touch/boop zone
const TOUCH_RADIUS_MOBILE   = 56;  // slightly more forgiving on mobile
const JUMP_DURATION_TICKS   = Math.PI; // full sin arc
const BOOP_COOLDOWN_MS      = 800;  // min ms between boop+jump triggers
const EVADE_RETURN_TICKS    = 90;   // frames before returning to roam after evade
const ACTION_TIMER_MIN      = 100;
const ACTION_TIMER_MAX      = 180;

// ─── Component ────────────────────────────────────────────────────────────────

export const TXEDinoRunner: React.FC = () => {
  const { isPlaying } = useMusic();

  // React state — only for visual mount/exit and particles (not 60fps values)
  const [mounted, setMounted]               = useState(false);
  const [isExiting, setIsExiting]           = useState(false);
  const [showStatusBadge, setShowStatusBadge] = useState(false);
  const [particles, setParticles]           = useState<Particle[]>([]);

  // DOM refs
  const dinoRef        = useRef<HTMLDivElement | null>(null);
  const animFrameRef   = useRef<number | null>(null);
  const particleIdRef  = useRef(0);

  // ── Cursor tracking (written from pointermove, read in RAF — no state) ──
  const cursorX = useRef(-9999);
  const cursorY = useRef(-9999); // screen-space Y (from top)

  // ── Dino physics (all in refs — zero React re-renders at 60fps) ──
  const posX          = useRef(120);
  const posY          = useRef(0);           // vertical offset from ground (jump arc, upward positive)
  const groundLaneY   = useRef(36);          // distance from viewport bottom
  const targetLaneY   = useRef(36);
  const velocityX     = useRef(BASE_SPEED_DESKTOP);
  const facingRight   = useRef(true);
  const dinoState     = useRef<DinoState>('roaming');
  const jumpProgress  = useRef(0);
  const jumpHeight    = useRef(46);
  const runFrame      = useRef(0);
  const frameTick     = useRef(0);
  const pauseTimer    = useRef(0);
  const actionTimer   = useRef(ACTION_TIMER_MIN);
  const evadeReturn   = useRef(0);           // countdown to return to roam

  // ── Interaction cooldowns ──
  const lastBoopAt = useRef(0);

  // ── Reduced motion ──
  const prefersReducedMotion = useRef(false);

  // ─── Mount / unmount driven by isPlaying ──────────────────────────────────
  useEffect(() => {
    let exitTimeout: ReturnType<typeof setTimeout>;
    let badgeTimeout: ReturnType<typeof setTimeout>;

    if (isPlaying) {
      setIsExiting(false);
      setMounted(true);
      setShowStatusBadge(true);

      // Detect reduced motion once
      prefersReducedMotion.current =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Randomise spawn
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1000;
      const isMobile = vw < 768;
      posX.current     = Math.max(50, Math.min(vw - 100, Math.random() * (vw - 200)));
      facingRight.current = Math.random() > 0.5;
      const spd = isMobile ? BASE_SPEED_MOBILE : BASE_SPEED_DESKTOP;
      velocityX.current = (facingRight.current ? 1 : -1) * (spd + Math.random() * 0.6);
      groundLaneY.current = isMobile ? 24 : 36;
      targetLaneY.current = groundLaneY.current;
      dinoState.current = 'roaming';
      posY.current = 0;
      jumpProgress.current = 0;
      actionTimer.current = ACTION_TIMER_MIN + Math.floor(Math.random() * ACTION_TIMER_MAX);

      badgeTimeout = setTimeout(() => setShowStatusBadge(false), 2600);
    } else if (mounted) {
      setIsExiting(true);
      setShowStatusBadge(false);
      exitTimeout = setTimeout(() => {
        setMounted(false);
        setIsExiting(false);
      }, 550);
    }

    return () => {
      clearTimeout(exitTimeout);
      clearTimeout(badgeTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // ─── Global pointer tracking (single listener, no state updates) ──────────
  useEffect(() => {
    if (!mounted) return;

    const onPointerMove = (e: PointerEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
    };

    // Mobile tap: treat as cursor touch at tap position for one frame
    const onPointerDown = (e: PointerEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [mounted]);

  // ─── RAF choreography + cursor-reaction loop ──────────────────────────────
  useEffect(() => {
    if (!mounted || isExiting) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const loop = () => {
      if (typeof window === 'undefined') return;

      const vw       = window.innerWidth;
      const vh       = window.innerHeight;
      const isMobile = vw < 768;
      const minX     = isMobile ? 10 : 24;
      const maxX     = isMobile ? vw - DINO_W - 10 : vw - DINO_W - 24;

      // ── Reduced motion: static, respond to touch with tiny jump only ──
      if (prefersReducedMotion.current) {
        if (dinoRef.current) {
          dinoRef.current.style.transform = `translate3d(${maxX - 20}px, 0px, 0) scaleX(-1)`;
        }
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Cursor proximity ──────────────────────────────────────────────
      // Dino screen-space position (bottom-left origin → top-left screen origin)
      const dinoScreenX  = posX.current + DINO_W / 2;
      const dinoScreenY  = vh - groundLaneY.current - posY.current - DINO_H / 2;

      const cx = cursorX.current;
      const cy = cursorY.current;
      const dx = cx - dinoScreenX;
      const dy = cy - dinoScreenY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const alertR = isMobile ? ALERT_RADIUS_MOBILE : ALERT_RADIUS_DESKTOP;
      const touchR = isMobile ? TOUCH_RADIUS_MOBILE : TOUCH_RADIUS_DESKTOP;

      const now = Date.now();
      const canBoop = now - lastBoopAt.current > BOOP_COOLDOWN_MS;

      // ── TOUCH ZONE → jump + boop + evade ─────────────────────────────
      if (dist < touchR && canBoop && dinoState.current !== 'jumping') {
        lastBoopAt.current = now;
        cyberAudio.playDinoBoop();
        cyberAudio.playDinoJump();
        spawnDust(posX.current + DINO_W / 2, groundLaneY.current);

        // Trigger jump
        dinoState.current  = 'jumping';
        jumpProgress.current = 0;
        jumpHeight.current   = (isMobile ? 34 : 50) + Math.random() * 14;

        // Escape direction: away from cursor, clamped to viewport
        const escapeDir = dx > 0 ? -1 : 1; // run opposite to cursor
        facingRight.current = escapeDir > 0;
        const spd = (isMobile ? BASE_SPEED_MOBILE : BASE_SPEED_DESKTOP) * EVADE_SPEED_MULT;
        velocityX.current = escapeDir * spd;
        evadeReturn.current = EVADE_RETURN_TICKS + 40;
      }
      // ── ALERT ZONE → speed up and steer away ─────────────────────────
      else if (dist < alertR && dist >= touchR && dinoState.current === 'roaming') {
        dinoState.current = 'alert';
        const escapeDir = dx > 0 ? -1 : 1;
        facingRight.current = escapeDir > 0;
        const spd = (isMobile ? BASE_SPEED_MOBILE : BASE_SPEED_DESKTOP) * ALERT_SPEED_MULT;
        velocityX.current = escapeDir * spd;
      }
      // ── Back to roam once cursor leaves alert zone (with evade return) ─
      else if (dist >= alertR && dinoState.current === 'alert') {
        dinoState.current = 'evading';
        evadeReturn.current = EVADE_RETURN_TICKS;
      }

      // ── Evade return countdown ─────────────────────────────────────────
      if (dinoState.current === 'evading') {
        evadeReturn.current -= 1;
        if (evadeReturn.current <= 0) {
          dinoState.current = 'roaming';
          const spd = isMobile ? BASE_SPEED_MOBILE : BASE_SPEED_DESKTOP;
          velocityX.current = (facingRight.current ? 1 : -1) * (spd + Math.random() * 0.6);
        }
      }

      // ── Paused state ───────────────────────────────────────────────────
      const isCurrentlyPaused = dinoState.current === 'paused';
      if (isCurrentlyPaused) {
        pauseTimer.current -= 1;
        if (pauseTimer.current <= 0) {
          dinoState.current = 'roaming';
          const spd = isMobile ? BASE_SPEED_MOBILE : BASE_SPEED_DESKTOP;
          velocityX.current = (facingRight.current ? 1 : -1) * (spd + Math.random() * 0.7);
        }
      }

      // ── Horizontal movement (unless paused) ───────────────────────────

      if (!isCurrentlyPaused) {
        posX.current += velocityX.current;

        // Clamp + bounce off walls
        if (posX.current >= maxX) {
          posX.current = maxX;
          if (dinoState.current !== 'evading' && dinoState.current !== 'alert') {
            facingRight.current = false;
            velocityX.current   = -Math.abs(velocityX.current);
          } else {
            // Trapped — flip and keep evading
            facingRight.current = false;
            velocityX.current   = -Math.abs(velocityX.current);
          }
          spawnDust(posX.current + DINO_W / 2, groundLaneY.current);
        } else if (posX.current <= minX) {
          posX.current = minX;
          if (dinoState.current !== 'evading' && dinoState.current !== 'alert') {
            facingRight.current = true;
            velocityX.current   = Math.abs(velocityX.current);
          } else {
            facingRight.current = true;
            velocityX.current   = Math.abs(velocityX.current);
          }
          spawnDust(posX.current + DINO_W / 2, groundLaneY.current);
        }
      }

      // ── Leg animation ─────────────────────────────────────────────────
      if (!isCurrentlyPaused && dinoState.current !== 'jumping') {
        frameTick.current += 1;
        // Faster leg cycle while evading/alert
        const framePeriod = (dinoState.current === 'evading' || dinoState.current === 'alert') ? 3 : 5;
        if (frameTick.current % framePeriod === 0) {
          runFrame.current = (runFrame.current + 1) % 4;
        }
      }

      // ── Autonomous action planner (only in roaming state) ─────────────
      if (dinoState.current === 'roaming') {
        actionTimer.current -= 1;
        if (actionTimer.current <= 0) {
          const roll = Math.random();

          if (roll < 0.26) {
            // Jump
            cyberAudio.playDinoJump();
            dinoState.current    = 'jumping';
            jumpProgress.current = 0;
            jumpHeight.current   = (isMobile ? 32 : 44) + Math.random() * 14;
            spawnDust(posX.current + DINO_W / 2, groundLaneY.current);
          } else if (roll < 0.46) {
            // Direction reversal
            facingRight.current = !facingRight.current;
            const spd = isMobile ? BASE_SPEED_MOBILE : BASE_SPEED_DESKTOP;
            velocityX.current   = (facingRight.current ? 1 : -1) * (spd + Math.random() * 0.8);
            spawnDust(posX.current + DINO_W / 2, groundLaneY.current);
          } else if (roll < 0.64) {
            // Brief pause
            dinoState.current  = 'paused';
            pauseTimer.current = 20 + Math.floor(Math.random() * 28);
            runFrame.current   = 0;
          } else if (roll < 0.84 && !isMobile) {
            // Vertical lane shift
            targetLaneY.current = targetLaneY.current > 50 ? 32 : 68;
          }

          actionTimer.current = ACTION_TIMER_MIN + Math.floor(Math.random() * ACTION_TIMER_MAX);
        }
      }

      // ── Jump arc physics ───────────────────────────────────────────────
      if (dinoState.current === 'jumping') {
        jumpProgress.current += 0.042; // ~500ms arc
        if (jumpProgress.current >= JUMP_DURATION_TICKS) {
          dinoState.current    = 'roaming';
          posY.current         = 0;
          jumpProgress.current = 0;
          spawnDust(posX.current + DINO_W / 2, groundLaneY.current);
        } else {
          posY.current = Math.sin(jumpProgress.current) * jumpHeight.current;
        }
      } else {
        posY.current = 0;
      }

      // ── Smooth vertical lane interpolation ────────────────────────────
      groundLaneY.current += (targetLaneY.current - groundLaneY.current) * 0.07;

      // ── Apply transform ───────────────────────────────────────────────
      if (dinoRef.current) {
        const flip      = facingRight.current ? 1 : -1;
        const totalY    = groundLaneY.current + posY.current;
        dinoRef.current.style.transform =
          `translate3d(${posX.current.toFixed(1)}px, -${totalY.toFixed(1)}px, 0) scaleX(${flip})`;
      }

      // ── Particle update ───────────────────────────────────────────────
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life + 1 }))
          .filter((p) => p.life < p.maxLife)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isExiting]);

  // ─── Particle spawner ─────────────────────────────────────────────────────
  const spawnDust = (x: number, groundY: number) => {
    const count = 2 + Math.floor(Math.random() * 3);
    const fresh: Particle[] = Array.from({ length: count }, () => {
      particleIdRef.current += 1;
      return {
        id:      particleIdRef.current,
        x:       x + (Math.random() * 10 - 5),
        y:       groundY + Math.random() * 4,
        vx:      Math.random() * 1.8 - 0.9,
        vy:     -(0.5 + Math.random() * 1.4),
        life:    0,
        maxLife: 14 + Math.floor(Math.random() * 10),
      };
    });
    setParticles((prev) => [...prev.slice(-14), ...fresh]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!mounted) return null;

  const isJumping     = dinoState.current === 'jumping';
  const isIdlePaused  = dinoState.current === 'paused';
  const currentFrame  = isJumping ? 'jump' : isIdlePaused ? 'idle' : runFrame.current;
  const isEvading     = dinoState.current === 'evading' || dinoState.current === 'alert';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Status badge on entrance ── */}
      {showStatusBadge && (
        <div className="absolute top-20 right-6 sm:right-10 pointer-events-none transition-all duration-500 animate-in fade-in slide-in-from-top-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--surface)]/90 border border-emerald-500/40 text-emerald-500 text-[10px] font-mono shadow-md backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="tracking-wider uppercase font-bold">MUSIC MODE // TXE DINO RUN</span>
          </div>
        </div>
      )}

      {/* ── Pixel dust particles ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-[var(--foreground)] pointer-events-none"
          style={{
            left:    `${p.x}px`,
            bottom:  `${p.y}px`,
            opacity: Math.max(0, 1 - p.life / p.maxLife) * 0.45,
          }}
        />
      ))}

      {/* ── Dino character ── */}
      <div
        ref={dinoRef}
        className={`absolute bottom-0 left-0 transition-opacity duration-300 ${
          isExiting ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="relative">
          <PixelDinoSVG frame={currentFrame} isEvading={isEvading} />

          {/* Speed lines when evading */}
          {isEvading && (
            <div
              className="absolute bottom-1 flex items-center gap-0.5 opacity-50"
              style={{ left: facingRight ? '-8px' : 'auto', right: facingRight ? 'auto' : '-8px' }}
            >
              <span className="w-2   h-0.5 bg-[var(--muted)]" />
              <span className="w-1.5 h-0.5 bg-[var(--muted)]" />
              <span className="w-1   h-0.5 bg-[var(--muted)]" />
            </div>
          )}

          {/* Subtle trail when normally running */}
          {!isEvading && !isJumping && !isIdlePaused && (
            <div
              className="absolute bottom-1 flex items-center gap-0.5 opacity-30"
              style={{ left: '-5px' }}
            >
              <span className="w-1   h-0.5 bg-[var(--muted)]" />
              <span className="w-1.5 h-0.5 bg-[var(--muted)]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Pixel Dinosaur SVG ───────────────────────────────────────────────────────

interface PixelDinoProps {
  frame: number | 'jump' | 'idle';
  isEvading?: boolean;
}

const PixelDinoSVG: React.FC<PixelDinoProps> = ({ frame, isEvading = false }) => {
  // Eye glows emerald when calm, amber when evading
  const eyeColor = isEvading ? '#f59e0b' : '#10b981';

  return (
    <svg
      width="34"
      height="36"
      viewBox="0 0 24 26"
      fill="currentColor"
      className="text-[var(--foreground)] drop-shadow-sm"
      style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated' }}
    >
      {/* === HEAD & SNOUT === */}
      <rect x="7"  y="0" width="10" height="1" />
      <rect x="6"  y="1" width="12" height="1" />
      <rect x="6"  y="2" width="13" height="1" />
      <rect x="6"  y="3" width="13" height="1" />
      <rect x="6"  y="4" width="8"  height="1" />
      <rect x="6"  y="5" width="11" height="1" />
      <rect x="6"  y="6" width="6"  height="1" />

      {/* Eye socket cutout + colored sensor pixel */}
      <rect x="9" y="2" width="2"   height="2"   fill="var(--background)" />
      <rect x="9" y="2" width="1.5" height="1.5" fill={eyeColor} />

      {/* Jaw / snout lower */}
      <rect x="9"  y="6" width="8" height="1" />
      <rect x="11" y="7" width="5" height="1" />

      {/* === NECK & CHEST === */}
      <rect x="5" y="7"  width="4" height="1" />
      <rect x="4" y="8"  width="5" height="1" />
      <rect x="4" y="9"  width="6" height="1" />
      <rect x="3" y="10" width="8" height="1" />

      {/* Tiny T-Rex arm */}
      <rect x="11" y="9"  width="2" height="1" />
      <rect x="12" y="10" width="1" height="2" />

      {/* === BODY & TAIL === */}
      <rect x="1" y="10" width="2"  height="1" />
      <rect x="0" y="11" width="11" height="1" />
      <rect x="0" y="12" width="11" height="1" />
      <rect x="1" y="13" width="9"  height="1" />
      <rect x="2" y="14" width="7"  height="1" />
      <rect x="3" y="15" width="5"  height="1" />

      {/* === DYNAMIC LEGS === */}
      {frame === 'jump' ? (
        // Jump: both legs tucked
        <>
          <rect x="4" y="16" width="2" height="2" />
          <rect x="3" y="18" width="2" height="1" />
          <rect x="7" y="16" width="2" height="2" />
          <rect x="6" y="18" width="2" height="1" />
        </>
      ) : frame === 'idle' ? (
        // Idle: both legs standing
        <>
          <rect x="4" y="16" width="2" height="3" />
          <rect x="4" y="19" width="3" height="1" />
          <rect x="7" y="16" width="2" height="3" />
          <rect x="7" y="19" width="3" height="1" />
        </>
      ) : frame === 1 ? (
        // Run A: left back, right forward
        <>
          <rect x="3" y="16" width="2" height="2" />
          <rect x="2" y="18" width="2" height="1" />
          <rect x="7" y="16" width="2" height="3" />
          <rect x="8" y="19" width="3" height="1" />
        </>
      ) : frame === 3 ? (
        // Run B: left forward, right back
        <>
          <rect x="4" y="16" width="2" height="3" />
          <rect x="5" y="19" width="3" height="1" />
          <rect x="7" y="16" width="2" height="2" />
          <rect x="8" y="18" width="2" height="1" />
        </>
      ) : (
        // Run pass-through frame (0 / 2)
        <>
          <rect x="4" y="16" width="2" height="3" />
          <rect x="4" y="19" width="2" height="1" />
          <rect x="7" y="16" width="2" height="2" />
          <rect x="7" y="18" width="3" height="1" />
        </>
      )}
    </svg>
  );
};
