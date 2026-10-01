import React from 'react';

interface GraphicProps {
  className?: string;
}

// 1. WHOAMI: Small technical coordinate & profile diagram
export const WhoamiGraphic: React.FC<GraphicProps> = ({ className = '' }) => (
  <div className={`absolute pointer-events-none select-none overflow-hidden opacity-35 ${className}`} aria-hidden="true">
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 10 10 L 40 10 M 10 10 L 10 40" stroke="currentColor" strokeWidth="1.2" />
      <path d="M 110 80 L 80 80 M 110 80 L 110 50" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="45" r="18" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
      <line x1="20" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 4" />
      <line x1="60" y1="15" x2="60" y2="75" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 4" />
      <text x="18" y="24" fill="currentColor" fontSize="7" fontFamily="monospace" letterSpacing="1">
        LAT:11.25N
      </text>
    </svg>
  </div>
);

// 2. STACK: Small grid + node network
export const StackGraphic: React.FC<GraphicProps> = ({ className = '' }) => (
  <div className={`absolute pointer-events-none select-none overflow-hidden opacity-35 ${className}`} aria-hidden="true">
    <svg width="110" height="85" viewBox="0 0 110 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Node network with connective lines */}
      <line x1="20" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="0.8" />
      <line x1="60" y1="20" x2="90" y2="50" stroke="currentColor" strokeWidth="0.8" />
      <line x1="20" y1="20" x2="40" y2="65" stroke="currentColor" strokeWidth="0.8" />
      <line x1="40" y1="65" x2="90" y2="65" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <circle cx="60" cy="20" r="2.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="90" cy="50" r="2.5" fill="currentColor" />
      <circle cx="40" cy="65" r="2.5" fill="currentColor" />
      <circle cx="90" cy="65" r="2" stroke="currentColor" strokeWidth="1" />
      <text x="24" y="14" fill="currentColor" fontSize="7" fontFamily="monospace">
        SYS_BUS
      </text>
    </svg>
  </div>
);

// 3. PROJECTS: Technical frame / corner brackets / project index markers
export const ProjectsGraphic: React.FC<GraphicProps> = ({ className = '' }) => (
  <div className={`absolute pointer-events-none select-none overflow-hidden opacity-35 ${className}`} aria-hidden="true">
    <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="110" height="60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
      <path d="M 10 25 L 10 10 L 25 10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 130 25 L 130 10 L 115 10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 10 65 L 10 80 L 25 80" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 130 65 L 130 80 L 115 80" stroke="currentColor" strokeWidth="1.5" />
      <text x="28" y="48" fill="currentColor" fontSize="8" fontFamily="monospace" letterSpacing="1.5">
        BUILD::TARGET_PROD
      </text>
    </svg>
  </div>
);

// 4. EXPERIENCE: Vertical timeline with subtle nodes & elevation
export const ExperienceGraphic: React.FC<GraphicProps> = ({ className = '' }) => (
  <div className={`absolute pointer-events-none select-none overflow-hidden opacity-35 ${className}`} aria-hidden="true">
    <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="10" x2="50" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
      <circle cx="50" cy="25" r="3" fill="currentColor" />
      <circle cx="50" cy="60" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="95" r="3" fill="currentColor" />
      <line x1="50" y1="25" x2="75" y2="25" stroke="currentColor" strokeWidth="0.8" />
      <line x1="50" y1="60" x2="25" y2="60" stroke="currentColor" strokeWidth="0.8" />
      <line x1="50" y1="95" x2="75" y2="95" stroke="currentColor" strokeWidth="0.8" />
      <text x="78" y="28" fill="currentColor" fontSize="7" fontFamily="monospace">
        T-0
      </text>
      <text x="8" y="63" fill="currentColor" fontSize="7" fontFamily="monospace">
        T-1
      </text>
      <text x="78" y="98" fill="currentColor" fontSize="7" fontFamily="monospace">
        T-2
      </text>
    </svg>
  </div>
);

// 5. CONTACT: Terminal cursor / signal lines
export const ContactGraphic: React.FC<GraphicProps> = ({ className = '' }) => (
  <div className={`absolute pointer-events-none select-none overflow-hidden opacity-35 ${className}`} aria-hidden="true">
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1" />
      <rect x="74" y="32" width="7" height="15" fill="currentColor" className="animate-pulse" />
      <path d="M 90 25 C 105 32, 105 48, 90 55" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M 98 20 C 118 30, 118 50, 98 60" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
      <text x="12" y="30" fill="currentColor" fontSize="7" fontFamily="monospace" letterSpacing="1">
        PORT::TXE_LINK
      </text>
    </svg>
  </div>
);
