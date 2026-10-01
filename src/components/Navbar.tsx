import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, FileText, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MusicPlayer } from './MusicPlayer';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';

interface NavbarProps {
  onOpenTerminal: () => void;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTerminal, onOpenResume }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'ABOUT', href: '#about', sectionId: 'about' },
    { name: 'STACK', href: '#stack', sectionId: 'stack' },
    { name: 'PROJECTS', href: '#projects', sectionId: 'projects' },
    { name: 'EXPERIENCE', href: '#experience', sectionId: 'experience' },
    { name: 'CONTACT', href: '#contact', sectionId: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setScrolled(scrollTop > 20);

      const sections = ['hero', 'about', 'stack', 'skills', 'projects', 'experience', 'dashboard', 'linkedin', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section === 'skills' ? 'stack' : section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    cyberAudio.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        {/* Subtle Progress Bar */}
        <div
          className="h-[1px] bg-white transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />

        <nav
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
            scrolled
              ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Brand Logo: TXE + Status Indicator */}
            <a
              href="#hero"
              onClick={() => cyberAudio.playClick()}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-base tracking-widest text-white group-hover:text-neutral-300 transition-colors">
                  TXE
                </span>
                <span className="font-mono text-neutral-600 text-xs">/</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-950 border border-white/10 text-[10px] font-mono text-neutral-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  </span>
                  <span className="tracking-wider uppercase text-neutral-300 font-medium">ONLINE</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links: ABOUT, STACK, PROJECTS, EXPERIENCE, CONTACT */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    onMouseEnter={() => cyberAudio.playHover()}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all duration-150 relative ${
                      isActive
                        ? 'text-white bg-white/10 font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-white shadow-[0_0_4px_#ffffff]" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Quick Actions: Resume, Terminal CLI, Theme Toggle, Hamburger */}
            <div className="flex items-center gap-2">
              <a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 text-xs font-mono transition-all"
              >
                <FileText size={12} />
                <span>RESUME</span>
                <ExternalLink size={10} className="text-neutral-400" />
              </a>
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenResume();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 text-xs font-mono transition-all cursor-pointer"
                title="Preview Interactive CV"
              >
                <FileText size={12} />
                <span>CV PREVIEW</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenTerminal();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 text-neutral-300 hover:text-white hover:border-white/40 text-xs font-mono transition-all"
                title="Launch CLI Terminal"
              >
                <Terminal size={13} />
                <span>&gt;_ CLI</span>
              </button>

              {/* Music Player Control */}
              <div className="hidden sm:block">
                <MusicPlayer variant="nav" />
              </div>

              {/* Desktop Minimal Terminal Toggle: [ ☾ DARK ] / [ ☀ LIGHT ] */}
              <div className="hidden sm:block">
                <ThemeToggle variant="nav" />
              </div>

              {/* Mobile Compact Music & Theme Toggles */}
              <div className="sm:hidden flex items-center gap-1.5">
                <MusicPlayer variant="compact" />
                <ThemeToggle variant="compact" />
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-md border border-white/15 bg-neutral-950 flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl px-6 pt-20 pb-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-white">TXE</span>
                <span className="text-neutral-600 font-mono">/</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-md border border-white/15 bg-neutral-900 flex items-center justify-center text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`min-h-[44px] px-4 py-3 rounded-md border flex items-center justify-between text-xs font-mono tracking-wider transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold border-white'
                      : 'border-white/10 text-neutral-300 bg-neutral-950/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-xs opacity-60 font-sans">&rarr;</span>
                </a>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-2.5">
            {/* Mobile Music Player Control */}
            <div className="mb-1">
              <MusicPlayer variant="drawer" />
            </div>

            {/* Mobile Drawer Theme Toggle */}
            <div className="mb-1">
              <ThemeToggle variant="drawer" />
            </div>

            <a
              href={personalData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-md bg-white text-black font-mono font-bold text-xs flex items-center justify-center gap-2"
            >
              <FileText size={14} />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-md bg-neutral-900 border border-white/15 text-neutral-300 font-mono text-xs flex items-center justify-center gap-2"
            >
              <FileText size={14} />
              <span>PREVIEW INTERACTIVE CV</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-md bg-neutral-950 border border-white/15 text-neutral-300 font-mono text-xs flex items-center justify-center gap-2"
            >
              <Terminal size={14} />
              <span>OPEN TERMINAL CLI</span>
            </button>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2">
              <span>{personalData.email}</span>
              <span>KERALA, IN</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
