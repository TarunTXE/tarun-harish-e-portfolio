import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { cyberAudio } from '../utils/audio';

export const SIHShowcase: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [pushupCount, setPushupCount] = useState<number>(14);
  const [activeStage, setActiveStage] = useState<number>(1);
  const [reliefTimer, setReliefTimer] = useState<number>(18);
  const [status, setStatus] = useState<'Normal' | 'Relief Push-up Active' | 'Alert: Pressure Threshold'>(
    'Relief Push-up Active'
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setReliefTimer((prev) => {
        if (prev <= 1) {
          setPushupCount((c) => c + 1);
          setStatus('Relief Push-up Active');
          return 25;
        }
        if (prev === 5) {
          setStatus('Alert: Pressure Threshold');
        } else if (prev > 15) {
          setStatus('Relief Push-up Active');
        } else {
          setStatus('Normal');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const stages = [
    {
      step: '01',
      title: 'Monocular RGB Video Capture',
      desc: 'Processes webcam or edge camera video streams without requiring expensive specialized pressure sensor hardware.',
      tech: 'OpenCV / VideoCapture',
    },
    {
      step: '02',
      title: '33-Keypoint Pose Extraction',
      desc: 'Leverages Google MediaPipe Pose to track 3D coordinates of shoulders, elbows, wrists, hips, and torso.',
      tech: 'MediaPipe Pose ML',
    },
    {
      step: '03',
      title: 'Biomechanical Angle Engineering',
      desc: 'Calculates elbow elevation vectors, shoulder depression, and vertical seat clearance displacement (ΔY).',
      tech: 'Vector Math & NumPy',
    },
    {
      step: '04',
      title: 'Random Forest Classification',
      desc: 'Ensemble model classifies posture into Seated, Lift Prep, or Effective Relief Push-up states.',
      tech: 'Scikit-Learn Random Forest',
    },
    {
      step: '05',
      title: 'Clinical Alert & Caregiver Telemetry',
      desc: 'Triggers auditory posture correction cues and logs clinical pressure distribution telemetry for caregivers.',
      tech: 'Alert Telemetry',
    },
  ];

  const aiDomains = [
    {
      title: 'Supervised Learning',
      desc: 'Classification & regression pipelines, labeled training datasets, model evaluation.',
      tag: 'Predictive Modeling',
    },
    {
      title: 'Unsupervised Learning',
      desc: 'Pattern discovery, cluster analysis, dimensionality reduction, and anomaly detection.',
      tag: 'Clustering & PCA',
    },
    {
      title: 'Deep Learning',
      desc: 'Multi-layer neural network architectures, computer vision feature extractors, and perceptual computing.',
      tag: 'Neural Networks',
    },
    {
      title: 'Reinforcement Learning & Q-Learning',
      desc: 'Agent-environment interaction, reward modeling, state-action space exploration, policy optimization.',
      tag: 'Decision Policies',
    },
    {
      title: 'IBM watsonx & Watson Studio',
      desc: 'Enterprise AI workflows, foundation model training, prompt engineering, and automated ML pipelines.',
      tag: 'Enterprise AI Cloud',
    },
    {
      title: 'Teachable Machine & Edge AI',
      desc: 'Fast prototyping, vision & audio classification, edge inference with low computational footprint.',
      tag: 'Edge Deployment',
    },
  ];

  return (
    <section id="sih-showcase" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 03 / SPECIAL PROJECT */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Brain size={12} className="text-white" />
          <span>03 / ASSISTIVE COMPUTER VISION</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          WHEELCHAIR PUSH-UP <span className="text-gradient-white">DETECTION</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-2xl font-sans">
          Computer vision & Machine Learning system engineered to prevent ischemic pressure ulcers in wheelchair users through automated skeletal tracking.
        </p>
      </div>

      {/* Interactive Simulation Dashboard & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left: Monochromatic Computer Vision HUD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-[#080808] rounded-3xl p-5 sm:p-7 border border-white/15 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
              <span className="font-mono text-xs text-white font-medium tracking-wide">
                CAMERA_FEED::MONOCHROME_INFERENCE
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/15 text-neutral-300 hover:text-white hover:border-white flex items-center justify-center transition-colors"
                title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
                aria-label="Pause/resume simulation"
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                onClick={() => {
                  cyberAudio.playClick();
                  setPushupCount(0);
                  setReliefTimer(20);
                }}
                className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/15 text-neutral-300 hover:text-white hover:border-white flex items-center justify-center transition-colors"
                title="Reset Telemetry"
                aria-label="Reset telemetry"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Visual HUD Canvas / Simulated Skeleton Graph */}
          <div className="relative my-4 aspect-[16/10] sm:aspect-video rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-40" />

            {/* Simulated Human Pose Skeleton Wireframe in Monochrome White */}
            <svg className="w-3/4 h-3/4 relative z-10" viewBox="0 0 200 200">
              <line x1="100" y1="50" x2="100" y2="130" stroke="#ffffff" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
              <line x1="70" y1="70" x2="130" y2="70" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
              <line x1="70" y1="70" x2="55" y2="105" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
              <line x1="55" y1="105" x2="45" y2="145" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
              <line x1="130" y1="70" x2="145" y2="105" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
              <line x1="145" y1="105" x2="155" y2="145" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
              <line x1="30" y1="155" x2="170" y2="155" stroke="#555555" strokeWidth="3" />
              <circle cx="100" cy="40" r="12" fill="#000000" stroke="#ffffff" strokeWidth="2" />
              {[
                { cx: 70, cy: 70 },
                { cx: 130, cy: 70 },
                { cx: 55, cy: 105 },
                { cx: 145, cy: 105 },
                { cx: 45, cy: 145 },
                { cx: 155, cy: 145 },
                { cx: 100, cy: 130 },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.cx} cy={pt.cy} r="4.5" fill="#ffffff" opacity="0.4" className="animate-ping" />
                  <circle cx={pt.cx} cy={pt.cy} r="3" fill="#ffffff" />
                </g>
              ))}
            </svg>

            {/* HUD Overlaid Metrics */}
            <div className="absolute top-3 left-3 p-2 rounded-lg bg-black/90 border border-white/10 font-mono text-[10px] text-neutral-300 space-y-0.5">
              <div>STREAM: 30 FPS</div>
              <div>POSE MODEL: MediaPipe 33-Keypoint</div>
              <div className="text-white font-bold">TRACKING: ACTIVE</div>
            </div>

            <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/90 border border-white/10 font-mono text-[10px] text-right">
              <div className="text-neutral-400">CLASSIFIER</div>
              <div className="text-white font-bold">Random Forest (Scikit-Learn)</div>
            </div>

            <div className="absolute inset-4 border border-dashed border-white/15 rounded-xl pointer-events-none" />
          </div>

          {/* Real-time State telemetry */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 font-mono text-center">
            <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10">
              <span className="text-[10px] text-neutral-500 block uppercase">RELIEF CYCLES</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{pushupCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10">
              <span className="text-[10px] text-neutral-500 block uppercase">TIMER DUE</span>
              <span className="text-xl sm:text-2xl font-bold text-neutral-300">{reliefTimer}s</span>
            </div>
            <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-center">
              <span className="text-[10px] text-neutral-500 block uppercase">STATE</span>
              <span className="text-xs font-bold truncate text-white">
                {status}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Architectural Pipeline Steps */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col gap-2.5"
        >
          <div className="p-4 rounded-2xl bg-[#080808] border border-white/10 mb-1">
            <span className="font-mono text-xs text-white uppercase tracking-wider block font-semibold mb-1">
              Engineering Pipeline
            </span>
            <p className="text-neutral-400 text-xs font-sans leading-relaxed">
              Step-by-step pipeline from raw webcam stream to real-time clinical intervention.
            </p>
          </div>

          {stages.map((stage, idx) => (
            <div
              key={stage.step}
              onClick={() => {
                cyberAudio.playClick();
                setActiveStage(idx + 1);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeStage === idx + 1
                  ? 'bg-neutral-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.12)]'
                  : 'bg-[#080808] border-white/10 hover:border-white/25 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-white">{stage.step}</span>
                  <h4 className="font-display font-semibold text-xs sm:text-sm text-white">{stage.title}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black border border-white/15 text-neutral-300 shrink-0">
                  {stage.tech}
                </span>
              </div>
              <p className="text-neutral-400 text-xs font-sans mt-2 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* MACHINE LEARNING & APPLIED AI KNOWLEDGE MATRIX */}
      {/* ========================================================================= */}
      <div className="pt-12 border-t border-white/10">
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-1">
            Applied Intelligence Core
          </span>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
            MACHINE LEARNING & APPLIED AI <span className="text-gradient-white">DOMAINS</span>
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mt-1 font-sans">
            Visual overview of core AI disciplines, training methodologies, and applied enterprise toolchains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiDomains.map((domain, i) => (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-[#080808] rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/15 bg-neutral-950 text-neutral-300">
                  {domain.tag}
                </span>
                <Sparkles size={13} className="text-white/80" />
              </div>
              <h4 className="font-display font-bold text-sm sm:text-base text-white mb-2">{domain.title}</h4>
              <p className="text-neutral-400 text-xs leading-relaxed font-sans">{domain.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
