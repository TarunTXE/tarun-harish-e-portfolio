import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { TechStack } from './components/TechStack';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { LinkedInHighlights } from './components/LinkedInHighlights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { CustomCursor } from './components/CustomCursor';
import { TerminalModal } from './components/TerminalModal';
import { ResumeModal } from './components/ResumeModal';
import { ThemeTransitionOverlay } from './components/ThemeTransitionOverlay';
import { BootLoader } from './components/BootLoader';
import { TXEDinoRunner } from './components/TXEDinoRunner';
import { ThemeProvider } from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';

export const AppContent: React.FC = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Guarantee clean URL without hash routes or query parameters like ?boot=true
  useEffect(() => {
    const cleanUrl = () => {
      let shouldClean = false;
      const url = new URL(window.location.href);

      if (url.hash) {
        url.hash = '';
        shouldClean = true;
      }

      if (url.searchParams.has('boot') || url.searchParams.has('reset')) {
        url.searchParams.delete('boot');
        url.searchParams.delete('reset');
        shouldClean = true;
      }

      if (shouldClean) {
        const cleanPath = url.pathname + (url.search ? url.search : '');
        window.history.replaceState(null, '', cleanPath);
      }
    };

    cleanUrl();
    window.addEventListener('hashchange', cleanUrl);
    return () => window.removeEventListener('hashchange', cleanUrl);
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-white/25 selection:text-white overflow-x-hidden">
      {/* 4.0s Initial Boot Sequence (Appears on initial session load) */}
      <BootLoader />

      {/* System Reconfiguration Transition Overlay */}
      <ThemeTransitionOverlay />

      {/* Ambient Pixel Dino Runner in Music Mode */}
      <TXEDinoRunner />

      {/* Interactive Cyber Custom Cursor */}
      <CustomCursor />

      {/* Floating Glassmorphism Navbar */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Primary Content Sections:
          Identity → Projects → Experience → Skills → GitHub → LinkedIn → Contact */}
      <main className="relative z-10">
        <Hero
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenResume={() => setResumeOpen(true)}
        />
        <About onOpenTerminal={() => setTerminalOpen(true)} />
        <TechStack />
        <Projects />
        <Experience />
        <DeveloperDashboard />
        <LinkedInHighlights />
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />

      {/* Mobile Sticky Thumb-Navigation */}
      <MobileNav />

      {/* Interactive CLI Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Interactive CV / Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
