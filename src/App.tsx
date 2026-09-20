import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { SIHShowcase } from './components/SIHShowcase';
import { Experience } from './components/Experience';
import { TechStack } from './components/TechStack';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { LinkedInHighlights } from './components/LinkedInHighlights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { CustomCursor } from './components/CustomCursor';
import { TechBackground } from './components/TechBackground';
import { TerminalModal } from './components/TerminalModal';
import { ResumeModal } from './components/ResumeModal';

export const App: React.FC = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
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

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/25 selection:text-white overflow-x-hidden">
      {/* Cinematic Developer Tech Background (Floating code tokens, connecting nodes, circuit traces, ambient code stream) */}
      <TechBackground />

      {/* Interactive Cyber Custom Cursor */}
      <CustomCursor />

      {/* Floating Glassmorphism Navbar */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Primary Content Sections adhering to requested content hierarchy:
          Identity → Projects → Experience → Skills → GitHub → LinkedIn → Certifications/Activities → Contact */}
      <main className="relative z-10">
        <Hero
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenResume={() => setResumeOpen(true)}
        />
        <About onOpenTerminal={() => setTerminalOpen(true)} />
        <Projects />
        <SIHShowcase />
        <Experience />
        <TechStack />
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

export default App;
