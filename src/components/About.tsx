import React from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  FileText,
  MapPin,
  Calendar,
  ExternalLink,
  Code2,
  Brain,
  Cpu,
  Layers,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';
import { educationData } from '../data/education';
import { WhoamiGraphic } from './graphics/SectionDecorations';

interface AboutProps {
  onOpenTerminal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenTerminal }) => {
  const edu = educationData[0];

  const metadataItems = [
    { label: 'ROLE', value: 'Full Stack Developer' },
    { label: 'EDUCATION', value: 'B.Tech Information Technology' },
    { label: 'GRADUATION', value: '2027' },
    { label: 'FOCUS', value: 'Web Development · AI · ML' },
    { label: 'INSTITUTION', value: edu.institution },
    { label: 'LOCATION', value: personalData.location },
  ];

  const focusCapabilities = [
    { name: 'Full-Stack Web Engineering', icon: Code2 },
    { name: 'Machine Learning & Applied AI', icon: Brain },
    { name: 'System Architecture & APIs', icon: Cpu },
    { name: 'Practical Real-World Systems', icon: Layers },
  ];

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Section-Specific Technical Graphic */}
      <div data-music-motion="decorative">
        <WhoamiGraphic className="top-10 right-8 hidden md:block" />
      </div>

      {/* Section Header: 01 / WHOAMI with extending technical line */}
      <div data-music-motion="section-header" className="flex flex-col items-start mb-8 sm:mb-12 relative z-10">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0">
            <Terminal size={12} className="text-emerald-500" />
            <span className="font-bold">01 // WHOAMI</span>
          </div>
          {/* Thin technical rule extending from section number */}
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            ID: DEV_DOSSIER
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          DEVELOPER <span className="text-[var(--muted)]">DOSSIER</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Final-year undergraduate engineer building robust full-stack applications and Applied AI systems designed for practical utility.
        </p>
      </div>

      {/* Grid: Left Profile Card + Right Editorial Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Minimal Profile & System Spec Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-music-motion="card-profile"
          className="lg:col-span-4 bg-[var(--surface)] rounded-lg p-6 border border-[var(--border-strong)] relative overflow-hidden shadow-lg tech-corner-frame"
        >
          {/* Subtle top scanline */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />

          <div className="flex flex-col items-center text-center">
            {/* Profile Avatar Frame with technical HUD accents */}
            <div className="relative mb-5 group">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-secondary)] relative">
                <img
                  src={personalData.avatarUrl}
                  alt={personalData.name}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-sm bg-[var(--surface)] border border-[var(--border-strong)] text-[9px] font-mono text-[var(--foreground)] uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                VERIFIED DEV
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-[var(--foreground)] mt-1 mb-0.5">
              {personalData.name}
            </h3>
            <p className="font-mono text-xs text-[var(--muted)] mb-6">
              Full Stack & Applied AI
            </p>

            {/* Quick Actions */}
            <div className="w-full space-y-2 font-mono text-xs">
              <a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full min-h-[42px] px-4 py-2.5 rounded-md bg-white text-black font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
              >
                <FileText size={13} />
                <span>VIEW RESUME (PDF)</span>
                <ExternalLink size={10} />
              </a>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenTerminal();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full min-h-[42px] px-4 py-2.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--border-strong)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal size={13} />
                <span>LAUNCH TERMINAL CLI</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Editorial Metadata Table + Bio + Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          data-music-motion="card-bio"
          className="lg:col-span-8 flex flex-col gap-6"
        >
          {/* Metadata Terminal Table */}
          <div className="bg-[var(--surface)] rounded-lg p-5 sm:p-7 border border-[var(--border-strong)] shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)] text-xs font-mono text-[var(--muted)]">
              <span className="uppercase tracking-wider font-semibold text-[var(--foreground)]">SYSTEM SPECIFICATIONS</span>
              <span className="text-emerald-500 flex items-center gap-1.5 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs sm:text-sm">
              {metadataItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0 gap-1 sm:gap-4"
                >
                  <span className="text-[var(--muted)] font-semibold tracking-wider min-w-[130px]">
                    {item.label}
                  </span>
                  <span className="hidden sm:inline flex-1 border-b border-dotted border-[var(--border)]" />
                  <span className="text-[var(--foreground)] text-left sm:text-right font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Short Bio Statement */}
          <div className="bg-[var(--surface)] rounded-lg p-5 sm:p-7 border border-[var(--border)] shadow-sm">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-3 font-semibold">
              ENGINEERING SYNOPSIS
            </h3>
            <p className="text-[var(--foreground)] text-sm sm:text-base leading-relaxed font-sans mb-4">
              {personalData.summary}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--muted)] pt-2 border-t border-[var(--border)]">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--foreground)]" />
                {personalData.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-[var(--foreground)]" />
                Class of 2027
              </span>
            </div>
          </div>

          {/* Core Engineering Competencies */}
          <div className="bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border)] shadow-sm">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-4 font-semibold">
              CORE CAPABILITIES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {focusCapabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="p-3 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors flex items-center gap-3"
                >
                  <div className="p-1.5 rounded-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] shrink-0">
                    <cap.icon size={14} />
                  </div>
                  <span className="text-xs font-mono text-[var(--foreground)] font-medium">
                    {cap.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
