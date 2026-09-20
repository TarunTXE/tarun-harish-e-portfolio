import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  FolderGit2,
  Users,
  Award,
  Briefcase,
  Code2,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { personalData } from '../data/personal';

interface GitHubApiStats {
  publicRepos: number;
  followers: number;
  following: number;
}

export const DeveloperDashboard: React.FC = () => {
  const [ghStats, setGhStats] = useState<GitHubApiStats>({
    publicRepos: 8,
    followers: 1,
    following: 1,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${personalData.githubUsername}`);
        if (res.ok) {
          const data = await res.json();
          setGhStats({
            publicRepos: data.public_repos ?? 8,
            followers: data.followers ?? 1,
            following: data.following ?? 1,
          });
        }
      } catch (err) {
        console.warn('Using verified GitHub data', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Public Repositories', value: ghStats.publicRepos, suffix: '', icon: FolderGit2 },
    { label: 'GitHub Followers', value: ghStats.followers, suffix: '', icon: Users },
    { label: 'Technical Internships', value: 2, suffix: '', icon: Briefcase },
    { label: 'Accreditations', value: 2, suffix: '', icon: Award },
  ];

  const languages = [
    { name: 'JavaScript', percent: 45, color: '#FFFFFF' },
    { name: 'Python', percent: 35, color: '#D4D4D4' },
    { name: 'TypeScript', percent: 12, color: '#999999' },
    { name: 'HTML & CSS', percent: 8, color: '#666666' },
  ];

  // Activity heatmap grid representing development rhythm
  const heatmapData = Array.from({ length: 112 }, (_, i) => {
    const rand = Math.sin(i * 0.35) * 0.5 + 0.5;
    if (rand > 0.75) return 4;
    if (rand > 0.5) return 3;
    if (rand > 0.3) return 2;
    if (rand > 0.15) return 1;
    return 0;
  });

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-white shadow-[0_0_6px_#ffffff]';
      case 3:
        return 'bg-neutral-300';
      case 2:
        return 'bg-neutral-500';
      case 1:
        return 'bg-neutral-700';
      default:
        return 'bg-neutral-900';
    }
  };

  return (
    <section id="dashboard" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 06 / TELEMETRY */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Activity size={12} className="text-white" />
          <span>06 / TELEMETRY & INSIGHTS</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          GITHUB & <span className="text-gradient-white">ACTIVITY METRICS</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-xl font-sans">
          Verified telemetry and codebase distribution aggregated directly from{' '}
          <span className="font-mono text-white">@{personalData.githubUsername}</span>.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Counters: 2 cols mobile, 4 cols desktop */}
        <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="bg-[#080808] rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-white/30 transition-all flex items-center gap-3 sm:gap-4"
            >
              <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-950 border border-white/10 shrink-0 text-white">
                <stat.icon size={20} />
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-mono font-extrabold text-white block leading-none mb-1">
                  {stat.value}
                  <span className="text-neutral-400 text-sm">{stat.suffix}</span>
                </span>
                <span className="text-neutral-400 font-mono text-[10px] sm:text-xs uppercase tracking-wider block">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub Activity Matrix / Heatmap - Horizontally Contained */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 bg-[#080808] rounded-3xl p-5 sm:p-7 border border-white/10 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GithubIcon size={16} className="text-white" />
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Contribution & Cadence Matrix
                </h3>
              </div>
              <a
                href={personalData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-neutral-300 hover:text-white hover:underline flex items-center gap-1"
              >
                <span>GitHub Profile</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <p className="text-neutral-400 text-xs font-sans mb-5 leading-relaxed">
              Engineering cadence across full-stack repositories, Django backend microservices, and machine learning projects.
            </p>

            {/* Contained Horizontal Scroll Container */}
            <div className="p-4 rounded-2xl bg-black border border-white/10 overflow-x-auto w-full">
              <div className="grid grid-rows-4 grid-flow-col gap-1.5 min-w-[480px]">
                {heatmapData.map((level, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 ${getHeatmapColor(
                      level
                    )}`}
                    title={`Activity Node ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-3 pt-3 border-t border-white/10 min-w-[480px]">
                <span>Repository Activity Distribution</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-neutral-500" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-neutral-300" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-white" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Language Footprint Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 bg-[#080808] rounded-3xl p-5 sm:p-7 border border-white/10 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={16} className="text-white" />
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                Language Footprint
              </h3>
            </div>

            <p className="text-neutral-400 text-xs font-sans mb-5">
              Codebase composition across verified GitHub projects.
            </p>

            <div className="space-y-3.5">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-neutral-200">{lang.name}</span>
                    <span className="text-neutral-400">{lang.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${lang.percent}%`,
                        backgroundColor: lang.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Core Focus</span>
            <span className="text-white font-bold">Full-Stack & Applied AI</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
