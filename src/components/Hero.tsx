import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowDown,
  Terminal,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';
import { HeroBackgroundGraphics } from './graphics/HeroBackgroundGraphics';

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, onOpenResume }) => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToSection = (id: string) => {
    cyberAudio.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Staggered motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[var(--background)] text-[var(--foreground)] tech-grid"
    >
      {/* Unique Static Theme Graphic (Developer System Dark / Blueprint Light) */}
      <div data-music-motion="decorative">
        <HeroBackgroundGraphics />
      </div>

      {/* Subtle Static Technical Frame Accents */}
      <div className="absolute top-12 left-8 w-20 h-[1px] bg-[var(--border-strong)] hidden sm:block pointer-events-none" />
      <div className="absolute top-8 left-12 h-20 w-[1px] bg-[var(--border-strong)] hidden sm:block pointer-events-none" />
      <div className="absolute top-12 right-8 w-20 h-[1px] bg-[var(--border-strong)] hidden sm:block pointer-events-none" />
      <div className="absolute top-8 right-12 h-20 w-[1px] bg-[var(--border-strong)] hidden sm:block pointer-events-none" />

      {/* Subtle Technical Corner Coordinates */}
      <div className="absolute top-14 left-14 font-mono text-[9px] text-[var(--muted)] tracking-widest hidden lg:block select-none opacity-60">
        SYS_ID: 0x7E • LAT 11.25°N
      </div>
      <div className="absolute top-14 right-14 font-mono text-[9px] text-[var(--muted)] tracking-widest hidden lg:block select-none opacity-60">
        LON 75.78°E • REV 2.5
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center my-auto"
      >
        {/* Step 1: Small technical label */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md border border-[var(--border-strong)] bg-[var(--surface)] shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-[var(--foreground)] font-semibold tracking-widest uppercase">
              TXE / SYSTEM ONLINE
            </span>
            <span className="text-[var(--muted)] font-mono text-[10px]">|</span>
            <span className="font-mono text-[10px] text-[var(--muted)] tracking-wider">v2.5.0</span>
          </div>
        </motion.div>

        {/* Step 2: Large Typography: TARUN HARISH E */}
        <div className="w-full flex justify-center mb-2.5 sm:mb-3">
          <h1 className="font-display font-extrabold tracking-tighter text-[var(--foreground)] leading-[0.92] text-balance text-[clamp(2.15rem,7.5vw,6.5rem)] select-none">
            <motion.span
              variants={itemVariants}
              data-music-motion="hero-first"
              className="inline-block txe-glow-tarun cursor-default transition-all duration-300"
            >
              TARUN
            </motion.span>
            <motion.span
              variants={itemVariants}
              data-music-motion="hero-last"
              className="inline-block ml-2.5 sm:ml-4 txe-glow-harish cursor-default transition-all duration-300"
            >
              HARISH E
            </motion.span>
          </h1>
        </div>

        {/* Step 3: Developer title */}
        <motion.div variants={itemVariants} data-music-motion="hero-title" className="mb-2.5 sm:mb-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none shadow-[0_0_6px_#10b981]" />
            <h2 className="font-mono font-bold text-sm sm:text-base md:text-lg text-[var(--foreground)] tracking-[0.25em] uppercase">
              FULL STACK DEVELOPER
            </h2>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none shadow-[0_0_6px_#10b981]" />
          </div>
        </motion.div>

        {/* Step 4: Supporting text */}
        <motion.p
          variants={itemVariants}
          className="text-[var(--muted)] text-sm sm:text-base max-w-xl mx-auto font-sans leading-relaxed mb-5 sm:mb-6 px-4"
        >
          Building web applications, AI systems and experimental software.
        </motion.p>

        {/* Step 5: Subtle terminal-style telemetry panel */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-lg mx-auto mb-6 sm:mb-8 px-2"
        >
          <div
            data-music-motion="telemetry"
            className="relative p-3.5 sm:p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-strong)] text-left font-mono text-xs text-[var(--foreground)] shadow-lg tech-corner-frame"
          >
            {/* Terminal Card Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[var(--border)] text-[10px] sm:text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                <span className="w-2 h-2 rounded-full bg-[var(--border-strong)]" />
                <span className="ml-2 font-mono uppercase tracking-wider text-[var(--muted)]">
                  sys_telemetry.env
                </span>
              </div>
              <span className="text-emerald-500 font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                READY
              </span>
            </div>

            {/* Metadata Rows */}
            <div className="space-y-1.5 leading-relaxed">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--muted)] font-mono tracking-wider">STATUS</span>
                <span className="hidden sm:inline flex-1 mx-3 border-b border-dotted border-[var(--border)]" />
                <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--muted)] font-mono tracking-wider">FOCUS</span>
                <span className="hidden sm:inline flex-1 mx-3 border-b border-dotted border-[var(--border)]" />
                <span className="text-[var(--foreground)] font-medium">FULL STACK / AI</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--muted)] font-mono tracking-wider">BASED</span>
                <span className="hidden sm:inline flex-1 mx-3 border-b border-dotted border-[var(--border)]" />
                <span className="text-[var(--foreground)]">KERALA, INDIA</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--muted)] font-mono tracking-wider">GRADUATION</span>
                <span className="hidden sm:inline flex-1 mx-3 border-b border-dotted border-[var(--border)]" />
                <span className="text-[var(--foreground)]">2027</span>
              </div>
            </div>

            {/* Micro avatar integration inside card */}
            <div className="mt-3 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-secondary)]">
                  <img
                    src={personalData.avatarUrl}
                    alt={personalData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[var(--foreground)] font-medium">{personalData.name}</span>
              </div>
              <span className="text-[10px] text-[var(--muted)] font-mono">B.TECH IT • CALICUT</span>
            </div>
          </div>
        </motion.div>

        {/* Step 6: CTA Buttons */}
        <motion.div
          variants={itemVariants}
          data-music-motion="hero-cta"
          className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto mb-6 sm:mb-8 px-2"
        >
          {/* Primary CTA: [ EXPLORE PROJECTS ] */}
          <button
            onClick={() => {
              cyberAudio.playConfirm();
              scrollToSection('projects');
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-md bg-white text-black font-mono font-bold text-xs tracking-wider uppercase hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>[ EXPLORE PROJECTS ]</span>
            <ArrowDown size={14} />
          </button>

          {/* Secondary CTA: [ GITHUB → ] */}
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playConfirm()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-md bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] font-mono font-semibold text-xs tracking-wider uppercase hover:border-[var(--foreground)] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <GithubIcon size={14} />
            <span>[ GITHUB → ]</span>
          </a>

          {/* Quick Terminal Trigger */}
          <button
            onClick={() => {
              cyberAudio.playConfirm();
              onOpenTerminal();
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs tracking-wider uppercase hover:border-[var(--border-strong)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal size={13} />
            <span>CLI</span>
          </button>

          {/* Resume Trigger */}
          <a
            href={personalData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playConfirm()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs tracking-wider uppercase hover:border-[var(--border-strong)] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText size={13} />
            <span>RESUME</span>
            <ExternalLink size={10} className="text-[var(--muted)]" />
          </a>

          {/* Interactive CV Modal Trigger */}
          <button
            onClick={() => {
              cyberAudio.playConfirm();
              onOpenResume();
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs tracking-wider uppercase hover:border-[var(--border-strong)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText size={13} />
            <span>CV</span>
          </button>
        </motion.div>

        {/* Step 7: Compact scroll indicator */}
        <motion.div
          variants={itemVariants}
          onClick={() => scrollToSection('about')}
          onMouseEnter={() => cyberAudio.playHover()}
          className="cursor-pointer flex flex-col items-center gap-1.5 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group select-none"
        >
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase">
            [ SCROLL TO EXPLORE ]
          </span>
          <div className="w-3.5 h-6 rounded-sm border border-[var(--border-strong)] flex justify-center p-0.5 group-hover:border-[var(--foreground)] transition-colors">
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-0.5 h-1.5 bg-[var(--foreground)] rounded-none"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
