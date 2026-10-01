import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  Terminal,
  Brain,
  Wrench,
  Layers,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { skillCategories } from '../data/skills';
import { StackGraphic } from './graphics/SectionDecorations';

export const TechStack: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    frontend: Code2,
    backend: Server,
    languages: Terminal,
    aiml: Brain,
    tools: Wrench,
  };

  const skillContextMap: Record<string, string> = {
    'React': 'Component architecture, custom hooks & virtual DOM optimization',
    'Vite': 'Ultra-fast HMR and optimized production bundle compilation',
    'JavaScript': 'ES6+ asynchronous execution, closures & event loop systems',
    'HTML': 'Semantic markup, accessibility standards & SEO structure',
    'CSS': 'Responsive layouts, modern Grid/Flexbox & CSS variables',
    'Tailwind CSS': 'Utility-first rapid design tokens and dark mode styling',
    'Node.js': 'Event-driven non-blocking I/O server runtime environments',
    'Express.js': 'RESTful API routing, middleware chaining & error pipelines',
    'MongoDB': 'NoSQL document schemas, indexing & aggregation queries',
    'JWT': 'Stateless secure authentication & role-based authorization',
    'REST APIs': 'Standardized HTTP status contracts, endpoints & serialization',
    'C': 'Memory management, pointers, and foundational computer systems',
    'C++': 'Object-oriented programming, STL, and computational algorithms',
    'Java': 'OOP design principles, robust multithreading & data structures',
    'Python': 'Primary language for ML modeling, scripting & API servers',
    'SQL': 'Relational queries, schema normalization & ACID compliance',
    'Machine Learning': 'Supervised classification, regression, Random Forest & scikit-learn',
    'RAG': 'Retrieval-Augmented Generation with vector embeddings and prompt context',
    'LLM': 'Integration with large language models, inference APIs & WATSONX',
    'AI Applications': 'Smart posture detection, computer vision & intelligent assistants',
    'Git': 'Distributed version control, branching workflows & commit discipline',
    'GitHub': 'CI/CD workflows, open-source repositories & issue tracking',
    'VS Code': 'Primary development environment with custom linting & extensions',
    'Vercel': 'Production edge deployment, serverless functions & global CDN',
  };

  const filteredCategories =
    selectedCategory === 'all'
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === selectedCategory);

  return (
    <motion.section
      id="stack"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Anchor for #skills backward compatibility */}
      <div id="skills" className="absolute -top-20" />

      {/* Decorative Technical Node Network & Dot Matrix near Edge */}
      <div data-music-motion="decorative">
        <StackGraphic className="top-12 right-6 hidden md:block" />
      </div>

      {/* Section Header: 02 / STACK */}
      <div data-music-motion="section-header" className="flex flex-col items-start mb-8 sm:mb-12 relative z-10">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0">
            <Layers size={12} className="text-emerald-500" />
            <span className="font-bold">02 // STACK</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            MATRIX: TECH_SPECS
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          TECHNICAL <span className="text-[var(--muted)]">MODULES</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Interactive modules covering frontend clients, backend runtimes, core programming languages, AI/ML pipelines, and developer tooling.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-6 p-1 bg-[var(--surface)] rounded-md border border-[var(--border)] shadow-sm">
          <button
            onClick={() => {
              cyberAudio.playClick();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            ALL MODULES
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                cyberAudio.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Interactive Technical Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filteredCategories.map((category, index) => {
          const Icon = categoryIcons[category.id] || Layers;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              data-music-motion="stack-card"
              className="bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] hover:border-[var(--foreground)] transition-all duration-200 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)]">
                      <Icon size={16} />
                    </div>
                    <span className="font-mono font-bold text-sm text-[var(--foreground)] tracking-wider">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--muted)]">
                    {category.badge}
                  </span>
                </div>

                <p className="text-[var(--muted)] text-xs leading-relaxed font-sans mb-5">
                  {category.description}
                </p>

                {/* Interactive Skill Modules Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {category.skills.map((skill) => (
                    <div
                      key={skill}
                      onMouseEnter={() => {
                        cyberAudio.playHover();
                        setHoveredSkill(skill);
                      }}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="p-2.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group/skill cursor-default"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-medium text-[var(--foreground)] group-hover/skill:text-emerald-500 transition-colors">
                          {skill}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)] group-hover/skill:bg-emerald-500 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Footer Info */}
              <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-emerald-500 font-medium">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  STANDARDIZED
                </span>
                <span>{category.skills.length} MODULES</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Technical Inspector Bar */}
      <div className="mt-6 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-strong)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono shadow-sm relative z-10">
        <div className="flex items-center gap-2 text-[var(--muted)]">
          <Terminal size={14} className="text-emerald-500 shrink-0" />
          <span className="uppercase font-semibold">INSPECTOR:</span>
          <span className="text-[var(--foreground)] font-medium">
            {hoveredSkill ? hoveredSkill : 'Hover any module tile to inspect telemetry'}
          </span>
        </div>
        <div className="text-[var(--muted)] text-[11px]">
          {hoveredSkill && skillContextMap[hoveredSkill] ? (
            <span className="text-[var(--foreground)]">{skillContextMap[hoveredSkill]}</span>
          ) : (
            <span>SYSTEM :: VERIFIED TECH STACK</span>
          )}
        </div>
      </div>
    </motion.section>
  );
};
