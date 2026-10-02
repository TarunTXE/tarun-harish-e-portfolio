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
    { name: 'ABOUT', sectionId: 'about' },
    { name: 'STACK', sectionId: 'stack' },
    { name: 'PROJECTS', sectionId: 'projects' },
    { name: 'EXPERIENCE', sectionId: 'experience' },
    { name: 'CONTACT', sectionId: 'contact' },
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

  const handleNavClick = (sectionId: string) => {
    cyberAudio.playTab();
    setMobileMenuOpen(false);
    if (sectionId === 'hero' || sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        {/* Subtle Progress Bar */}
        <div
          className="h-[2px] bg-emerald-500 transition-all duration-100 ease-out shadow-[0_0_6px_#10b981]"
          style={{ width: `${scrollProgress}%` }}
        />

        <nav
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
            scrolled
              ? 'bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm'
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Brand Logo: TXE + Status Indicator */}
            <button
              type="button"
              data-music-motion="nav-brand"
              onClick={() => {
                cyberAudio.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group cursor-pointer text-left bg-transparent border-0 p-0"
              aria-label="Tarun Harish E - Return to Top"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-base tracking-widest text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">
                  TXE
                </span>
                <span className="font-mono text-[var(--muted)] text-xs">/</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)] shadow-xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_6px_#10b981] txe-online-glow" />
                  </span>
                  <span className="tracking-wider uppercase font-semibold text-[var(--foreground)]">ONLINE</span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <button
                    key={link.name}
                    type="button"
                    data-music-motion="nav-item"
                    onClick={() => handleNavClick(link.sectionId)}
                    onMouseEnter={() => cyberAudio.playHover()}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all duration-150 relative cursor-pointer ${
                      isActive
                        ? 'text-[var(--foreground)] bg-[var(--surface)] border border-[var(--border)] font-bold shadow-xs'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] border border-transparent'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[1px] bg-emerald-500 shadow-[0_0_4px_#10b981] txe-scanner-blink" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions: Resume, Terminal CLI, Theme Toggle, Music */}
            <div className="flex items-center gap-2">
              <a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-music-motion="nav-action"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] text-xs font-mono transition-all shadow-xs"
              >
                <FileText size={12} />
                <span>RESUME</span>
                <ExternalLink size={10} className="text-[var(--muted)]" />
              </a>
              <button
                data-music-motion="nav-action"
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenResume();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] text-xs font-mono transition-all cursor-pointer shadow-xs"
                title="Preview Interactive CV"
              >
                <FileText size={12} />
                <span>CV PREVIEW</span>
              </button>

              <button
                data-music-motion="nav-action"
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenTerminal();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] text-xs font-mono transition-all cursor-pointer shadow-xs"
                title="Launch CLI Terminal"
              >
                <Terminal size={13} />
                <span>CLI</span>
              </button>

              {/* Music Player Control */}
              <div className="hidden sm:block">
                <MusicPlayer variant="nav" />
              </div>

              {/* Desktop Theme Toggle: [ ☾ DARK ] / [ ☀ LIGHT ] */}
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
                className="md:hidden w-9 h-9 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] active:scale-95 transition-transform cursor-pointer shadow-xs"
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
        <div className="md:hidden fixed inset-0 z-50 bg-[var(--background)]/95 backdrop-blur-2xl px-6 pt-20 pb-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200 text-[var(--foreground)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-[var(--foreground)]">TXE</span>
                <span className="text-[var(--muted)] font-mono">/</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {navLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.sectionId)}
                  className={`min-h-[44px] px-4 py-3 rounded-md border flex items-center justify-between text-xs font-mono tracking-wider transition-all cursor-pointer w-full text-left ${
                    isActive
                      ? 'bg-white text-black font-bold border-white shadow-sm'
                      : 'border-[var(--border)] text-[var(--foreground)] bg-[var(--surface)] hover:border-[var(--foreground)]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-xs opacity-60 font-sans">&rarr;</span>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[var(--border)] flex flex-col gap-2.5">
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
              className="min-h-[44px] px-4 py-2.5 rounded-md bg-white text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText size={14} />
              <span>DOWNLOAD RESUME (PDF)</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText size={14} />
              <span>PREVIEW INTERACTIVE CV</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTerminal();
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal size={14} />
              <span>OPEN TERMINAL CLI</span>
            </button>

            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)] pt-2">
              <span>{personalData.email}</span>
              <span>KERALA, IN</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
