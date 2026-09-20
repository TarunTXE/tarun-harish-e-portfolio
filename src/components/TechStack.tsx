import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Server,
  Database,
  Terminal,
  Brain,
  Wrench,
  Layers,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { skillCategories } from '../data/skills';

export const TechStack: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    languages: Terminal,
    aiml: Brain,
    frontend: Code,
    backend: Server,
    databases: Database,
    tools: Wrench,
  };

  const filteredCategories =
    activeCategory === 'all'
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === activeCategory);

  return (
    <section id="skills" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 05 / SKILLS */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Layers size={12} className="text-white" />
          <span>05 / TECHNICAL PROFICIENCIES</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          SKILLS & <span className="text-gradient-white">TECHNOLOGIES</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-xl font-sans">
          Languages, Machine Learning architectures, web frameworks, and production developer tools.
        </p>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 bg-[#080808] rounded-2xl border border-white/10">
          <button
            onClick={() => {
              cyberAudio.playClick();
              setActiveCategory('all');
            }}
            className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Stack
          </button>
          {skillCategories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Layers;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Skill Categories (1 col mobile, 2 tablet, 3 desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => {
          const Icon = categoryIcons[category.id] || Layers;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="bg-[#080808] rounded-3xl p-5 sm:p-7 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-white/15 text-white">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-950 border border-white/10 text-neutral-300">
                    {category.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed font-sans mb-5">
                  {category.description}
                </p>

                {/* Skills Pill Badges */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-white/10 text-xs font-mono text-neutral-200 hover:border-white/35 transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>VERIFIED</span>
                <span className="text-white font-medium">{category.skills.length} competencies</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
