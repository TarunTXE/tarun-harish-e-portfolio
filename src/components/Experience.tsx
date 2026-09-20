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

export const Experience: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'experience' | 'certifications' | 'activities'>('all');

  return (
    <section id="experience" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 04 / EXPERIENCE */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Briefcase size={12} className="text-white" />
          <span>04 / EXPERIENCE & CREDENTIALS</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          CAREER & <span className="text-gradient-white">CREDENTIALS</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-xl font-sans">
          Industry internships, certified technical accreditations, and institutional volunteer contributions.
        </p>

        {/* Filter Pills (Min 44px touch target) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 bg-[#080808] rounded-2xl border border-white/10">
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
              className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'text-neutral-400 hover:text-white'
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
            <div className="absolute left-2.5 sm:left-4 top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-white via-white/40 to-transparent" />

            <h3 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2 mb-2 font-bold">
              <Briefcase size={14} /> Professional Internships
            </h3>

            {experiencesData.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Circular White Node */}
                <div className="absolute -left-6 sm:-left-10 top-6 w-5 h-5 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-[0_0_10px_#ffffff]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Experience Card */}
                <div className="bg-[#080808] rounded-3xl p-5 sm:p-7 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.04)]">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white font-bold uppercase">
                          {exp.badge}
                        </span>
                        {exp.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-white text-black text-[10px] font-mono font-bold flex items-center gap-1 shadow-[0_0_8px_#ffffff]">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                            CURRENT
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                        {exp.role}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-300 text-xs sm:text-sm font-medium mt-1">
                        <span className="flex items-center gap-1 text-white">
                          <Building size={13} /> {exp.company}
                        </span>
                        <span className="text-neutral-600">&bull;</span>
                        <span className="flex items-center gap-1 text-neutral-400 font-mono text-xs">
                          <MapPin size={12} className="text-white" /> {exp.location}
                        </span>
                      </div>
                      {exp.collaboration && (
                        <p className="text-xs text-neutral-400 font-mono mt-1">
                          {exp.collaboration}
                        </p>
                      )}
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/10 font-mono text-xs text-neutral-300 flex items-center gap-1.5 shrink-0">
                      <Calendar size={12} className="text-white" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-2 mb-5 text-neutral-300 text-xs sm:text-sm font-sans leading-relaxed">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-neutral-950 border border-white/10 text-[10px] font-mono text-neutral-400"
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
            <h3 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2 mb-3 font-bold">
              <Award size={14} /> Accredited Certifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificationsData.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-[#080808] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white font-bold">
                        {cert.badge}
                      </span>
                      <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                        <Calendar size={12} className="text-white" /> {cert.date}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base sm:text-lg text-white mb-1">
                      {cert.title}
                    </h4>
                    <p className="text-neutral-400 text-xs font-mono mb-3">{cert.issuer}</p>

                    <p className="text-neutral-400 text-xs leading-relaxed font-sans mb-4">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-neutral-950 border border-white/10 text-[10px] font-mono text-neutral-400"
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
            <h3 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2 mb-3 font-bold">
              <HeartHandshake size={14} /> Volunteering & Leadership
            </h3>

            {activitiesData.map((act, index) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-[#080808] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white shrink-0">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-white font-bold">
                        {act.badge}
                      </span>
                      <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                        <Calendar size={12} className="text-white" /> {act.period}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-white">
                      {act.organization} — <span className="text-neutral-300">{act.role}</span>
                    </h4>
                    <p className="text-neutral-400 text-xs sm:text-sm font-sans mt-1 leading-relaxed max-w-2xl">
                      {act.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
