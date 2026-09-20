import React, { useEffect, useRef, useState } from 'react';

// Authentic developer code streams for ambient background scrolling
const DEV_CODE_LEFT = [
  'import { useState, useEffect, useMemo } from "react";',
  'const [model, setModel] = useState<TensorRT | null>(null);',
  'git push origin main --tags',
  'const landmarks = await poseDetector.estimatePoses(videoFrame);',
  'export const analyzePushupAngle = (elbow: Point, shoulder: Point) => {',
  '  const rad = Math.atan2(shoulder.y - elbow.y, shoulder.x - elbow.x);',
  '  return Math.abs((rad * 180) / Math.PI);',
  '};',
  'npm run dev // ready in 180ms on http://localhost:5173',
  'interface TelemetryHUD { fps: 60; latency: 12.4; confidence: 0.98; }',
  'git commit -m "feat(ai): Smart India Hackathon posture engine"',
  'const socket = new WebSocket("wss://api.tarun.dev/v1/stream");',
  'export default function WorkspaceBridge() { return <HUD />; }',
];

const DEV_CODE_RIGHT = [
  'npm run build // 0 warnings, 0 errors [vite v8.3.0]',
  'const { buffer, tensorShape } = useNeuralModel("sih_ensemble");',
  'git checkout -b feature/monochrome-neon-white',
  'const threshold = 0.75; // pressure relief activation trigger',
  'export async function getGitHubStats(username: "TarunTXE") {',
  '  const response = await fetch(`/api/github/${username}`);',
  '  return response.json();',
  '}',
  'const classifier = new RandomForestClassifier({ nEstimators: 100 });',
  'console.log("SYS::OK -> All services running in production.");',
  'type PoseCoordinates = { x: number; y: number; z: number; score: number };',
  'git merge feature/monochrome-neon-white --no-ff',
];

// Floating developer syntax tokens
const CODE_SNIPPETS = [
  'const',
  'npm run dev',
  'React',
  'Node.js',
  '{ }',
  '</>',
  'git push',
  'async',
  'await',
  'TypeScript',
  'import',
  'return',
  'AI/ML',
  '0101',
  'git commit',
  'fn()',
  '<div>',
  'status: 200',
];

// Binary data particles
const BINARY_BITS = ['01', '10', '0101', '1010', '1', '0', '110', '001'];

