import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  Building,
  Award,
  CheckCircle2,
  MapPin,
  HeartHandshake,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { experiencesData } from '../data/experience';
import { certificationsData } from '../data/certifications';
import { activitiesData } from '../data/activities';
import { ExperienceGraphic } from './graphics/SectionDecorations';

export const Experience: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'experience' | 'certifications' | 'activities'>('all');

  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Timeline Graphic Motif */}
      <div data-music-motion="decorative">
        <ExperienceGraphic className="top-10 right-8 hidden md:block" />
      </div>

      {/* Section Heading: 04 / EXPERIENCE.LOG with timeline grid pattern */}
      <div data-music-motion="section-header" className="flex flex-col items-start mb-8 sm:mb-12 relative z-10">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0">
            <Briefcase size={12} className="text-emerald-500" />
            <span className="font-bold">04 // EXPERIENCE.LOG</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            TRACK: CAREER_CREDENTIALS
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          CAREER & <span className="text-[var(--muted)]">CREDENTIALS</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Industry internships, certified technical accreditations, and institutional volunteer contributions.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 p-1 bg-[var(--surface)] rounded-md border border-[var(--border)] shadow-sm">
          {[
            { id: 'all', label: 'All Entries' },
            { id: 'experience', label: 'Work Experience' },
            { id: 'certifications', label: 'Certifications' },
            { id: 'activities', label: 'Volunteering' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                cyberAudio.playClick();
                setActiveFilter(tab.id as 'all' | 'experience' | 'certifications' | 'activities');
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Connected Vertical Timeline */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ==================== WORK EXPERIENCES ==================== */}
        {(activeFilter === 'all' || activeFilter === 'experience') && (
          <div className="relative pl-6 sm:pl-10 space-y-8">
            {/* Connected Vertical Timeline Spine */}
            <div className="absolute left-2.5 sm:left-4 top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-[var(--foreground)] via-[var(--border-strong)] to-transparent" />

            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2 mb-2 font-bold">
              <Briefcase size={14} className="text-emerald-500" /> Professional Internships
            </h3>

            {experiencesData.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-music-motion="experience-card"
                className="relative"
              >
                {/* Timeline Circular Node */}
                <div className="absolute -left-6 sm:-left-10 top-6 w-5 h-5 rounded-full bg-[var(--surface)] border-2 border-[var(--foreground)] flex items-center justify-center shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>

                {/* Experience Card */}
                <div className="bg-[var(--surface)] rounded-lg p-5 sm:p-7 border border-[var(--border-strong)] hover:border-[var(--foreground)] transition-all duration-200 shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)] font-bold uppercase">
                          {exp.badge}
                        </span>
                        {exp.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            CURRENT
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-lg sm:text-xl text-[var(--foreground)]">
                        {exp.role}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--muted)] text-xs sm:text-sm font-medium mt-1">
                        <span className="flex items-center gap-1 text-[var(--foreground)] font-semibold">
                          <Building size={13} /> {exp.company}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-[var(--muted)] font-mono text-xs">
                          <MapPin size={12} className="text-[var(--foreground)]" /> {exp.location}
                        </span>
                      </div>
                      {exp.collaboration && (
                        <p className="text-xs text-[var(--muted)] font-mono mt-1">
                          {exp.collaboration}
                        </p>
                      )}
                    </div>

                    <div className="px-3 py-1.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] font-mono text-xs text-[var(--foreground)] flex items-center gap-1.5 shrink-0">
                      <Calendar size={12} className="text-emerald-500" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2 mb-5 text-[var(--foreground)] text-xs sm:text-sm font-sans leading-relaxed">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ==================== CERTIFICATIONS ==================== */}
        {(activeFilter === 'all' || activeFilter === 'certifications') && (
          <div className="space-y-4 pt-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2 mb-3 font-bold">
              <Award size={14} className="text-emerald-500" /> Accredited Certifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificationsData.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] hover:border-[var(--foreground)] transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)] font-bold">
                        {cert.badge}
                      </span>
                      <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                        <Calendar size={12} className="text-[var(--foreground)]" /> {cert.date}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-[var(--muted)] text-xs font-mono mb-3">{cert.issuer}</p>

                    <p className="text-[var(--muted)] text-xs leading-relaxed font-sans mb-4">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--muted)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== ACTIVITIES & VOLUNTEERING ==================== */}
        {(activeFilter === 'all' || activeFilter === 'activities') && (
          <div className="space-y-4 pt-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2 mb-3 font-bold">
              <HeartHandshake size={14} className="text-emerald-500" /> Volunteering & Leadership
            </h3>

            {activitiesData.map((act, index) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] hover:border-[var(--foreground)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] shrink-0">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)] font-bold">
                        {act.badge}
                      </span>
                      <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                        <Calendar size={12} className="text-[var(--foreground)]" /> {act.period}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)]">
                      {act.organization} — <span className="text-[var(--muted)] font-normal">{act.role}</span>
                    </h4>
                    <p className="text-[var(--muted)] text-xs sm:text-sm font-sans mt-1 leading-relaxed max-w-2xl">
                      {act.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};
