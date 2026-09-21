import React from 'react';
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
  if (!isOpen) return null;

  const handlePrint = () => {
    cyberAudio.playClick();
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
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Resume Document Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl rounded-3xl bg-[#080808] border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.08)] z-10 my-6 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-black border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            <span className="font-mono text-xs text-white font-medium">
              CURRICULUM_VITAE // TARUN_HARISH_E.PDF
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={personalData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio.playClick()}
              onMouseEnter={() => cyberAudio.playHover()}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white text-black font-bold text-xs font-mono flex items-center gap-1.5 hover:bg-neutral-200 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Open PDF</span>
            </a>

            <a
              href={personalData.resumeUrl}
              download="Tarun_Harish_E_Resume.pdf"
              onClick={() => cyberAudio.playClick()}
              onMouseEnter={() => cyberAudio.playHover()}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/15 hover:border-white text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={handlePrint}
              onMouseEnter={() => cyberAudio.playHover()}
              className="hidden sm:flex min-h-[38px] px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/15 hover:border-white text-neutral-300 hover:text-white text-xs font-mono items-center gap-1.5 transition-colors"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors ml-1"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Resume Body */}
        <div className="p-5 sm:p-8 overflow-y-auto font-sans text-neutral-200 space-y-6 bg-[#080808]">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 text-center sm:text-left flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">{personalData.name}</h1>
              <p className="font-mono text-xs sm:text-sm text-neutral-300 mt-1">
                {personalData.primaryTitle} &bull; MERN Stack & Applied AI
              </p>
            </div>
            <div className="text-right text-xs font-mono text-neutral-400 space-y-1">
              <div>{personalData.location}</div>
              <div>
                <a href={`mailto:${personalData.email}`} className="text-white hover:underline">
                  {personalData.email}
                </a>
              </div>
              <div>{personalData.phone}</div>
              <div className="text-neutral-300">
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
            <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-2">
              Summary
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {personalData.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
              <GraduationCap size={15} /> Education
            </h2>
            <div className="p-4 rounded-xl bg-black border border-white/10">
              <div className="flex justify-between items-baseline">
                <strong className="text-white font-semibold text-sm">
                  {edu.institution}
                </strong>
                <span className="font-mono text-xs text-neutral-300">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-xs text-neutral-300 italic">{edu.degree} in {edu.field}</span>
                <span className="font-mono text-xs text-neutral-400">{edu.period}</span>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
              <Briefcase size={15} /> Experience
            </h2>
            <div className="space-y-3">
              {experiencesData.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-black border border-white/10">
                  <div className="flex justify-between items-baseline">
                    <strong className="text-white font-semibold text-sm">{exp.company}</strong>
                    <span className="font-mono text-xs text-white">{exp.period}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-neutral-400 italic mb-2">
                    <span>{exp.role}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-white">&bull;</span>
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
            <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
              <Code size={15} /> Featured Projects
            </h2>
            <div className="space-y-3">
              {featuredProjects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-black border border-white/10">
                  <div className="flex justify-between items-baseline mb-1">
                    <strong className="text-white font-semibold text-sm">{proj.title}</strong>
                    <span className="font-mono text-xs text-neutral-400">
                      {proj.techStack.slice(0, 4).join(', ')}
                    </span>
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-300 mt-2">
                    {proj.features.slice(0, 4).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-white">&bull;</span>
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
            <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-2">
              Technical Skills
            </h2>
            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-1.5 text-xs text-neutral-300">
              <p><strong className="text-white">Languages:</strong> Python, Java, C, JavaScript, SQL</p>
              <p><strong className="text-white">Machine Learning &amp; AI:</strong> Supervised Learning, Unsupervised Learning, Deep Learning, Reinforcement Learning, IBM watsonx/Watson Studio, RAG Architectures</p>
              <p><strong className="text-white">Frontend:</strong> HTML5, CSS3, React.js</p>
              <p><strong className="text-white">Backend:</strong> Node.js, Express.js, Django, FastAPI, fastembed, Groq API</p>
              <p><strong className="text-white">Databases:</strong> MongoDB, SQLite, MySQL, ChromaDB</p>
              <p><strong className="text-white">Tools:</strong> Git, GitHub, VS Code, Render, Vercel</p>
            </div>
          </div>

          {/* Activities & Certifications */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-2 flex items-center gap-1.5">
              <Award size={15} /> Activities & Certifications
            </h2>
            <div className="p-4 rounded-xl bg-black border border-white/10 space-y-2 text-xs">
              {activitiesData.map((act) => (
                <div key={act.id} className="flex justify-between items-baseline">
                  <span className="text-white font-medium">{act.organization} – {act.role}</span>
                  <span className="font-mono text-neutral-400">{act.period}</span>
                </div>
              ))}
              {certificationsData.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <span className="text-white font-medium">{cert.title} – {cert.issuer}</span>
                  <span className="font-mono text-neutral-400">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