// Background terminal telemetry commands that cycle continuously
const TERMINAL_LOGS = [
  'sys.init: telemetry online [200 OK]',
  'git: branch main synced with origin',
  'pose_detection: 33 landmarks active',
  'npm: 0 vulnerabilities found',
  'bundle: client compiled in 1.74s',
  'monochrome: black + neon-white active',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'snippet' | 'binary' | 'node';
  text?: string;
  radius: number;
  alpha: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [typedLog, setTypedLog] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Background subtle terminal typing cycle
  useEffect(() => {
    if (prefersReducedMotion) return;

    let charIdx = 0;
    const targetText = `> ${TERMINAL_LOGS[activeLogIndex]}`;
    let typeInterval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      setTypedLog('');
      setIsTyping(true);

      typeInterval = setInterval(() => {
        if (charIdx < targetText.length) {
          setTypedLog(targetText.substring(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setTimeout(() => {
            setActiveLogIndex((prev) => (prev + 1) % TERMINAL_LOGS.length);
          }, 3200);
        }
      }, 45);
    }, 50);

    return () => {
      clearTimeout(timeout);
      clearInterval(typeInterval);
    };
  }, [activeLogIndex, prefersReducedMotion]);

  // Main Canvas Developer Environment Animation Loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const isMobile = window.innerWidth < 768;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth easing for desktop
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: isMobile ? 0 : 160,
      isHovered: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
      mouse.isHovered = false;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize Particles:
    // Desktop: 65 particles; Mobile: 26 particles for 60fps
    const particleCount = isMobile ? 26 : 65;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      let type: 'snippet' | 'binary' | 'node';
      let text: string | undefined;
      let radius = 2;
      let baseAlpha = 0.25;
      let vx = (Math.random() - 0.5) * 0.7;
      let vy = (Math.random() - 0.5) * 0.7;

      if (i % 3 === 0) {
        // Code Snippet Particle
        type = 'snippet';
        text = CODE_SNIPPETS[i % CODE_SNIPPETS.length];
        baseAlpha = 0.22 + Math.random() * 0.16; // 0.22 - 0.38
        vx = (Math.random() - 0.5) * 0.6;
        vy = (Math.random() - 0.5) * 0.5;
      } else if (i % 3 === 1) {
        // Binary Data Bit Particle
        type = 'binary';
        text = BINARY_BITS[i % BINARY_BITS.length];
        baseAlpha = 0.18 + Math.random() * 0.14;
        vx = (Math.random() - 0.5) * 0.4;
        vy = -0.3 - Math.random() * 0.4; // Slowly drifts upwards
      } else {
        // Network / Circuit Node Particle
        type = 'node';
        radius = 1.6 + Math.random() * 1.6;
        baseAlpha = 0.25 + Math.random() * 0.25; // 0.25 - 0.50
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        type,
        text,
        radius,
        alpha: baseAlpha,
        baseAlpha,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    // Traveling pulse packets across connected lines
    const pulsePackets: PulsePacket[] = [];
    const connectionMaxDist = isMobile ? 85 : 130;

    // Spawn pulse packets periodically on desktop
    let pulseTimer = 0;

    // Continuous Animation Frame
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate follow
      if (!isMobile) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      pulseTimer++;
      if (!isMobile && pulseTimer % 45 === 0 && particles.length > 5) {
        const fromIndex = Math.floor(Math.random() * particles.length);
        const toIndex = Math.floor(Math.random() * particles.length);
        if (fromIndex !== toIndex) {
          pulsePackets.push({
            fromIndex,
            toIndex,
            progress: 0,
            speed: 0.015 + Math.random() * 0.015,
          });
        }
      }

      // 1. Draw Connecting Circuit Lines Between Nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionMaxDist) {
            const lineAlpha = (1 - dist / connectionMaxDist) * 0.22; // Clearly visible neon line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // 2. Mouse Connection & Dynamic Interactive Wave
        if (!isMobile && mouse.isHovered) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const mouseLineAlpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${mouseLineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Gentle repellent spring
            const force = (1 - dist / mouse.radius) * 1.2;
            p1.x += (dx / (dist || 1)) * force;
            p1.y += (dy / (dist || 1)) * force;
          }
        }
      }

      // 3. Render and Update Traveling Pulse Packets
      for (let k = pulsePackets.length - 1; k >= 0; k--) {
        const pkt = pulsePackets[k];
        const pA = particles[pkt.fromIndex];
        const pB = particles[pkt.toIndex];

        if (pA && pB) {
          const dx = pB.x - pA.x;
          const dy = pB.y - pA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionMaxDist * 1.5) {
            pkt.progress += pkt.speed;
            const currentX = pA.x + dx * pkt.progress;
            const currentY = pA.y + dy * pkt.progress;

            ctx.beginPath();
            ctx.arc(currentX, currentY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            pkt.progress = 1.1;
          }
        }

        if (pkt.progress >= 1) {
          pulsePackets.splice(k, 1);
        }
      }

      // 4. Update and Draw Each Particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -60) p.x = width + 60;
        else if (p.x > width + 60) p.x = -60;

        if (p.y < -40) p.y = height + 40;
        else if (p.y > height + 40) p.y = -40;

        // Pulsation
        p.pulsePhase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.08;

        if (p.type === 'snippet' && p.text) {
          // Render floating code token in JetBrains Mono
          ctx.font = '600 12px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.12, p.alpha)})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 5;
          ctx.fillText(p.text, p.x, p.y);
          ctx.shadowBlur = 0;
        } else if (p.type === 'binary' && p.text) {
          // Render binary bit string
          ctx.font = '400 10px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, p.alpha)})`;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          // Render network circuit node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, p.alpha)})`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Developer Grid with Clear Visibility */}
      <div className="absolute inset-0 cyber-grid opacity-35" />
      <div className="absolute inset-0 cyber-dots opacity-25" />

      {/* 2. Ambient Flowing Circuit Bus Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.10] text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="circuit-flow-pattern"
            width="320"
            height="320"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 60 H160 V140 H320 M80 0 V90 H220 V220 M140 320 V250 H30 V180 M320 240 H180 V300 H320"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="6 4"
            />
            <circle cx="160" cy="60" r="3" fill="currentColor" />
            <circle cx="160" cy="140" r="2.5" fill="currentColor" />
            <circle cx="80" cy="90" r="3" fill="currentColor" />
            <circle cx="220" cy="220" r="2.5" fill="currentColor" />
            <circle cx="30" cy="180" r="3" fill="currentColor" />
            <circle cx="180" cy="240" r="2.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-flow-pattern)" />
      </svg>

      {/* 3. Clearly Visible Ambient Scrolling Code Streams (Both Desktop & Mobile) */}
      {!prefersReducedMotion && (
        <>
          {/* Left Scrolling Stream */}
          <div className="absolute left-2 sm:left-6 md:left-10 top-0 bottom-0 w-72 sm:w-84 overflow-hidden opacity-[0.14] pointer-events-none font-mono text-[11px] leading-relaxed text-neutral-300">
            <div className="animate-code-scroll-slow space-y-3">
              {DEV_CODE_LEFT.map((line, idx) => (
                <div key={`left-1-${idx}`} className="truncate">
                  <span className="text-white/40 mr-2">{String(idx + 1).padStart(2, '0')}</span>
                  {line}
                </div>
              ))}
              {DEV_CODE_LEFT.map((line, idx) => (
                <div key={`left-2-${idx}`} className="truncate">
                  <span className="text-white/40 mr-2">{String(idx + 1).padStart(2, '0')}</span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Right Scrolling Stream */}
          <div className="hidden sm:block absolute right-2 sm:right-6 md:right-10 top-0 bottom-0 w-72 sm:w-84 overflow-hidden opacity-[0.14] pointer-events-none font-mono text-[11px] leading-relaxed text-neutral-300 text-right">
            <div className="animate-code-scroll-slow-reverse space-y-3">
              {DEV_CODE_RIGHT.map((line, idx) => (
                <div key={`right-1-${idx}`} className="truncate">
                  {line}
                  <span className="text-white/40 ml-2">:{String(idx + 1).padStart(2, '0')}</span>
                </div>
              ))}
              {DEV_CODE_RIGHT.map((line, idx) => (
                <div key={`right-2-${idx}`} className="truncate">
                  {line}
                  <span className="text-white/40 ml-2">:{String(idx + 1).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 4. Interactive Living Developer Canvas (Nodes, Code Snippets, Binary Bits, Pulse Packets) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 5. Subtle Terminal Telemetry Watermark (Bottom Left) */}
      {!prefersReducedMotion && (
        <div className="hidden sm:flex items-center gap-2 absolute bottom-6 left-6 z-0 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono text-neutral-400 opacity-60">
          <span className="text-white">{typedLog}</span>
          <span className={`w-1.5 h-3 bg-white ${isTyping ? 'opacity-100' : 'animate-pulse'}`} />
        </div>
      )}

      {/* 6. Subtle Vignette - Preserves True Black without Darkening Out Background Animations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,rgba(0,0,0,0.6)_90%)] pointer-events-none" />
    </div>
  );
};
