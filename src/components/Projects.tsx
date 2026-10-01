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
import { repositoriesData, featuredProjects } from '../data/projects';
import type { ProjectData } from '../data/projects';
import { personalData } from '../data/personal';
import { ProjectsGraphic } from './graphics/SectionDecorations';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>(repositoriesData);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeFeaturedImages, setActiveFeaturedImages] = useState<Record<string, number>>({});

  const getActiveImage = (id: string) => activeFeaturedImages[id] || 0;
  const setActiveImage = (id: string, idx: number) =>
    setActiveFeaturedImages((prev) => ({ ...prev, [id]: idx }));

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
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Technical Frame Graphic Accent */}
      <div data-music-motion="decorative">
        <ProjectsGraphic className="top-10 right-8 hidden md:block" />
      </div>

      {/* Section Heading: 03 / PROJECTS.EXE with Corner Bracket Accents */}
      <div data-music-motion="section-header" className="flex flex-col items-start mb-8 sm:mb-12 relative z-10">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0 tech-corner-frame">
            <FolderGit2 size={12} className="text-emerald-500" />
            <span className="font-bold">03 // PROJECTS.EXE</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            WORKSPACE: PRODUCTION_RUN
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          ENGINEERED <span className="text-[var(--muted)]">SYSTEMS</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
          Full-stack web applications, Machine Learning models, and production codebases synchronized from{' '}
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground)] underline underline-offset-4 hover:text-emerald-500 font-medium"
          >
            @{personalData.githubUsername}
          </a>.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED PROJECTS — EXPANDED FLAGSHIP SHOWCASES */}
      {/* ========================================================================= */}
      <div className="space-y-10 sm:space-y-12 mb-14 sm:mb-16">
        {featuredProjects.map((proj, projIdx) => {
          const activeImage = getActiveImage(proj.id);
          const screenshots = proj.screenshots || [];
          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: projIdx * 0.1 }}
              data-music-motion={proj.id === 'cognivia' ? 'project-cognivia' : 'project'}
              className="bg-[var(--surface)] rounded-lg border border-[var(--border-strong)] overflow-hidden relative group shadow-lg tech-corner-frame"
            >
              {/* Top Header Strip */}
              <div className="px-5 sm:px-8 py-3.5 bg-[var(--surface-secondary)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  <span className="font-mono text-xs font-bold text-[var(--foreground)] tracking-wider uppercase">
                    {proj.badge}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--muted)]">
                  {proj.techStack.slice(0, 5).join(' • ')}
                </span>
              </div>

              {/* Main Grid: Left Screenshot + Right Features */}
              <div className="p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Responsive Screenshot Viewer */}
                <div className="lg:col-span-6 flex flex-col gap-3">
                  <div className="relative rounded-md overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-secondary)] shadow-md aspect-[16/10] w-full">
                    {screenshots.length > 0 && (
                      <img
                        src={screenshots[activeImage] || screenshots[0]}
                        alt={proj.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-md bg-[var(--surface)]/90 border border-[var(--border)] text-[var(--foreground)] text-[11px] backdrop-blur-sm shadow-sm">
                        Preview {activeImage + 1} of {screenshots.length || 1}
                      </span>
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-md bg-white text-black font-bold hover:shadow-md transition-colors flex items-center gap-1.5 text-xs"
                        >
                          <span>Live App</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Selector */}
                  {screenshots.length > 1 && (
                    <div className="grid grid-cols-6 gap-2">
                      {screenshots.map((shot, idx) => (
                        <button
                          key={shot}
                          onClick={() => {
                            cyberAudio.playClick();
                            setActiveImage(proj.id, idx);
                          }}
                          className={`min-h-[44px] rounded-md overflow-hidden border transition-all aspect-[16/10] cursor-pointer ${
                            activeImage === idx
                              ? 'border-[var(--foreground)] ring-2 ring-emerald-500/50'
                              : 'border-[var(--border)] opacity-60 hover:opacity-100'
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
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-[var(--foreground)] mb-2">
                    {proj.title}
                  </h3>
                  <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed mb-5">
                    {proj.description}
                  </p>

                  {/* Capabilities Checklist */}
                  <div className="space-y-2 mb-6">
                    <span className="font-mono text-xs text-[var(--foreground)] uppercase tracking-wider block font-bold">
                      Platform Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--foreground)] font-sans">
                      {proj.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => cyberAudio.playConfirm()}
                      onMouseEnter={() => cyberAudio.playHover()}
                      className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-md bg-white text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer"
                    >
                      <GithubIcon size={15} />
                      <span>VIEW ON GITHUB</span>
                    </a>

                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => cyberAudio.playConfirm()}
                        onMouseEnter={() => cyberAudio.playHover()}
                        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-strong)] text-[var(--foreground)] font-mono text-xs flex items-center justify-center gap-2 hover:border-[var(--foreground)] transition-all cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        <span>LAUNCH DEMO</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        cyberAudio.playConfirm();
                        setSelectedProject(proj);
                      }}
                      onMouseEnter={() => cyberAudio.playHover()}
                      className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>SYSTEM SPECS</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* REPOSITORIES GRID */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider mr-1">Filter:</span>
            {['All', 'Full Stack', 'AI / ML', 'Web Apps'].map((category) => (
              <button
                key={category}
                onClick={() => {
                  cyberAudio.playClick();
                  setSelectedFilter(category);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  selectedFilter === category
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)]'
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
            className="text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] hover:underline flex items-center gap-1"
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
              data-music-motion="project-card"
              className="bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] hover:border-[var(--foreground)] flex flex-col justify-between group transition-all duration-200 shadow-sm"
            >
              <div>
                {/* Optional Screenshot Header */}
                {project.screenshots && project.screenshots.length > 0 && (
                  <div className="rounded-md overflow-hidden border border-[var(--border)] mb-4 aspect-[16/10] bg-[var(--surface-secondary)]">
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
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)]">
                    {project.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />
                    <span className="text-[11px] font-mono text-[var(--muted)]">{project.language}</span>
                  </div>
                </div>

                <h4 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] group-hover:text-emerald-500 transition-colors mb-2">
                  {project.title}
                </h4>

                <p className="text-[var(--muted)] text-xs sm:text-sm line-clamp-3 leading-relaxed font-sans mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--muted)]">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 text-[var(--muted)] text-[11px]">
                  {project.stars !== undefined && (
                    <span className="flex items-center gap-1 text-[var(--foreground)]">
                      <Star size={12} className="text-amber-500" />
                      {project.stars}
                    </span>
                  )}
                  <span>{project.updatedAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      cyberAudio.playConfirm();
                      setSelectedProject(project);
                    }}
                    className="w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors cursor-pointer"
                    title="Inspect Details"
                    aria-label="Inspect project details"
                  >
                    <Eye size={15} />
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberAudio.playConfirm()}
                    className="w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
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
                      onClick={() => cyberAudio.playConfirm()}
                      className="w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
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
            onClick={() => cyberAudio.playConfirm()}
            onMouseEnter={() => cyberAudio.playHover()}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-md bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--foreground)] text-[var(--foreground)] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-sm"
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
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-2xl bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-5 py-4 bg-[var(--surface-secondary)] border-b border-[var(--border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  <span className="font-mono text-xs text-[var(--foreground)] font-medium">
                    SYS::PROJECT // {selectedProject.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-9 h-9 rounded-md bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] flex items-center justify-center border border-[var(--border)] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 sm:p-8 overflow-y-auto space-y-5 bg-[var(--surface)] text-[var(--foreground)]">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs">
                    {selectedProject.badge}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--foreground)] mt-2">
                    {selectedProject.title}
                  </h3>
                  <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed mt-2">
                    {selectedProject.longDescription}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-xs text-[var(--foreground)] uppercase tracking-wider block mb-2 font-bold">
                    Key Features:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[var(--foreground)]">
                    {selectedProject.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider block mb-2 font-semibold">
                    Technologies:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-3">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-5 py-2.5 rounded-md bg-white text-black font-mono font-bold text-xs flex items-center gap-2 hover:shadow-md transition-all cursor-pointer"
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
                      className="min-h-[44px] px-5 py-2.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[var(--foreground)] font-mono text-xs flex items-center gap-2 hover:border-[var(--foreground)] transition-colors cursor-pointer"
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
    </motion.section>
  );
};
