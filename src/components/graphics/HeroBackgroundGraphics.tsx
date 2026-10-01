import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroBackgroundGraphics: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none flex items-center justify-center z-0"
      aria-hidden="true"
    >
      {isDark ? (
        /* ============================================================
           DARK MODE: DEVELOPER SYSTEM / ORBITAL TERMINAL HUD
           ============================================================ */
        <div className="relative w-full max-w-4xl h-[420px] flex items-center justify-center opacity-30">
          <svg
            className="w-full h-full max-w-[680px] max-h-[420px]"
            viewBox="0 0 700 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Concentric orbital rings */}
            <circle
              cx="350"
              cy="220"
              r="180"
              stroke="white"
              strokeWidth="1"
              strokeDasharray="4 6"
              className="opacity-25"
            />
            <circle
              cx="350"
              cy="220"
              r="130"
              stroke="white"
              strokeWidth="1"
              className="opacity-15"
            />
            <circle
              cx="350"
              cy="220"
              r="70"
              stroke="#10B981"
              strokeWidth="1"
              strokeDasharray="2 4"
              className="opacity-40"
            />

            {/* Crosshairs & Axis lines */}
            <line x1="120" y1="220" x2="580" y2="220" stroke="white" strokeWidth="1" strokeDasharray="2 8" className="opacity-20" />
            <line x1="350" y1="30" x2="350" y2="410" stroke="white" strokeWidth="1" strokeDasharray="2 8" className="opacity-20" />

            {/* Quadrant node ticks */}
            <path d="M 345 90 L 355 90 M 350 85 L 350 95" stroke="#10B981" strokeWidth="1.5" />
            <path d="M 345 350 L 355 350 M 350 345 L 350 355" stroke="#10B981" strokeWidth="1.5" />
            <path d="M 170 220 L 170 220 M 165 220 L 175 220" stroke="white" strokeWidth="1.5" />
            <path d="M 530 220 L 530 220 M 525 220 L 535 220" stroke="white" strokeWidth="1.5" />

            {/* Glowing nodes */}
            <circle cx="350" cy="90" r="2.5" fill="#10B981" />
            <circle cx="480" cy="220" r="2" fill="white" />
            <circle cx="220" cy="220" r="2" fill="white" />

            {/* Diagonal Framing Corner Brackets */}
            <path d="M 180 80 L 160 80 L 160 100" stroke="white" strokeWidth="1" className="opacity-40" />
            <path d="M 520 80 L 540 80 L 540 100" stroke="white" strokeWidth="1" className="opacity-40" />
            <path d="M 180 360 L 160 360 L 160 340" stroke="white" strokeWidth="1" className="opacity-40" />
            <path d="M 520 360 L 540 360 L 540 340" stroke="white" strokeWidth="1" className="opacity-40" />

            {/* Technical system coordinate annotations */}
            <text x="170" y="74" fill="white" fontSize="9" fontFamily="monospace" letterSpacing="2" className="opacity-40">
              SYS::NODE_01 [0x7E]
            </text>
            <text x="440" y="375" fill="#10B981" fontSize="9" fontFamily="monospace" letterSpacing="2" className="opacity-60">
              RAD::11.25°N • 75.78°E
            </text>
          </svg>
        </div>
      ) : (
        /* ============================================================
           LIGHT MODE: DIGITAL BLUEPRINT / ARCHITECTURAL DRAFTING
           ============================================================ */
        <div className="relative w-full max-w-4xl h-[420px] flex items-center justify-center opacity-30">
          <svg
            className="w-full h-full max-w-[680px] max-h-[420px]"
            viewBox="0 0 700 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Precision Blueprint Outer Drafting Square */}
            <rect
              x="160"
              y="60"
              width="380"
              height="320"
              stroke="#121212"
              strokeWidth="0.75"
              strokeDasharray="6 6"
              className="opacity-30"
            />

            {/* Compass Drafting Circles */}
            <circle
              cx="350"
              cy="220"
              r="160"
              stroke="#121212"
              strokeWidth="1"
              className="opacity-35"
            />
            <circle
              cx="350"
              cy="220"
              r="110"
              stroke="#047857"
              strokeWidth="0.75"
              className="opacity-40"
            />

            {/* Degree & Millimeter Measurement Ticks */}
            {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 350 + 154 * Math.cos(rad);
              const y1 = 220 + 154 * Math.sin(rad);
              const x2 = 350 + 160 * Math.cos(rad);
              const y2 = 220 + 160 * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#121212"
                  strokeWidth="1"
                  className="opacity-50"
                />
              );
            })}

            {/* Dimension Extension Lines and Arrows */}
            <line x1="140" y1="220" x2="560" y2="220" stroke="#121212" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-30" />
            <line x1="350" y1="40" x2="350" y2="400" stroke="#121212" strokeWidth="0.75" strokeDasharray="3 3" className="opacity-30" />

            {/* Drafting Angle Marker ∠ 45° */}
            <line x1="350" y1="220" x2="460" y2="110" stroke="#047857" strokeWidth="0.75" className="opacity-45" />

            {/* Precision Blueprint Corner Markers */}
            <path d="M 150 70 L 170 70 M 160 60 L 160 80" stroke="#121212" strokeWidth="1" className="opacity-50" />
            <path d="M 530 70 L 550 70 M 540 60 L 540 80" stroke="#121212" strokeWidth="1" className="opacity-50" />
            <path d="M 150 370 L 170 370 M 160 360 L 160 380" stroke="#121212" strokeWidth="1" className="opacity-50" />
            <path d="M 530 370 L 550 370 M 540 360 L 540 380" stroke="#121212" strokeWidth="1" className="opacity-50" />

            {/* Blueprint Technical Text Specifications */}
            <text x="165" y="52" fill="#121212" fontSize="9" fontFamily="monospace" letterSpacing="2" className="opacity-55 font-bold">
              SPEC::BLUEPRINT_DRAFT [SCALE 1:1]
            </text>
            <text x="440" y="395" fill="#047857" fontSize="9" fontFamily="monospace" letterSpacing="1.5" className="opacity-70 font-bold">
              DIM: 100% • TOL: ±0.00
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};
