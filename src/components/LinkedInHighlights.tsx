import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { linkedinPostsData } from '../data/linkedinPosts';
import { personalData } from '../data/personal';

export const LinkedInHighlights: React.FC = () => {
  return (
    <motion.section
      id="linkedin"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Section Heading: 06 / DISPATCHES */}
      <div className="flex flex-col items-start mb-8 sm:mb-12">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0">
            <LinkedinIcon size={12} className="text-emerald-500" />
            <span className="font-bold">06 // DISPATCHES</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            SOURCE: LINKEDIN_FEED
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          FIELD NOTES & <span className="text-[var(--muted)]">DISPATCHES</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-xl font-sans leading-relaxed">
          Professional milestones, internship achievements, and project updates from{' '}
          <a
            href={personalData.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground)] font-mono font-semibold underline underline-offset-4 hover:text-emerald-500"
          >
            linkedin.com/in/taruntxe
          </a>.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {linkedinPostsData.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="bg-[var(--surface)] rounded-lg p-5 sm:p-6 border border-[var(--border-strong)] hover:border-[var(--foreground)] flex flex-col justify-between group transition-all duration-200 shadow-sm"
          >
            <div>
              {/* Header: Category & Date */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="px-2.5 py-0.5 rounded-sm bg-[var(--surface-secondary)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)]">
                  {post.category}
                </span>
                <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                  <Calendar size={12} className="text-[var(--foreground)]" />
                  {post.date}
                </span>
              </div>

              {/* Optional Post Image Preview */}
              {post.image && (
                <div className="rounded-md overflow-hidden border border-[var(--border)] mb-4 aspect-[16/10] bg-[var(--surface-secondary)]">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="font-display font-bold text-base text-[var(--foreground)] group-hover:text-emerald-500 transition-colors mb-2.5 line-clamp-2">
                {post.title}
              </h3>

              {/* Description Preview */}
              <p className="text-[var(--muted)] text-xs sm:text-sm font-sans leading-relaxed mb-4 line-clamp-4">
                {post.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-[var(--muted)] bg-[var(--surface-secondary)] px-2 py-0.5 rounded border border-[var(--border)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--muted)]">
                <LinkedinIcon size={14} className="text-[var(--foreground)]" />
                <span>Verified Post</span>
              </div>

              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="min-h-[40px] px-3.5 py-1.5 rounded-md bg-[var(--surface-secondary)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground)] text-[var(--foreground)] font-mono text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View on LinkedIn</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
