import React from 'react';
import { Home, User, Layers, FolderGit2, Briefcase, Send } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export const MobileNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'HOME', href: '#hero' },
    { icon: User, label: 'WHOAMI', href: '#about' },
    { icon: Layers, label: 'STACK', href: '#stack' },
    { icon: FolderGit2, label: 'PROJECTS', href: '#projects' },
    { icon: Briefcase, label: 'CAREER', href: '#experience' },
    { icon: Send, label: 'CONTACT', href: '#contact' },
  ];

  const handleClick = (href: string) => {
    cyberAudio.playClick();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-3 inset-x-3 z-40">
      <div className="bg-neutral-950/95 backdrop-blur-md rounded-md border border-white/15 px-2 py-1 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item.href)}
            className="min-w-[42px] min-h-[40px] flex flex-col items-center justify-center gap-0.5 p-1 text-neutral-400 hover:text-white active:scale-95 transition-all focus:outline-none"
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
