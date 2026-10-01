import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';
import { educationData } from '../data/education';
import { experiencesData } from '../data/experience';
import { repositoriesData } from '../data/projects';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'sys.init',
      output: (
        <div className="text-[var(--muted)]">
          <p className="text-[var(--foreground)] font-bold tracking-wide">
            Tarun Harish Terminal Interface v3.0.0 [UNIX x86_64]
          </p>
          <p className="text-[var(--muted)] text-xs mt-0.5">
            Type <span className="text-[var(--foreground)] font-semibold underline underline-offset-2">'help'</span> for available commands or <span className="text-[var(--foreground)] font-semibold underline underline-offset-2">'about'</span> to view bio telemetry.
          </p>
        </div>
      ),
    },
  ]);
  const [isPhosphorMode, setIsPhosphorMode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      cyberAudio.playModal();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    cyberAudio.playClick();

    let output: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        output = (
          <div className="space-y-1 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">Available Commands:</p>
            <p><span className="text-[var(--foreground)] font-semibold">about</span>      - Display developer identity & education</p>
            <p><span className="text-[var(--foreground)] font-semibold">skills</span>     - List technical competencies & toolchains</p>
            <p><span className="text-[var(--foreground)] font-semibold">experience</span> - View industry internships & roles</p>
            <p><span className="text-[var(--foreground)] font-semibold">projects</span>   - View active GitHub repositories</p>
            <p><span className="text-[var(--foreground)] font-semibold">cognivia</span>   - Inspect Cognivia AI learning assistant architecture</p>
            <p><span className="text-[var(--foreground)] font-semibold">resume</span>     - Open PDF curriculum vitae in new tab</p>
            <p><span className="text-[var(--foreground)] font-semibold">contact</span>    - Display email, phone & social uplinks</p>
            <p><span className="text-[var(--foreground)] font-semibold">phosphor</span>   - Toggle amber/green terminal phosphor glow</p>
            <p><span className="text-[var(--foreground)] font-semibold">clear</span>      - Clear terminal buffer</p>
            <p><span className="text-[var(--foreground)] font-semibold">exit</span>       - Close terminal window</p>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-1 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">{personalData.name} — {personalData.primaryTitle}</p>
            <p>Degree: {educationData[0].degree} in {educationData[0].field}</p>
            <p>Institution: {educationData[0].institution}</p>
            <p>Location: {educationData[0].location} ({educationData[0].period})</p>
            <p className="text-[var(--muted)] text-xs mt-1">{personalData.summary}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">Technical Competencies:</p>
            <p><span className="text-[var(--foreground)]">Frontend:</span> React, Vite, JavaScript, HTML, CSS, Tailwind CSS</p>
            <p><span className="text-[var(--foreground)]">Backend:</span> Node.js, Express.js, MongoDB, JWT, REST APIs</p>
            <p><span className="text-[var(--foreground)]">Languages:</span> C, C++, Java, Python, SQL</p>
            <p><span className="text-[var(--foreground)]">AI / ML:</span> Python, Machine Learning, RAG, LLM, Google Gemini API</p>
            <p><span className="text-[var(--foreground)]">Tools:</span> Git, GitHub, VS Code, Vercel</p>
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-2 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">Experience History:</p>
            {experiencesData.map((e) => (
              <div key={e.id} className="text-xs">
                <p className="text-[var(--foreground)] font-semibold">{e.role} @ {e.company} ({e.period})</p>
                <p className="text-[var(--muted)]">{e.location}</p>
                <p className="text-[var(--foreground)]">{e.points[0]}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1.5 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">Synchronized Repositories:</p>
            {repositoriesData.map((p) => (
              <p key={p.id} className="text-xs">
                <span className="text-[var(--foreground)] font-semibold">{p.title}</span> &bull; {p.language} &bull;{' '}
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--foreground)] underline underline-offset-2">
                  {p.githubUrl}
                </a>
              </p>
            ))}
          </div>
        );
        break;

      case 'cognivia':
        output = (
          <div className="space-y-1 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">Cognivia — AI-Powered Personalized Learning Assistant</p>
            <p>Architecture: React + Vite + Express REST API + Google Gemini API</p>
            <p>Features: AI study planner, topic-specific notes, interactive quizzes, weak topic diagnostics</p>
            <p>Live Demo: <a href="https://cognivia-ivory.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-emerald-500 underline">https://cognivia-ivory.vercel.app/</a></p>
          </div>
        );
        break;

      case 'resume':
        window.open(personalData.resumeUrl, '_blank');
        output = (
          <p className="text-[var(--foreground)]">
            Opening verified curriculum vitae ({personalData.resumeUrl}) in a new browser tab...
          </p>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-[var(--muted)]">
            <p className="text-[var(--foreground)] font-bold">Communication Uplinks:</p>
            <p>Email: <a href={`mailto:${personalData.email}`} className="text-[var(--foreground)] underline underline-offset-2">{personalData.email}</a></p>
            <p>Phone: {personalData.phone}</p>
            <p>GitHub: <a href={personalData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--foreground)] underline underline-offset-2">{personalData.githubUrl}</a></p>
            <p>LinkedIn: <a href={personalData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--foreground)] underline underline-offset-2">{personalData.linkedinUrl}</a></p>
          </div>
        );
        break;

      case 'phosphor':
      case 'matrix':
        setIsPhosphorMode(!isPhosphorMode);
        output = (
          <p className="text-emerald-500 font-mono">
            {isPhosphorMode ? 'Phosphor glow mode deactivated.' : 'Phosphor glow mode activated.'}
          </p>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        output = (
          <p className="text-[var(--muted)]">
            Command not recognized: '{cmd}'. Type <span className="text-[var(--foreground)] underline underline-offset-2">'help'</span> for available commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Terminal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-3xl rounded-2xl border z-10 overflow-hidden flex flex-col h-[520px] transition-colors bg-[var(--terminal-background)] border-[var(--border-strong)] shadow-2xl ${
          isPhosphorMode
            ? 'shadow-[0_0_40px_rgba(16,185,129,0.25)] border-emerald-500/50'
            : ''
        }`}
      >
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[var(--surface-secondary)] border-b border-[var(--border)] flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-xs text-[var(--foreground)] ml-2 flex items-center gap-1.5 font-medium">
              <TerminalIcon size={12} className="text-emerald-500" />
              tarun@terminal:~
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Console Buffer */}
        <div
          ref={scrollRef}
          className={`flex-1 p-4 sm:p-6 overflow-y-auto font-mono text-xs sm:text-sm space-y-4 ${
            isPhosphorMode ? 'text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]' : 'text-[var(--foreground)]'
          }`}
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <span className="text-emerald-500 font-bold">&gt;</span>
                <span className="font-semibold">{item.command}</span>
              </div>
              <div className="pl-4 border-l border-[var(--border)]">{item.output}</div>
            </div>
          ))}
        </div>

        {/* Input Prompt */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 bg-[var(--surface-secondary)] border-t border-[var(--border)] flex items-center gap-2 shrink-0 font-mono text-xs sm:text-sm"
        >
          <span className="text-emerald-500 font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' for manual..."
            className="flex-1 bg-transparent text-[var(--foreground)] outline-none placeholder-[var(--muted)] font-mono"
          />
          <button
            type="submit"
            className="p-1.5 rounded-md bg-white text-black hover:shadow-md transition-all cursor-pointer"
          >
            <CornerDownLeft size={14} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
