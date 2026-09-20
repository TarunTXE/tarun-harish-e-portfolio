import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Star,
  X,
  CheckCircle2,
  Eye,
  ChevronRight,
  FolderGit2,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { repositoriesData, featuredProject } from '../data/projects';
import type { ProjectData } from '../data/projects';
import { personalData } from '../data/personal';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>(repositoriesData);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeFeaturedImage, setActiveFeaturedImage] = useState<number>(0);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${personalData.githubUsername}/repos`);
        if (response.ok) {
          const liveRepos = await response.json();
          const merged = repositoriesData.map((repo) => {
            const matched = liveRepos.find(
              (r: { name: string }) => r.name.toLowerCase() === repo.name.toLowerCase()
            );
            if (matched) {
              return {
                ...repo,
                stars: matched.stargazers_count ?? repo.stars,
                forks: matched.forks_count ?? repo.forks,
                updatedAt: matched.updated_at ? matched.updated_at.split('T')[0] : repo.updatedAt,
                language: matched.language || repo.language,
                githubUrl: matched.html_url || repo.githubUrl,
              };
            }
            return repo;
          });
          setProjects(merged);
        }
      } catch (err) {
        console.warn('Using verified project data', err);
      }
    };

    fetchGitHubData();
  }, []);

  const filteredProjects =
    selectedFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedFilter);

  return (
    <section id="projects" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 02 / PROJECTS */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <FolderGit2 size={12} className="text-white" />
          <span>02 / PROJECTS & REPOSITORIES</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          PROJECTS & <span className="text-gradient-white">CODEBASES</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-2xl font-sans">
          Full-stack web applications, Machine Learning models, and production codebases synchronized from{' '}
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-mono font-semibold underline underline-offset-4 hover:text-neutral-300"
          >
            @{personalData.githubUsername}
          </a>.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED PROJECT — EXPANDED FLAGSHIP SHOWCASE (Black + Neon White) */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14 sm:mb-16 bg-[#080808] rounded-3xl border border-white/15 overflow-hidden relative shadow-[0_0_30px_rgba(255,255,255,0.05)] group"
      >
        {/* Subtle white ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header Strip */}
        <div className="px-5 sm:px-8 py-3.5 bg-neutral-950 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              {featuredProject.badge}
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            React.js &bull; Node.js &bull; Express.js &bull; MongoDB
          </span>
        </div>

        {/* Main Grid: Left Screenshot + Right Features */}
        <div className="p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Responsive Screenshot Viewer */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_0_20px_rgba(255,255,255,0.06)] aspect-[16/10] w-full">
              {featuredProject.screenshots && (
                <img
                  src={featuredProject.screenshots[activeFeaturedImage]}
                  alt={featuredProject.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-black/90 border border-white/20 text-neutral-300">
                  Preview {activeFeaturedImage + 1} of {featuredProject.screenshots?.length || 1}
                </span>
                {featuredProject.demoUrl && (
                  <a
                    href={featuredProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>Live App</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>

            {/* Thumbnail Selector (Minimum 44px touch target) */}
            {featuredProject.screenshots && (
              <div className="grid grid-cols-6 gap-2">
                {featuredProject.screenshots.map((shot, idx) => (
                  <button
                    key={shot}
                    onClick={() => {
                      cyberAudio.playClick();
                      setActiveFeaturedImage(idx);
                    }}
                    className={`min-h-[44px] rounded-lg overflow-hidden border transition-all aspect-[16/10] ${
                      activeFeaturedImage === idx
                        ? 'border-white ring-2 ring-white/40 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                    aria-label={`Select screenshot ${idx + 1}`}
                  >
                    <img src={shot} alt="thumbnail" loading="lazy" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Checklist */}
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-white mb-2">
              {featuredProject.title}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-5">
              {featuredProject.description}
            </p>

            {/* Resume Features Checklist */}
            <div className="space-y-2 mb-6">
              <span className="font-mono text-xs text-white uppercase tracking-wider block font-bold">
                Platform Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-sans">
                {featuredProject.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-white shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {featuredProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-neutral-950 border border-white/10 text-[11px] font-mono text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons: 44px min height */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={featuredProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
              >
                <GithubIcon size={15} />
                <span>VIEW ON GITHUB</span>
              </a>

              {featuredProject.demoUrl && (
                <a
                  href={featuredProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberAudio.playClick()}
                  onMouseEnter={() => cyberAudio.playHover()}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-neutral-950 border border-white/20 text-white font-mono text-xs flex items-center justify-center gap-2 hover:border-white transition-all"
                >
                  <ExternalLink size={14} />
                  <span>LAUNCH DEMO</span>
                </a>
              )}

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setSelectedProject(featuredProject);
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-white/15 bg-neutral-950 text-neutral-300 hover:text-white hover:border-white/40 font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye size={14} />
                <span>SYSTEM SPECS</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* REPOSITORIES GRID (1 Column Mobile, Multi-Column Desktop) */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider mr-1">Filter:</span>
            {['All', 'Full Stack', 'AI / ML', 'Web Apps'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  cyberAudio.playClick();
                  setSelectedFilter(category);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  selectedFilter === category
                    ? 'bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : 'bg-neutral-950 border border-white/10 text-neutral-400 hover:text-white hover:border-white/25'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <a
            href={`${personalData.githubUrl}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-neutral-300 hover:text-white hover:underline flex items-center gap-1"
          >
            <span>All Repositories</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* 1 Column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="bg-[#080808] rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/30 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
            >
              <div>
                {/* Optional Screenshot Header if available */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-white/10 mb-4 aspect-[16/10] bg-black">
                    <img
                      src={project.screenshots[0]}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Top Badge & Language */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 border border-white/15 text-[10px] font-mono text-neutral-300">
                    {project.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                    <span className="text-[11px] font-mono text-neutral-400">{project.language}</span>
                  </div>
                </div>

                <h4 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-neutral-200 transition-colors mb-2">
                  {project.title}
                </h4>

                <p className="text-neutral-400 text-xs sm:text-sm line-clamp-3 leading-relaxed font-sans mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-neutral-950 border border-white/10 text-[10px] font-mono text-neutral-400"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-500">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: 44px touch targets */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                  {project.stars !== undefined && (
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-white" />
                      {project.stars}
                    </span>
                  )}
                  <span>{project.updatedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setSelectedProject(project);
                    }}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-neutral-950 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-colors"
                    title="Inspect Details"
                    aria-label="Inspect project details"
                  >
                    <Eye size={15} />
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberAudio.playClick()}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-neutral-950 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-colors"
                    title="GitHub Repository"
                    aria-label="View repository"
                  >
                    <GithubIcon size={15} />
                  </a>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target={project.demoUrl.startsWith('#') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      onClick={() => cyberAudio.playClick()}
                      className="w-10 h-10 rounded-xl border border-white/10 bg-neutral-950 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-colors"
                      title="Live Demo"
                      aria-label="Open live demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all on GitHub button */}
        <div className="flex justify-center mt-6">
          <a
            href={`${personalData.githubUrl}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-[#080808] border border-white/20 hover:border-white text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <GithubIcon size={18} />
            <span>VIEW ALL REPOSITORIES ON GITHUB (@{personalData.githubUsername})</span>
            <ChevronRight size={16} />
          </a>
        </div>
      </div>

      {/* Specification Inspection Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0A0A0A] border border-white/20 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-5 py-4 bg-black border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                  <span className="font-mono text-xs text-white font-medium">
                    SYS::PROJECT // {selectedProject.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 sm:p-8 overflow-y-auto space-y-5">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs">
                    {selectedProject.badge}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mt-2">
                    {selectedProject.longDescription}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-xs text-white uppercase tracking-wider block mb-2 font-bold">
                    Key Features:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {selectedProject.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-white shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider block mb-2 font-semibold">
                    Technologies:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-black border border-white/10 text-xs font-mono text-neutral-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-colors"
                  >
                    <GithubIcon size={15} />
                    <span>View Repository</span>
                  </a>
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target={selectedProject.demoUrl.startsWith('#') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      onClick={() => setSelectedProject(null)}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl border border-white/20 bg-neutral-950 text-white font-mono text-xs flex items-center gap-2 hover:border-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      <span>{selectedProject.demoUrl.startsWith('#') ? 'Jump to Live Showcase' : 'Open Live Demo'}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
