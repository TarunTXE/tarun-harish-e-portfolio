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
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black selection:bg-white selection:text-black"
    >
      {/* Subtle fine corner grid line accents */}
      <div className="absolute top-12 left-8 w-24 h-[1px] bg-white/10 hidden sm:block pointer-events-none" />
      <div className="absolute top-8 left-12 h-24 w-[1px] bg-white/10 hidden sm:block pointer-events-none" />
      <div className="absolute top-12 right-8 w-24 h-[1px] bg-white/10 hidden sm:block pointer-events-none" />
      <div className="absolute top-8 right-12 h-24 w-[1px] bg-white/10 hidden sm:block pointer-events-none" />

      {/* Very subtle center glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center"
      >
        {/* Step 1: Small technical label */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md border border-white/15 bg-neutral-950/80 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </span>
            <span className="font-mono text-[11px] sm:text-xs text-neutral-300 font-semibold tracking-widest uppercase">
              TXE / SYSTEM ONLINE
            </span>
            <span className="text-neutral-600 font-mono text-[10px]">|</span>
            <span className="font-mono text-[10px] text-neutral-400 tracking-wider">v2.5.0</span>
          </div>
        </motion.div>

        {/* Step 2 & 3: Large Typography: TARUN appears, then HARISH E appears */}
        <div className="w-full flex justify-center mb-4">
          <h1 className="font-display font-extrabold tracking-tighter text-white leading-[0.92] text-balance text-[clamp(2.75rem,8.5vw,6.5rem)] select-none">
            <motion.span variants={itemVariants} className="block text-white">
              TARUN
            </motion.span>
            <motion.span variants={itemVariants} className="block text-neutral-200">
              HARISH E
            </motion.span>
          </h1>
        </div>

        {/* Step 3: Developer title */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none shadow-[0_0_6px_#10b981]" />
            <h2 className="font-mono font-bold text-sm sm:text-lg md:text-xl text-neutral-300 tracking-[0.25em] uppercase">
              FULL STACK DEVELOPER
            </h2>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none shadow-[0_0_6px_#10b981]" />
          </div>
        </motion.div>

        {/* Step 4: Supporting text */}
        <motion.p
          variants={itemVariants}
          className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed mb-8 px-4"
        >
          Building web applications, AI systems and experimental software.
        </motion.p>

        {/* Step 5: Subtle terminal-style metadata card */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-xl mx-auto mb-10 px-2"
        >
          <div className="relative p-4 sm:p-5 rounded-lg bg-neutral-950/90 border border-white/15 backdrop-blur-md text-left font-mono text-xs sm:text-sm text-neutral-300 shadow-2xl">
            {/* Terminal Card Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] sm:text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-neutral-700" />
                <span className="ml-2 font-mono uppercase tracking-wider text-neutral-400">
                  sys_telemetry.env
                </span>
              </div>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                READY
              </span>
            </div>

            {/* Metadata Rows */}
            <div className="space-y-1.5 sm:space-y-2 leading-relaxed">
              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-500 font-mono tracking-wider">STATUS</span>
                <span className="text-neutral-700 hidden sm:inline flex-1 mx-3 border-b border-dotted border-white/15" />
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-500 font-mono tracking-wider">FOCUS</span>
                <span className="text-neutral-700 hidden sm:inline flex-1 mx-3 border-b border-dotted border-white/15" />
                <span className="text-white font-medium">FULL STACK / AI</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-500 font-mono tracking-wider">BASED</span>
                <span className="text-neutral-700 hidden sm:inline flex-1 mx-3 border-b border-dotted border-white/15" />
                <span className="text-neutral-300">KERALA, INDIA</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-500 font-mono tracking-wider">GRADUATION</span>
                <span className="text-neutral-700 hidden sm:inline flex-1 mx-3 border-b border-dotted border-white/15" />
                <span className="text-neutral-300">2027</span>
              </div>
            </div>

            {/* Micro avatar integration inside card */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30 bg-black">
                  <img
                    src={personalData.avatarUrl}
                    alt={personalData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-medium">{personalData.name}</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">B.TECH IT • CALICUT</span>
            </div>
          </div>
        </motion.div>

        {/* Step 6: CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-14 px-2"
        >
          {/* Primary CTA: [ EXPLORE PROJECTS ] */}
          <button
            onClick={() => scrollToSection('projects')}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-md bg-white text-black font-mono font-bold text-xs tracking-wider uppercase hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>[ EXPLORE PROJECTS ]</span>
            <ArrowDown size={14} />
          </button>

          {/* Secondary CTA: [ GITHUB → ] */}
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-md bg-neutral-950 border border-white/20 text-white font-mono font-semibold text-xs tracking-wider uppercase hover:border-white hover:bg-neutral-900 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <GithubIcon size={14} />
            <span>[ GITHUB → ]</span>
          </a>

          {/* Quick Terminal Trigger */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-md bg-neutral-950 border border-white/10 text-neutral-300 font-mono text-xs tracking-wider uppercase hover:border-white/30 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal size={13} />
            <span>CLI TERMINAL</span>
          </button>

          {/* Resume Trigger */}
          <a
            href={personalData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-md bg-neutral-950 border border-white/10 text-neutral-300 font-mono text-xs tracking-wider uppercase hover:border-white/30 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText size={13} />
            <span>RESUME PDF</span>
            <ExternalLink size={10} className="text-neutral-500" />
          </a>

          {/* Interactive CV Modal Trigger */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenResume();
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-md bg-neutral-950 border border-white/10 text-neutral-300 font-mono text-xs tracking-wider uppercase hover:border-white/30 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText size={13} />
            <span>PREVIEW CV</span>
          </button>
        </motion.div>

        {/* Step 7: Subtle scroll indicator */}
        <motion.div
          variants={itemVariants}
          onClick={() => scrollToSection('about')}
          onMouseEnter={() => cyberAudio.playHover()}
          className="cursor-pointer flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors group"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
            [ SCROLL TO EXPLORE ]
          </span>
          <div className="w-4 h-7 rounded-sm border border-white/20 flex justify-center p-1 group-hover:border-white/50 transition-colors">
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-1 h-1.5 bg-white rounded-none"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
