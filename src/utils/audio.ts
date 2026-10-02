/**
 * TXE PORTFOLIO - UI SOUND SYSTEM
 * All sounds procedurally synthesised via Web Audio API.
 * MASTER_VOL = 0.45 - clearly audible, non-intrusive.
 * DynamicsCompressor on every path. AudioContext resumed inline.
 */

type SoundListener = (enabled: boolean) => void;

const MASTER_VOL = 0.45;

class CyberAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private listeners: Set<SoundListener> = new Set();
  private lastHoverTime: number = 0;
  private lastClickTime: number = 0;
  private lastJumpSfxTime: number = 0;
  private lastBoopTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('txe_ui_sounds_enabled');
        this.enabled = stored !== null ? stored === 'true' : true;
      } catch {
        this.enabled = true;
      }
      const warmUp = () => {
        this.getCtx();
        window.removeEventListener('pointerdown', warmUp);
        window.removeEventListener('keydown', warmUp);
      };
      window.addEventListener('pointerdown', warmUp, { passive: true });
      window.addEventListener('keydown', warmUp, { passive: true });
    }
  }

  private getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctor) { try { this.ctx = new Ctor(); } catch { return null; } }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private makeComp(ctx: AudioContext): DynamicsCompressorNode {
    const c = ctx.createDynamicsCompressor();
    c.threshold.value = -10; c.knee.value = 6;
    c.ratio.value = 4; c.attack.value = 0.003; c.release.value = 0.1;
    c.connect(ctx.destination);
    return c;
  }

  public subscribe(listener: SoundListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => { try { fn(this.enabled); } catch {} });
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    try { localStorage.setItem('txe_ui_sounds_enabled', enabled ? 'true' : 'false'); } catch {}
    this.notify();
    if (enabled) this.playConfirm();
  }

  public toggle(): boolean { this.setEnabled(!this.enabled); return this.enabled; }

  public playTab(): void {
    if (!this.enabled) return;
    const now = Date.now(); if (now - this.lastClickTime < 50) return; this.lastClickTime = now;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const oA = ctx.createOscillator(); const gA = ctx.createGain();
      oA.type = 'triangle'; oA.frequency.setValueAtTime(2400,t); oA.frequency.exponentialRampToValueAtTime(900,t+0.022);
      gA.gain.setValueAtTime(0.6*MASTER_VOL,t); gA.gain.exponentialRampToValueAtTime(0.0001,t+0.025);
      oA.connect(gA); gA.connect(comp); oA.start(t); oA.stop(t+0.03);
      const oB = ctx.createOscillator(); const gB = ctx.createGain();
      oB.type = 'sine'; oB.frequency.setValueAtTime(1700,t+0.012); oB.frequency.exponentialRampToValueAtTime(960,t+0.11);
      gB.gain.setValueAtTime(0.42*MASTER_VOL,t+0.012); gB.gain.exponentialRampToValueAtTime(0.0001,t+0.11);
      oB.connect(gB); gB.connect(comp); oB.start(t+0.012); oB.stop(t+0.12);
    } catch {}
  }

  public playThemeToggle(toDark: boolean): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const oM = ctx.createOscillator(); const gM = ctx.createGain();
      oM.type = 'square'; oM.frequency.setValueAtTime(toDark ? 260 : 340,t);
      gM.gain.setValueAtTime(0.28*MASTER_VOL,t); gM.gain.exponentialRampToValueAtTime(0.0001,t+0.028);
      oM.connect(gM); gM.connect(comp); oM.start(t); oM.stop(t+0.032);
      const oS = ctx.createOscillator(); const gS = ctx.createGain();
      oS.type = 'sine';
      if (!toDark) { oS.frequency.setValueAtTime(380,t+0.03); oS.frequency.exponentialRampToValueAtTime(1200,t+0.21); }
      else { oS.frequency.setValueAtTime(1200,t+0.03); oS.frequency.exponentialRampToValueAtTime(310,t+0.23); }
      gS.gain.setValueAtTime(0.48*MASTER_VOL,t+0.03); gS.gain.exponentialRampToValueAtTime(0.0001,t+0.25);
      oS.connect(gS); gS.connect(comp); oS.start(t+0.03); oS.stop(t+0.27);
    } catch {}
  }

  public playMusicStart(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const note = (freq: number, s: number, d: number) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = freq;
        g.gain.setValueAtTime(0.5*MASTER_VOL,s); g.gain.exponentialRampToValueAtTime(0.0001,s+d);
        o.connect(g); g.connect(comp); o.start(s); o.stop(s+d+0.01);
      };
      note(520,t,0.055); note(780,t+0.065,0.09);
    } catch {}
  }

  public playMusicPause(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(820,t); o.frequency.exponentialRampToValueAtTime(230,t+0.17);
      g.gain.setValueAtTime(0.5*MASTER_VOL,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.17);
      o.connect(g); g.connect(comp); o.start(t); o.stop(t+0.19);
    } catch {}
  }

  public playConfirm(): void {
    if (!this.enabled) return;
    const now = Date.now(); if (now - this.lastClickTime < 40) return; this.lastClickTime = now;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(1400,t); o.frequency.exponentialRampToValueAtTime(660,t+0.06);
      g.gain.setValueAtTime(0.45*MASTER_VOL,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.06);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.07);
    } catch {}
  }

  public playClick(): void { this.playConfirm(); }

  public playHover(): void {
    if (!this.enabled) return;
    const now = Date.now(); if (now - this.lastHoverTime < 80) return; this.lastHoverTime = now;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(1900,t); o.frequency.exponentialRampToValueAtTime(1100,t+0.022);
      g.gain.setValueAtTime(0.22*MASTER_VOL,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.022);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.026);
    } catch {}
  }

  public playModal(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(360,t); o.frequency.exponentialRampToValueAtTime(1100,t+0.13);
      g.gain.setValueAtTime(0.42*MASTER_VOL,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.13);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.14);
    } catch {}
  }

  public playKey(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(880+Math.random()*220,t);
      g.gain.setValueAtTime(0.22*MASTER_VOL,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.03);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+0.034);
    } catch {}
  }

  public playDinoJump(): void {
    if (!this.enabled) return;
    const now = Date.now(); if (now - this.lastJumpSfxTime < 320) return; this.lastJumpSfxTime = now;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
      o1.type = 'sine'; o1.frequency.setValueAtTime(300,t); o1.frequency.exponentialRampToValueAtTime(840,t+0.065); o1.frequency.exponentialRampToValueAtTime(580,t+0.1);
      g1.gain.setValueAtTime(0.55*MASTER_VOL,t); g1.gain.exponentialRampToValueAtTime(0.0001,t+0.11);
      o1.connect(g1); g1.connect(comp); o1.start(t); o1.stop(t+0.12);
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = 'triangle'; o2.frequency.setValueAtTime(600,t); o2.frequency.exponentialRampToValueAtTime(1280,t+0.06);
      g2.gain.setValueAtTime(0.30*MASTER_VOL,t); g2.gain.exponentialRampToValueAtTime(0.0001,t+0.08);
      o2.connect(g2); g2.connect(comp); o2.start(t); o2.stop(t+0.085);
    } catch {}
  }

  public playDinoBoop(): void {
    if (!this.enabled) return;
    const now = Date.now(); if (now - this.lastBoopTime < 500) return; this.lastBoopTime = now;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
      o1.type = 'triangle'; o1.frequency.setValueAtTime(1700,t); o1.frequency.exponentialRampToValueAtTime(880,t+0.075);
      g1.gain.setValueAtTime(0.6*MASTER_VOL,t); g1.gain.exponentialRampToValueAtTime(0.0001,t+0.09);
      o1.connect(g1); g1.connect(comp); o1.start(t); o1.stop(t+0.095);
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = 'triangle'; o2.frequency.setValueAtTime(2600,t+0.01); o2.frequency.exponentialRampToValueAtTime(1500,t+0.095);
      g2.gain.setValueAtTime(0.35*MASTER_VOL,t+0.01); g2.gain.exponentialRampToValueAtTime(0.0001,t+0.105);
      o2.connect(g2); g2.connect(comp); o2.start(t+0.01); o2.stop(t+0.11);
    } catch {}
  }

  public playDinoHit(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      // Glitchy downward square crash
      const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
      o1.type = 'sawtooth';
      o1.frequency.setValueAtTime(280, t);
      o1.frequency.exponentialRampToValueAtTime(50, t + 0.22);
      g1.gain.setValueAtTime(0.65 * MASTER_VOL, t);
      g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.23);
      o1.connect(g1); g1.connect(comp);
      o1.start(t); o1.stop(t + 0.24);

      // White-noise burst
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4 * MASTER_VOL, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      noise.connect(noiseGain); noiseGain.connect(comp);
      noise.start(t);
    } catch {}
  }

  public playDinoScoreMilestone(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const playNote = (freq: number, start: number, dur: number) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.35 * MASTER_VOL, start);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        o.connect(g); g.connect(comp);
        o.start(start); o.stop(start + dur + 0.01);
      };
      // Classic 8-bit double chime (C6 -> G6)
      playNote(1046.5, t, 0.09);
      playNote(1567.98, t + 0.1, 0.18);
    } catch {}
  }

  public playDinoCollect(): void {
    if (!this.enabled) return;
    const ctx = this.getCtx(); if (!ctx) return;
    try {
      const t = ctx.currentTime; const comp = this.makeComp(ctx);
      const playNote = (freq: number, start: number) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.4 * MASTER_VOL, start);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
        o.connect(g); g.connect(comp);
        o.start(start); o.stop(start + 0.055);
      };
      playNote(880, t);
      playNote(1174.66, t + 0.045);
      playNote(1760, t + 0.09);
    } catch {}
  }
}

export const cyberAudio = new CyberAudio();