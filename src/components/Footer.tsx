import React from 'react';
import { ArrowUp, Mail, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';

interface FooterProps {
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal }) => {
  const scrollToTop = () => {
    cyberAudio.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-black pt-12 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle white top border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Compact Mobile-Friendly Brand & Bio */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base sm:text-lg text-white">{personalData.name}</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-neutral-900 border border-white/15 text-white">
              FULL-STACK :: AI
            </span>
          </div>
          <p className="text-neutral-400 font-mono text-xs">
            {personalData.location} &bull; {personalData.phone}
          </p>
          <p className="text-neutral-600 font-mono text-[11px] mt-0.5">
            &copy; 2026 {personalData.name}. All rights reserved.
          </p>
        </div>

        {/* System Status & Terminal */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-xs font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse" />
          <span>Status: Online</span>
          <span className="text-neutral-700">|</span>
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenTerminal();
            }}
            className="text-white hover:underline flex items-center gap-1 font-medium"
          >
            <Terminal size={12} /> CLI
          </button>
        </div>

        {/* Touch-Friendly Social Links (44px target) */}
        <div className="flex items-center gap-2">
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-11 h-11 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={17} />
          </a>
          <a
            href={personalData.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-11 h-11 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={17} />
          </a>
          <a
            href={`mailto:${personalData.email}`}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-11 h-11 rounded-xl bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
            aria-label="Send Email"
          >
            <Mail size={17} />
          </a>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => cyberAudio.playHover()}
            title="Back to Top"
            className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all ml-1 cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
