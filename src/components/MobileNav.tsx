import React from 'react';
import { Home, User, FolderGit2, Briefcase, Send } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export const MobileNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', href: '#hero' },
    { icon: User, label: 'About', href: '#about' },
    { icon: FolderGit2, label: 'Projects', href: '#projects' },
    { icon: Briefcase, label: 'Experience', href: '#experience' },
    { icon: Send, label: 'Contact', href: '#contact' },
  ];

  const handleClick = (href: string) => {
    cyberAudio.playClick();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-3 inset-x-3 z-40">
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/15 px-2 py-1.5 shadow-[0_0_25px_rgba(255,255,255,0.06)] flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleClick(item.href)}
            className="min-w-[48px] min-h-[44px] flex flex-col items-center justify-center gap-1 p-1 text-neutral-400 hover:text-white active:scale-95 transition-all focus:outline-none"
            aria-label={`Navigate to ${item.label}`}
          >
            <item.icon size={18} />
            <span className="font-mono text-[9px] uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
