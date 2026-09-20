import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { linkedinPostsData } from '../data/linkedinPosts';
import { personalData } from '../data/personal';

export const LinkedInHighlights: React.FC = () => {
  return (
    <section id="linkedin" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 07 / LINKEDIN */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <LinkedinIcon size={12} className="text-white" />
          <span>07 / PROFESSIONAL NETWORK</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          LINKEDIN <span className="text-gradient-white">HIGHLIGHTS</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-xl font-sans">
          Key professional milestones, internship achievements, and project updates from{' '}
          <a
            href={personalData.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-mono font-semibold underline underline-offset-4 hover:text-neutral-300"
          >
            linkedin.com/in/taruntxe
          </a>.
        </p>
      </div>

      {/* Posts Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {linkedinPostsData.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="bg-[#080808] rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-white/30 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
          >
            <div>
              {/* Header: Category & Date */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-950 border border-white/15 text-[10px] font-mono text-white font-bold">
                  {post.category}
                </span>
                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                  <Calendar size={12} className="text-white" />
                  {post.date}
                </span>
              </div>

              {/* Optional Post Image Preview */}
              {post.image && (
                <div className="rounded-xl overflow-hidden border border-white/10 mb-4 aspect-[16/10] bg-black">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="font-display font-bold text-base text-white group-hover:text-neutral-200 transition-colors mb-2.5 line-clamp-2">
                {post.title}
              </h3>

              {/* Description Preview */}
              <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed mb-4 line-clamp-4">
                {post.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer: Minimum 44px touch target */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                <LinkedinIcon size={14} className="text-white" />
                <span>Verified Post</span>
              </div>

              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-white/15 hover:border-white text-white font-mono text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <span>View on LinkedIn</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connect on LinkedIn Button */}
      <div className="flex justify-center mt-8">
        <a
          href={personalData.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => cyberAudio.playClick()}
          onMouseEnter={() => cyberAudio.playHover()}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-[#080808] border border-white/20 hover:border-white text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <LinkedinIcon size={16} />
          <span>CONNECT WITH TARUN ON LINKEDIN</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </section>
  );
};
