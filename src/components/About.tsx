import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Code,
  Brain,
  Sparkles,
  Terminal,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Cpu,
  FileText,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';
import { educationData } from '../data/education';

interface AboutProps {
  onOpenTerminal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenTerminal }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'focus'>('profile');
  const edu = educationData[0];

  const focusAreas = [
    { label: 'Full-Stack Web Development', icon: Code },
    { label: 'Machine Learning & Applied AI', icon: Brain },
    { label: 'Software Architecture', icon: Cpu },
    { label: 'Model Building', icon: Sparkles },
    { label: 'Problem-Solving & Algorithms', icon: CheckCircle2 },
    { label: 'Practical Real-World Systems', icon: Layers },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 01 / ABOUT */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Terminal size={12} className="text-white" />
          <span>01 / BIOGRAPHY</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          ABOUT <span className="text-gradient-white">TARUN HARISH</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-2xl font-sans">
          Final-year B.Tech IT student, full-stack engineer, and Applied AI practitioner building resilient software and intelligent models.
        </p>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Monochromatic Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 bg-[#080808] rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/25 relative overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.04)]"
        >
          {/* Subtle white scanline */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Avatar Frame: Circular with neon white border & floating motion */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[2px] bg-white/25 mb-6 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-black border border-white/30 relative">
                <img
                  src={personalData.avatarUrl}
                  alt={personalData.name}
                  className="w-full h-full object-cover filter contrast-105"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/90 border border-white/30 text-[10px] font-mono text-white font-bold tracking-wider whitespace-nowrap shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                VERIFIED::DEV
              </div>
            </motion.div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-1">{personalData.name}</h3>
            <p className="font-mono text-xs text-neutral-400 mb-4">{personalData.primaryTitle}</p>

            <div className="w-full grid grid-cols-2 gap-3 py-4 border-y border-white/10 text-left text-xs font-mono mb-6">
              <div>
                <span className="text-neutral-500 block text-[10px]">LOCATION</span>
                <span className="text-neutral-200 flex items-center gap-1.5 mt-0.5">
                  <MapPin size={12} className="text-white shrink-0" />
                  <span className="truncate">{personalData.location.split(',')[0]}, Kerala</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">ACADEMIC CYCLE</span>
                <span className="text-neutral-200 flex items-center gap-1.5 mt-0.5">
                  <Calendar size={12} className="text-white shrink-0" /> 2023 – 2027
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2.5">
              <a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
              >
                <FileText size={14} />
                <span>OPEN RESUME PDF</span>
              </a>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenTerminal();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-neutral-950 border border-white/15 hover:border-white/35 text-neutral-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Terminal size={14} />
                <span>LAUNCH CLI INSPECTOR</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Bio, Education, Focus Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          {/* Tabs Selector: Min 44px touch height */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#080808] rounded-2xl border border-white/10 self-start w-full sm:w-auto">
            {[
              { id: 'profile', label: 'Biography' },
              { id: 'education', label: 'Education' },
              { id: 'focus', label: 'Core Focus' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveTab(tab.id as 'profile' | 'education' | 'focus');
                }}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Biography */}
          {activeTab === 'profile' && (
            <div className="bg-[#080808] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 animate-in fade-in duration-200">
              <p className="text-neutral-200 text-sm sm:text-base leading-relaxed font-sans">
                {personalData.summary}
              </p>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Undergraduate at the Institute of Engineering and Technology, University of Calicut (2023–2027), focusing on end-to-end software engineering and Applied AI systems that solve genuine real-world challenges.
              </p>

              {/* Focus Badges */}
              <div className="pt-2">
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider block mb-3 font-semibold">
                  Core Engineering Capabilities
                </span>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <div
                      key={area.label}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-neutral-950 text-xs font-mono text-neutral-200 hover:border-white/40 transition-colors"
                    >
                      <area.icon size={13} className="text-white" />
                      <span>{area.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Education */}
          {activeTab === 'education' && (
            <div className="bg-[#080808] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-white/15 relative">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-white mt-1 shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-display font-bold text-base sm:text-lg text-white">
                        {edu.degree} in {edu.field}
                      </h4>
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm font-medium mt-1.5">
                      {edu.institution}
                    </p>
                    <p className="text-neutral-500 text-xs font-mono mt-0.5 flex items-center gap-1">
                      <MapPin size={12} className="text-white" /> {edu.location}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                    Academic Scope & Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
                    {edu.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Core Focus */}
          {activeTab === 'focus' && (
            <div className="bg-[#080808] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 animate-in fade-in duration-200">
              <h3 className="font-display font-bold text-base text-white mb-2">
                Engineering Competencies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {focusAreas.map((f) => (
                  <div
                    key={f.label}
                    className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-white/30 transition-colors flex items-center gap-3"
                  >
                    <div className="p-2 rounded-lg bg-white/10 text-white">
                      <f.icon size={15} />
                    </div>
                    <span className="text-xs font-mono text-neutral-200 font-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
