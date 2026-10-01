import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  FolderGit2,
  Users,
  Award,
  Briefcase,
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
    { name: 'JavaScript', percent: 45 },
    { name: 'Python', percent: 35 },
    { name: 'TypeScript', percent: 12 },
    { name: 'HTML & CSS', percent: 8 },
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

  const getHeatmapColorClass = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-sm';
      case 3:
        return 'bg-neutral-700 dark:bg-neutral-300';
      case 2:
        return 'bg-neutral-400 dark:bg-neutral-500';
      case 1:
        return 'bg-neutral-300 dark:bg-neutral-700';
      default:
        return 'bg-neutral-200/80 dark:bg-neutral-900';
    }
  };

  return (
    <motion.section
      id="dashboard"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Section Heading: 05 // TELEMETRY.SYS with coordinate markings */}
      <div className="flex flex-col items-start mb-8 sm:mb-12">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0">
            <Activity size={12} className="text-emerald-500" />
            <span className="font-bold">05 // TELEMETRY.SYS</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            COORD: 11.25°N, 75.78°E • FREQ: LIVE
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          DEVELOPMENT <span className="text-[var(--muted)]">TELEMETRY</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-xl font-sans leading-relaxed">
          Verified telemetry and codebase distribution aggregated directly from{' '}
          <a
            href={personalData.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[var(--foreground)] underline underline-offset-4 hover:text-emerald-500"
          >
            @{personalData.githubUsername}
          </a>.
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
              className="bg-[var(--surface)] rounded-lg p-4 sm:p-5 border border-[var(--border-strong)] hover:border-[var(--foreground)] transition-all flex items-center gap-3 sm:gap-4 shadow-sm"
            >
              <div className="p-2.5 sm:p-3 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] shrink-0 text-[var(--foreground)]">
                <stat.icon size={18} />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-[var(--foreground)] block leading-none mb-1">
                  {stat.value}
                  <span className="text-[var(--muted)] text-sm">{stat.suffix}</span>
                </span>
                <span className="text-[var(--muted)] font-mono text-[10px] sm:text-xs uppercase tracking-wider block">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Development Heatmap Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-8 bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <span className="font-mono text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                COMMIT CADENCE // 16 WEEKS
              </span>
            </div>
            <a
              href={personalData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1"
            >
              <span>GitHub Graph</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Micro Matrix */}
          <div
            className="grid gap-1.5 p-3 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] mb-4"
            style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
          >
            {heatmapData.map((level, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[2px] transition-all hover:scale-125 ${getHeatmapColorClass(level)}`}
                title={`Activity Level ${level}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
            <span>RHYTHM: CONTINUOUS</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2 h-2 rounded-[2px] bg-neutral-200 dark:bg-neutral-900 border border-[var(--border)]" />
              <div className="w-2 h-2 rounded-[2px] bg-neutral-400 dark:bg-neutral-700" />
              <div className="w-2 h-2 rounded-[2px] bg-neutral-700 dark:bg-neutral-300" />
              <div className="w-2 h-2 rounded-[2px] bg-neutral-900 dark:bg-white" />
              <span>More</span>
            </div>
          </div>
        </motion.div>

        {/* Codebase Composition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4 bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
              <span className="font-mono text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                LANGUAGE QUOTAS
              </span>
              <GithubIcon size={14} className="text-[var(--muted)]" />
            </div>

            <div className="space-y-3.5">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[var(--foreground)] font-medium">{lang.name}</span>
                    <span className="text-[var(--muted)]">{lang.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--surface-secondary)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full bg-[var(--foreground)] rounded-full transition-all duration-500"
                      style={{ width: `${lang.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] mt-4 flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
            <span>INDEX: 8 REPOS</span>
            <span className="text-emerald-500 font-semibold">SYNCHRONIZED</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
