import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cyberAudio } from '../utils/audio';

export const Achievements: React.FC = () => {
  const triggerConfetti = () => {
    cyberAudio.playClick();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#8b5cf6', '#22d3ee', '#f59e0b'],
    });
  };

  const achievements = [
    {
      title: 'Smart India Hackathon (SIH)',
      desc: 'National Finalist for AI Assistive Wheelchair Push-up Detection System.',
      badge: 'National Finalist',
      icon: Trophy,
      color: 'from-amber-400 to-orange-500',
      border: 'border-amber-400/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    },
    {
      title: 'IBM SkillsBuild ML Internship',
      desc: 'Awarded completion credential in Machine Learning and Applied Artificial Intelligence.',
      badge: 'IBM Credential',
      icon: Award,
      color: 'from-cyber-blue to-cyan-400',
      border: 'border-cyber-blue/40',
      glow: 'shadow-glow-blue/20',
    },
    {
      title: 'Full Stack MERN Certification',
      desc: 'Certified by Dr. Angela Yu with 60+ hours of full stack engineering projects.',
      badge: 'Dr. Angela Yu',
      icon: Star,
      color: 'from-cyber-purple to-pink-500',
      border: 'border-cyber-purple/40',
      glow: 'shadow-glow-purple/20',
    },
    {
      title: 'AICTE Virtual Internship',
      desc: 'Recognized by the Ministry of Education & AICTE for AI and cloud software coursework.',
      badge: 'Govt. of India',
      icon: ShieldCheck,
      color: 'from-emerald-400 to-teal-500',
      border: 'border-emerald-400/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    },
  ];

  return (
    <section id="achievements" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs uppercase tracking-widest mb-3">
          <Trophy size={13} />
          Accolades // Phase 07
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          Honors & <span className="text-gradient-gold">Milestones</span>
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl font-sans">
          Distinctions earned through competitive engineering hackathons, accredited internships, and technical contributions.
        </p>
      </div>

      {/* Grid of Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {achievements.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={triggerConfetti}
            onMouseEnter={() => cyberAudio.playHover()}
            className={`group glass-panel rounded-3xl p-6 border ${item.border} ${item.glow} cursor-pointer hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} text-slate-950 shadow-md`}>
                  <item.icon size={22} />
                </div>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                  {item.badge}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans mb-4">
                {item.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-cyber-cyan">
                <CheckCircle2 size={12} /> Verified
              </span>
              <span className="text-amber-400/80 group-hover:underline">Click for Cheers 🎉</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
