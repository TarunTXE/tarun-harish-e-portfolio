import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Download,
  Terminal,
  Sparkles,
  ChevronDown,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';

interface HeroProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal, onOpenResume }) => {
  const titles = personalData.animatedTitles;

  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(85);

  // Cycling Typewriter Effect
  useEffect(() => {
    const currentTitle = titles[titleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
        setTypingSpeed(75);

        if (displayText.length + 1 === currentTitle.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
        setTypingSpeed(35);

        if (displayText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex, titles, typingSpeed]);

  const scrollToSection = (id: string) => {
    cyberAudio.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 cyber-grid overflow-hidden bg-black"
    >
      {/* Subtle Monochrome Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-neutral-950/80 backdrop-blur-md mb-6 sm:mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-white -ml-4" />
          <span className="font-mono text-[11px] sm:text-xs text-neutral-300 font-medium tracking-wider uppercase">
            SYSTEM ONLINE &bull; AVAILABLE FOR IMPACTFUL ROLES
          </span>
          <Sparkles size={12} className="text-white/80" />
        </motion.div>

        {/* Developer Name - Fluid Clamp Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-3"
        >
          <span className="font-mono text-xs sm:text-sm text-neutral-400 uppercase tracking-widest block mb-1">
            Hi, I'm
          </span>
          <h1 className="font-display font-extrabold tracking-tight text-white leading-none text-balance text-[clamp(2.5rem,7.5vw,5.5rem)]">
            {personalData.name}
          </h1>
          <p className="font-display font-semibold text-lg sm:text-2xl text-neutral-300 tracking-wide mt-2">
            {personalData.primaryTitle}
          </p>
        </motion.div>

        {/* Animated Subtitle / Monochromatic Dynamic Typing Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-11 sm:h-12 flex items-center justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl bg-neutral-950 border border-white/15 backdrop-blur-md shadow-inner">
            <span className="font-mono text-white font-semibold text-sm sm:text-base">&gt;</span>
            <span className="font-mono text-sm sm:text-lg font-bold text-white min-w-[190px] sm:min-w-[240px] text-left">
              {displayText}
            </span>
            <span className="w-2 h-4 sm:h-5 bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
          </div>
        </motion.div>

        {/* Resume Summary */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-sans leading-relaxed mb-8 sm:mb-10 text-balance px-2"
        >
          {personalData.summary}
        </motion.p>

        {/* Profile Picture with Thin White Glowing Ring & Smooth Floating Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -7, 0],
          }}
          transition={{
            opacity: { duration: 0.6, ease: 'easeOut' },
            scale: { duration: 0.6, ease: 'easeOut' },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative mb-8 group"
        >
          {/* Subtle outer white blur glow */}
          <div className="absolute -inset-2.5 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-all duration-500" />

          {/* Rotating dashed ring */}
          <div className="absolute -inset-2 rounded-full border border-dashed border-white/25 animate-spin-slow pointer-events-none" />

          {/* Main Avatar Frame: 150px on mobile, 180px on desktop */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[2px] bg-white/25 hover:bg-white/50 shadow-[0_0_35px_rgba(255,255,255,0.2)] overflow-hidden transition-all duration-300">
            <div className="w-full h-full rounded-full overflow-hidden bg-black border border-white/30 relative">
              <img
                src={personalData.avatarUrl}
                alt={personalData.name}
                className="w-full h-full object-cover rounded-full filter contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30" />
            </div>

            {/* Online Status Badge */}
            <div className="absolute bottom-1 right-3 px-2 py-0.5 rounded-full bg-black/90 border border-white/30 text-[9px] font-mono text-white shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              ONLINE
            </div>
          </div>
        </motion.div>

        {/* Primary & Secondary CTA Buttons - Monochrome Button System */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-10 px-2"
        >
          {/* Primary Button: White BG + Black Text */}
          <button
            onClick={() => scrollToSection('projects')}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-xl bg-white text-black font-display font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>VIEW PROJECTS</span>
            <ArrowRight size={16} />
          </button>

          {/* Secondary Button: Transparent Black + White Border */}
          <a
            href={personalData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-xl bg-neutral-950 border border-white/25 text-white font-display font-semibold text-sm tracking-wide hover:border-white hover:bg-neutral-900 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText size={15} />
            <span>VIEW RESUME</span>
            <ExternalLink size={12} className="text-neutral-400" />
          </a>

          {/* Download Resume Button */}
          <a
            href={personalData.resumeUrl}
            download="Tarun_Harish_E_Resume.pdf"
            onClick={() => cyberAudio.playClick()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-xl bg-neutral-950 border border-white/15 text-neutral-300 font-display font-medium text-sm hover:border-white/40 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download size={15} />
            <span>DOWNLOAD CV</span>
          </a>

          {/* Interactive CV Modal Trigger */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenResume();
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-xl bg-neutral-950 border border-white/15 text-neutral-300 font-display font-medium text-sm hover:border-white/40 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText size={14} />
            <span>PREVIEW CV</span>
          </button>

          {/* Interactive Terminal CLI Trigger */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenTerminal();
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[46px] px-5 py-3 rounded-xl bg-neutral-950 border border-white/15 text-neutral-300 font-display font-medium text-sm hover:border-white/40 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Terminal size={14} />
            <span>TERMINAL CLI</span>
          </button>
        </motion.div>

        {/* Quick Social Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-4 text-neutral-400 mb-12"
        >
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-11 h-11 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={personalData.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-11 h-11 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={`mailto:${personalData.email}`}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-11 h-11 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200"
            aria-label="Send Email"
          >
            <Mail size={18} />
          </a>
        </motion.div>

        {/* Scroll Indicator at Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          onClick={() => scrollToSection('about')}
          onMouseEnter={() => cyberAudio.playHover()}
          className="cursor-pointer flex flex-col items-center gap-2 group"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500 group-hover:text-white transition-colors">
            SCROLL TO EXPLORE
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 group-hover:border-white p-1 flex justify-center transition-colors">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]"
            />
          </div>
          <ChevronDown size={14} className="text-neutral-500 group-hover:text-white animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};
