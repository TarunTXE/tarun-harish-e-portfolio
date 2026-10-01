import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Copy,
  Check,
  Phone,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';
import { ContactGraphic } from './graphics/SectionDecorations';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    cyberAudio.playConfirm();
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPhone = () => {
    cyberAudio.playConfirm();
    navigator.clipboard.writeText(personalData.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cyberAudio.playConfirm();
    const subject = encodeURIComponent(formData.subject || `Portfolio transmission from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${personalData.email}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[var(--background)] border-t border-[var(--border)] overflow-hidden"
    >
      {/* Contact Terminal Signal Graphic Accent */}
      <div data-music-motion="decorative">
        <ContactGraphic className="top-10 right-8 hidden md:block" />
      </div>

      {/* Section Heading: 07 // CONTACT.SH with terminal-inspired framing */}
      <div data-music-motion="section-header" className="flex flex-col items-start mb-8 sm:mb-12 relative z-10">
        <div className="w-full flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] font-mono text-xs uppercase tracking-widest shrink-0 tech-corner-frame">
            <Send size={12} className="text-emerald-500" />
            <span className="font-bold">07 // CONTACT.SH</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--border-strong)] via-[var(--border)] to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-[var(--muted)] tracking-wider">
            TRANSMIT: SECURE_SOCKET
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[var(--foreground)] tracking-tight">
          INITIATE <span className="text-[var(--muted)]">CONTACT</span>
        </h2>
        <p className="mt-3 text-[var(--muted)] text-sm sm:text-base max-w-xl font-sans leading-relaxed">
          Whether you have an engineering role, contract project, or technical question, my frequency is open.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Coordinates & Direct Uplinks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          data-music-motion="contact-panel"
          className="lg:col-span-5 flex flex-col gap-5"
        >
          {/* Holographic Contact Card */}
          <div className="bg-[var(--surface)] rounded-lg p-6 sm:p-8 border border-[var(--border-strong)] relative overflow-hidden shadow-lg tech-corner-frame">
            <h3 className="font-display font-bold text-xl text-[var(--foreground)] mb-1">
              {personalData.name}
            </h3>
            <p className="font-mono text-xs text-[var(--muted)] mb-4">
              Full-Stack & Applied AI Developer
            </p>
            <p className="text-[var(--muted)] text-xs sm:text-sm font-sans mb-6">
              Based in {personalData.location} — available for remote engineering contracts, software roles, and AI collaborations.
            </p>

            {/* Quick Copy Email Pill */}
            <div className="p-3.5 sm:p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-emerald-500" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono text-[var(--muted)] uppercase block">DIRECT FREQUENCY</span>
                  <a
                    href={`mailto:${personalData.email}`}
                    className="text-xs sm:text-sm font-mono text-[var(--foreground)] hover:text-emerald-500 truncate block font-medium"
                  >
                    {personalData.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => cyberAudio.playHover()}
                className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)]'
                }`}
                title="Copy Email Address"
                aria-label="Copy email address"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Quick Copy Phone Pill */}
            <div className="p-3.5 sm:p-4 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-emerald-500" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono text-[var(--muted)] uppercase block">TELEPHONE UPLINK</span>
                  <a
                    href={`tel:${personalData.phoneRaw}`}
                    className="text-xs sm:text-sm font-mono text-[var(--foreground)] hover:text-emerald-500 truncate block font-medium"
                  >
                    {personalData.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyPhone}
                onMouseEnter={() => cyberAudio.playHover()}
                className={`w-10 h-10 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  copiedPhone
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)]'
                }`}
                title="Copy Phone Number"
                aria-label="Copy phone number"
              >
                {copiedPhone ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Coordinates and Socials */}
            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--muted)]">CALICUT, KERALA</span>
              <div className="flex items-center gap-2">
                <a
                  href={personalData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberAudio.playClick()}
                  className="w-8 h-8 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon size={14} />
                </a>
                <a
                  href={personalData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberAudio.playClick()}
                  className="w-8 h-8 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dispatch Transmission Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-music-motion="contact-panel"
          className="lg:col-span-7"
        >
          <div className="bg-[var(--surface)] rounded-lg p-6 sm:p-8 border border-[var(--border-strong)] shadow-lg tech-corner-frame">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                <span className="font-mono text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  DISPATCH FORM // TRANSMIT
                </span>
              </div>
              <span className="font-mono text-[11px] text-[var(--muted)]">ENCRYPTED</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5 font-medium">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Linus Torvalds"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs focus:border-[var(--foreground)] outline-none transition-colors placeholder-[var(--muted)]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5 font-medium">
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="linus@domain.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs focus:border-[var(--foreground)] outline-none transition-colors placeholder-[var(--muted)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5 font-medium">
                  SUBJECT
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Software Engineering Collaboration"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs focus:border-[var(--foreground)] outline-none transition-colors placeholder-[var(--muted)]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1.5 font-medium">
                  TRANSMISSION PAYLOAD (MESSAGE) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Outline your engineering requirements, project specifications, or collaboration details..."
                  className="w-full p-3.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground)] font-mono text-xs focus:border-[var(--foreground)] outline-none transition-colors placeholder-[var(--muted)] resize-none"
                />
              </div>

              <button
                type="submit"
                onMouseEnter={() => cyberAudio.playHover()}
                className="w-full min-h-[48px] px-6 py-3 rounded-md bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>TRANSMIT PAYLOAD VIA EMAIL</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
