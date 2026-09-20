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
        <div className="text-zinc-300">
          <p className="text-white font-bold tracking-wide">
            Tarun Harish Terminal Interface v3.0.0 [UNIX x86_64]
          </p>
          <p className="text-zinc-500 text-xs mt-0.5">
            Type <span className="text-white font-semibold underline underline-offset-2">'help'</span> for available commands or <span className="text-white font-semibold underline underline-offset-2">'about'</span> to view bio telemetry.
          </p>
        </div>
      ),
    },
  ]);
  const [isMatrixMode, setIsMatrixMode] = useState(false);

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
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-bold">Available Commands:</p>
            <p><span className="text-white font-semibold">about</span>      - Display developer identity & education</p>
            <p><span className="text-white font-semibold">skills</span>     - List technical competencies & toolchains</p>
            <p><span className="text-white font-semibold">experience</span> - View industry internships & roles</p>
            <p><span className="text-white font-semibold">projects</span>   - View active GitHub repositories</p>
            <p><span className="text-white font-semibold">sih</span>        - Inspect wheelchair assistive vision architecture</p>
            <p><span className="text-white font-semibold">resume</span>     - Open PDF curriculum vitae in new tab</p>
            <p><span className="text-white font-semibold">contact</span>    - Display email, phone & social uplinks</p>
            <p><span className="text-white font-semibold">matrix</span>     - Toggle monochrome phosphor glow mode</p>
            <p><span className="text-white font-semibold">clear</span>      - Clear terminal buffer</p>
            <p><span className="text-white font-semibold">exit</span>       - Close terminal window</p>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-bold">{personalData.name} — {personalData.primaryTitle}</p>
            <p>Degree: {educationData[0].degree} in {educationData[0].field}</p>
            <p>Institution: {educationData[0].institution}</p>
            <p>Location: {educationData[0].location} ({educationData[0].period})</p>
            <p className="text-zinc-400 text-xs mt-1">{personalData.summary}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-bold">Technical Competencies:</p>
            <p><span className="text-zinc-400">Languages:</span> Python, Java, C, JavaScript, SQL</p>
            <p><span className="text-zinc-400">Machine Learning & AI:</span> Supervised Learning, Unsupervised Learning, Deep Learning, Reinforcement Learning (Q-Learning), IBM watsonx, Watson Studio, Teachable Machine</p>
            <p><span className="text-zinc-400">Frontend:</span> HTML5, CSS3, React.js, Tailwind CSS</p>
            <p><span className="text-zinc-400">Backend:</span> Node.js, Express.js, Django</p>
            <p><span className="text-zinc-400">Databases:</span> MongoDB, SQLite, MySQL</p>
            <p><span className="text-zinc-400">Tools:</span> Git, GitHub, VS Code</p>
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-2 text-zinc-300">
            <p className="text-white font-bold">Experience History:</p>
            {experiencesData.map((e) => (
              <div key={e.id} className="text-xs">
                <p className="text-white font-semibold">{e.role} @ {e.company} ({e.period})</p>
                <p className="text-zinc-400">{e.location}</p>
                <p className="text-zinc-300">{e.points[0]}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1.5 text-zinc-300">
            <p className="text-white font-bold">Synchronized Repositories:</p>
            {repositoriesData.map((p) => (
              <p key={p.id} className="text-xs">
                <span className="text-white font-semibold">{p.title}</span> &bull; {p.language} &bull;{' '}
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline underline-offset-2">
                  {p.githubUrl}
                </a>
              </p>
            ))}
          </div>
        );
        break;

      case 'sih':
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-bold">Wheelchair Pressure Relief Pushup Detection (SIH National Finalist)</p>
            <p>Framework: OpenCV + MediaPipe Pose 33-landmark estimation</p>
            <p>Classifier: Random Forest Ensemble Model (Scikit-Learn)</p>
            <p>Clinical Purpose: Prevent pressure ulcers via automated posture monitoring</p>
          </div>
        );
        break;

      case 'resume':
        window.open(personalData.resumeUrl, '_blank');
        output = (
          <p className="text-white">
            Opening verified curriculum vitae ({personalData.resumeUrl}) in a new browser tab...
          </p>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-bold">Communication Uplinks:</p>
            <p>Email: <a href={`mailto:${personalData.email}`} className="text-zinc-300 hover:text-white underline underline-offset-2">{personalData.email}</a></p>
            <p>Phone: {personalData.phone}</p>
            <p>GitHub: <a href={personalData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline underline-offset-2">{personalData.githubUrl}</a></p>
            <p>LinkedIn: <a href={personalData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white underline underline-offset-2">{personalData.linkedinUrl}</a></p>
          </div>
        );
        break;

      case 'matrix':
        setIsMatrixMode(!isMatrixMode);
        output = (
          <p className="text-white font-mono">
            {isMatrixMode ? 'Phosphor glow mode deactivated.' : 'Phosphor glow mode activated.'}
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
          <p className="text-zinc-400">
            Command not recognized: '{cmd}'. Type <span className="text-white underline underline-offset-2">'help'</span> for available commands.
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
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Terminal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-3xl rounded-2xl border z-10 overflow-hidden flex flex-col h-[520px] transition-colors bg-[#0A0A0A] ${
          isMatrixMode
            ? 'border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.2)]'
            : 'border-white/15 shadow-[0_0_40px_rgba(255,255,255,0.06)]'
        }`}
      >
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-[#101010] border-b border-white/10 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <span className="font-mono text-xs text-zinc-300 ml-2 flex items-center gap-1.5">
              <TerminalIcon size={12} className="text-white" />
              tarun@terminal:~
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Console Buffer */}
        <div
          ref={scrollRef}
          className={`flex-1 p-4 sm:p-6 overflow-y-auto font-mono text-xs sm:text-sm space-y-4 ${
            isMatrixMode ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]' : 'text-zinc-200'
          }`}
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-white">
                <span className="text-white font-bold">&gt;</span>
                <span className="text-zinc-100 font-semibold">{item.command}</span>
              </div>
              <div className="pl-4 border-l border-white/10">{item.output}</div>
            </div>
          ))}
        </div>

        {/* Input Prompt */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 bg-[#0D0D0D] border-t border-white/10 flex items-center gap-2 shrink-0 font-mono text-xs sm:text-sm"
        >
          <span className="text-white font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' for command manual..."
            className="flex-1 bg-transparent text-white outline-none placeholder-zinc-600 font-mono"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
          >
            <CornerDownLeft size={14} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
