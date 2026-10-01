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
    <footer className="relative border-t border-white/10 bg-black pt-12 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-mono">
      {/* Subtle white top border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Identity */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-white tracking-widest">TXE</span>
            <span className="text-neutral-600">/</span>
            <span className="text-xs text-neutral-300 font-semibold">{personalData.name}</span>
          </div>
          <p className="text-neutral-500 text-xs">
            FULL STACK DEVELOPER &bull; AI
          </p>
          <p className="text-neutral-600 text-[11px] mt-1">
            &copy; 2026 Tarun Harish E
          </p>
        </div>

        {/* System Coordinates & Status */}
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-sm bg-neutral-950 border border-white/10 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYS_ONLINE
          </span>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-500">KERALA, IN [11.25°N, 75.78°E]</span>
          <span className="text-neutral-700 hidden sm:inline">|</span>
          <button
            onClick={() => {
              cyberAudio.playClick();
              onOpenTerminal();
            }}
            className="text-white hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <Terminal size={12} /> &gt;_ CLI
          </button>
        </div>

        {/* Minimal Social Links */}
        <div className="flex items-center gap-2">
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-9 h-9 rounded-md bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={15} />
          </a>
          <a
            href={personalData.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-9 h-9 rounded-md bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={15} />
          </a>
          <a
            href={`mailto:${personalData.email}`}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-9 h-9 rounded-md bg-neutral-950 border border-white/15 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-colors"
            aria-label="Send Email"
          >
            <Mail size={15} />
          </a>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => cyberAudio.playHover()}
            title="Return to Top"
            className="w-9 h-9 rounded-md bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors ml-1 cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};
