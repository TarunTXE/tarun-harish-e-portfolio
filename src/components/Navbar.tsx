import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, FileText, ExternalLink } from 'lucide-react';
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
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Special Project', href: '#sih-showcase' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'GitHub', href: '#dashboard' },
    { name: 'LinkedIn', href: '#linkedin' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setScrolled(scrollTop > 30);

      const sections = ['hero', 'about', 'projects', 'sih-showcase', 'experience', 'skills', 'dashboard', 'linkedin', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
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
        {/* Neon White Top Progress Line */}
        <div
          className="h-[1.5px] bg-white transition-all duration-100 ease-out shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />

        <nav
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
            scrolled
              ? 'mt-2 mx-3 sm:mx-auto bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.06)]'
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#hero"
              onClick={() => cyberAudio.playClick()}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-[1px] group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300">
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-mono font-bold text-white text-xs tracking-wider">
                  TH
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-wide text-white group-hover:text-neutral-200 transition-colors">
                  {personalData.name}
                </span>
                <span className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase">
                  &lt;FULL-STACK :: AI /&gt;
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    onMouseEnter={() => cyberAudio.playHover()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 relative ${
                      isActive
                        ? 'text-white bg-white/10 font-bold shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full shadow-[0_0_6px_#ffffff]" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Actions: Resume & Audio & Terminal & Menu */}
            <div className="flex items-center gap-2">
              {/* Direct View Resume Link */}
              <a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/20 text-white hover:bg-white hover:text-black hover:shadow-[0_0_18px_rgba(255,255,255,0.4)] text-xs font-mono font-medium transition-all"
              >
                <FileText size={13} />
                <span>Resume PDF</span>
                <ExternalLink size={11} />
              </a>

              {/* Interactive CV Modal Trigger */}
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenResume();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:border-white/30 text-xs font-mono transition-all"
                title="Open Interactive CV Modal"
              >
                <span>CV Modal</span>
              </button>

              {/* CLI Terminal Launcher */}
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onOpenTerminal();
                }}
                onMouseEnter={() => cyberAudio.playHover()}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 text-neutral-300 hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all font-mono text-xs"
                title="Launch CLI Terminal"
              >
                <Terminal size={15} />
                <span>&gt;_ CLI</span>
              </button>

              {/* Mobile Hamburger Toggle (Min 44x44px touch target) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-11 h-11 rounded-xl border border-white/15 bg-neutral-950 flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Drawer Menu (Black + Neon White) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl px-6 pt-24 pb-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                  Navigation Menu
                </span>
                <span className="font-display font-bold text-lg text-white">
                  {personalData.name}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 rounded-xl border border-white/15 bg-neutral-900 flex items-center justify-center text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`min-h-[48px] px-4 py-3 rounded-xl border flex items-center justify-between text-sm font-mono transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                      : 'border-white/10 text-neutral-300 bg-neutral-950/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-xs opacity-60 font-sans">&rarr;</span>
                </a>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3 mt-4">
            <a
              href={personalData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-4 py-3 rounded-xl bg-white text-black font-bold text-sm font-mono text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <FileText size={16} />
              <span>Open Tarun's Resume (PDF)</span>
            </a>

            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2">
              <span>{personalData.email}</span>
              <span>{personalData.phone}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
