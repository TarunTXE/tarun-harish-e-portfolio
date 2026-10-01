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
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black border-t border-white/10"
    >
      {/* Section Header: 01 / WHOAMI */}
      <div className="flex flex-col items-start mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Terminal size={12} className="text-white" />
          <span>01 // WHOAMI</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          DEVELOPER <span className="text-neutral-400">DOSSIER</span>
        </h2>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
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
          className="lg:col-span-4 bg-neutral-950 rounded-lg p-6 border border-white/15 relative overflow-hidden"
        >
          {/* Subtle top scanline */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="flex flex-col items-center text-center">
            {/* Profile Avatar Frame: Minimal square/rounded-md border with technical HUD accents */}
            <div className="relative mb-5 group">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-white/20 bg-neutral-900 relative">
                <img
                  src={personalData.avatarUrl}
                  alt={personalData.name}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-sm bg-black border border-white/20 text-[9px] font-mono text-neutral-300 uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                VERIFIED DEV
              </div>
            </div>

            <h3 className="font-display font-bold text-xl text-white mt-1 mb-0.5">
              {personalData.name}
            </h3>
            <p className="font-mono text-xs text-neutral-400 mb-6">
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
                className="w-full min-h-[42px] px-4 py-2.5 rounded-md bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
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
                className="w-full min-h-[42px] px-4 py-2.5 rounded-md bg-neutral-900 border border-white/15 text-neutral-300 hover:text-white hover:border-white/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
          className="lg:col-span-8 flex flex-col gap-6"
        >
          {/* Metadata Terminal Table */}
          <div className="bg-neutral-950 rounded-lg p-5 sm:p-7 border border-white/15">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono text-neutral-400">
              <span className="uppercase tracking-wider">SYSTEM SPECIFICATIONS</span>
              <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs sm:text-sm">
              {metadataItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 border-b border-white/5 last:border-0 gap-1 sm:gap-4"
                >
                  <span className="text-neutral-500 font-semibold tracking-wider min-w-[130px]">
                    {item.label}
                  </span>
                  <span className="text-neutral-700 hidden sm:inline flex-1 border-b border-dotted border-white/10" />
                  <span className="text-neutral-200 text-left sm:text-right font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Short Bio Statement */}
          <div className="bg-neutral-950 rounded-lg p-5 sm:p-7 border border-white/15">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-3 font-semibold">
              ENGINEERING SYNOPSIS
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans mb-4">
              {personalData.summary}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-white" />
                {personalData.location}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-white" />
                Class of 2027
              </span>
            </div>
          </div>

          {/* Core Engineering Competencies */}
          <div className="bg-neutral-950 rounded-lg p-5 sm:p-6 border border-white/15">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400 mb-4 font-semibold">
              CORE CAPABILITIES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {focusCapabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="p-3 rounded-md bg-neutral-900/60 border border-white/10 hover:border-white/25 transition-colors flex items-center gap-3"
                >
                  <div className="p-1.5 rounded-sm bg-white/10 text-white shrink-0">
                    <cap.icon size={14} />
                  </div>
                  <span className="text-xs font-mono text-neutral-300 font-medium">
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
