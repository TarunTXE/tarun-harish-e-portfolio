import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Printer,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Download,
  ExternalLink,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';
import { educationData } from '../data/education';
import { experiencesData } from '../data/experience';
import { featuredProjects } from '../data/projects';
import { certificationsData } from '../data/certifications';
import { activitiesData } from '../data/activities';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      cyberAudio.playModal();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    cyberAudio.playConfirm();
    window.print();
  };

  const edu = educationData[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Resume Document Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl rounded-2xl bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl z-10 my-6 overflow-hidden max-h-[92vh] flex flex-col text-[var(--foreground)]"
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-[var(--surface-secondary)] border-b border-[var(--border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
            <span className="font-mono text-xs text-[var(--foreground)] font-medium">
              CURRICULUM_VITAE // TARUN_HARISH_E.PDF
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={personalData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio.playConfirm()}
              onMouseEnter={() => cyberAudio.playHover()}
              className="min-h-[38px] px-3 py-1.5 rounded-md bg-white text-black font-bold text-xs font-mono flex items-center gap-1.5 hover:shadow-md transition-all cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Open PDF</span>
            </a>

            <a
              href={personalData.resumeUrl}
              download="Tarun_Harish_E_Resume.pdf"
              onClick={() => cyberAudio.playConfirm()}
              onMouseEnter={() => cyberAudio.playHover()}
              className="min-h-[38px] px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground)] text-[var(--foreground)] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={handlePrint}
              onMouseEnter={() => cyberAudio.playHover()}
              className="hidden sm:flex min-h-[38px] px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground)] text-[var(--muted)] hover:text-[var(--foreground)] text-xs font-mono items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] flex items-center justify-center transition-colors ml-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Resume Body */}
        <div className="p-5 sm:p-8 overflow-y-auto font-sans text-[var(--foreground)] space-y-6 bg-[var(--surface)]">
          {/* Header */}
          <div className="border-b border-[var(--border)] pb-6 text-center sm:text-left flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--foreground)]">{personalData.name}</h1>
              <p className="font-mono text-xs sm:text-sm text-[var(--muted)] mt-1">
                {personalData.primaryTitle} &bull; MERN Stack & Applied AI
              </p>
            </div>
            <div className="text-right text-xs font-mono text-[var(--muted)] space-y-1">
              <div>{personalData.location}</div>
              <div>
                <a href={`mailto:${personalData.email}`} className="text-[var(--foreground)] hover:underline">
                  {personalData.email}
                </a>
              </div>
              <div>{personalData.phone}</div>
              <div className="text-[var(--foreground)]">
                <a href={personalData.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  github.com/TarunTXE
                </a>
                {' | '}
                <a href={personalData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  linkedin.com/in/taruntxe
                </a>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-bold mb-2">
              Summary
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-sans">
              {personalData.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-bold mb-2 flex items-center gap-1.5">
              <GraduationCap size={15} className="text-emerald-500" /> Education
            </h2>
            <div className="p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)]">
              <div className="flex justify-between items-baseline">
                <strong className="text-[var(--foreground)] font-semibold text-sm">
                  {edu.institution}
                </strong>
                <span className="font-mono text-xs text-[var(--muted)]">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-[var(--muted)] italic">{edu.degree} in {edu.field}</span>
                <span className="font-mono text-xs text-[var(--muted)]">{edu.period}</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-bold mb-2 flex items-center gap-1.5">
              <Briefcase size={15} className="text-emerald-500" /> Experience
            </h2>
            <div className="space-y-3">
              {experiencesData.map((exp) => (
                <div key={exp.id} className="p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-[var(--foreground)] font-semibold text-sm">{exp.company}</strong>
                    <span className="font-mono text-xs text-[var(--muted)]">{exp.period}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-[var(--muted)] italic mb-2">
                    <span>{exp.role}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[var(--foreground)]">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500">&bull;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-bold mb-2 flex items-center gap-1.5">
              <Code size={15} className="text-emerald-500" /> Featured Projects
            </h2>
            <div className="space-y-3">
              {featuredProjects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)]">
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-[var(--foreground)] font-semibold text-sm">{proj.title}</strong>
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {proj.techStack.slice(0, 4).join(', ')}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-[var(--foreground)] mt-2">
                    {proj.features.slice(0, 4).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500">&bull;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-bold mb-2">
              Technical Skills
            </h2>
            <div className="p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] space-y-1.5 text-xs text-[var(--foreground)]">
              <p><strong className="text-[var(--foreground)] font-semibold">Languages:</strong> Python, Java, C, JavaScript, SQL</p>
              <p><strong className="text-[var(--foreground)] font-semibold">Machine Learning &amp; AI:</strong> Supervised Learning, Unsupervised Learning, Deep Learning, Reinforcement Learning, IBM watsonx/Watson Studio, RAG Architectures</p>
              <p><strong className="text-[var(--foreground)] font-semibold">Frontend:</strong> HTML5, CSS3, React.js</p>
              <p><strong className="text-[var(--foreground)] font-semibold">Backend:</strong> Node.js, Express.js, Django, FastAPI, fastembed, Groq API</p>
              <p><strong className="text-[var(--foreground)] font-semibold">Databases:</strong> MongoDB, SQLite, MySQL, ChromaDB</p>
              <p><strong className="text-[var(--foreground)] font-semibold">Tools:</strong> Git, GitHub, VS Code, Render, Vercel</p>
            </div>
          </div>

          {/* Activities & Certifications */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] font-bold mb-2 flex items-center gap-1.5">
              <Award size={15} className="text-emerald-500" /> Activities & Certifications
            </h2>
            <div className="p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] space-y-2 text-xs text-[var(--foreground)]">
              {activitiesData.map((act) => (
                <div key={act.id} className="flex justify-between items-baseline">
                  <span className="font-medium">{act.organization} – {act.role}</span>
                  <span className="font-mono text-[var(--muted)]">{act.period}</span>
                </div>
              ))}
              {certificationsData.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <span className="font-medium">{cert.title} – {cert.issuer}</span>
                  <span className="font-mono text-[var(--muted)]">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
