import React from 'react';
import { Home, User, Layers, FolderGit2, Briefcase, Send } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export const MobileNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'HOME', sectionId: 'hero' },
    { icon: User, label: 'WHOAMI', sectionId: 'about' },
    { icon: Layers, label: 'STACK', sectionId: 'stack' },
    { icon: FolderGit2, label: 'PROJECTS', sectionId: 'projects' },
    { icon: Briefcase, label: 'CAREER', sectionId: 'experience' },
    { icon: Send, label: 'CONTACT', sectionId: 'contact' },
  ];

  const handleClick = (sectionId: string) => {
    cyberAudio.playTab();
    if (sectionId === 'hero' || sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-3 z-40">
      <div className="bg-[var(--surface)]/95 backdrop-blur-md rounded-md border border-[var(--border-strong)] px-2 py-1 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item.sectionId)}
            className="min-w-[42px] min-h-[40px] flex flex-col items-center justify-center gap-0.5 p-1 text-[var(--muted)] hover:text-[var(--foreground)] active:scale-95 transition-all focus:outline-none cursor-pointer"
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon size={15} />
            <span className="font-mono text-[8px] uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
