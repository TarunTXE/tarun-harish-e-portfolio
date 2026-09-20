import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Copy,
  Check,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { cyberAudio } from '../utils/audio';
import { personalData } from '../data/personal';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPhone = () => {
    cyberAudio.playClick();
    navigator.clipboard.writeText(personalData.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cyberAudio.playClick();
    const subject = encodeURIComponent(formData.subject || `Portfolio transmission from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${personalData.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black">
      {/* Consistent Section Heading: 08 / TRANSMISSION */}
      <div className="flex flex-col items-center mb-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-950 text-neutral-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Send size={12} className="text-white" />
          <span>08 / TRANSMISSION</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          INITIATE <span className="text-gradient-white">CONTACT</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-white/40 my-3 shadow-[0_0_8px_#ffffff]" />
        <p className="mt-1 text-neutral-400 text-sm sm:text-base max-w-xl font-sans">
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
          className="lg:col-span-5 flex flex-col gap-5"
        >
          {/* Holographic Contact Card */}
          <div className="bg-[#080808] rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.04)]">
            <h3 className="font-display font-bold text-xl text-white mb-1">
              {personalData.name}
            </h3>
            <p className="font-mono text-xs text-neutral-400 mb-4">
              Full-Stack & Applied AI Developer
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm font-sans mb-6">
              Based in {personalData.location} — available for remote engineering contracts, software roles, and AI collaborations.
            </p>

            {/* Quick Copy Email Pill (48px height) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">DIRECT FREQUENCY</span>
                  <a
                    href={`mailto:${personalData.email}`}
                    className="text-xs sm:text-sm font-mono text-neutral-200 hover:text-white truncate block font-medium"
                  >
                    {personalData.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => cyberAudio.playHover()}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                  copied
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-black border-white/15 text-neutral-300 hover:border-white hover:text-white'
                }`}
                title="Copy Email Address"
                aria-label="Copy email address"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Quick Copy Phone Pill (48px height) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">TELEPHONE UPLINK</span>
                  <a
                    href={`tel:${personalData.phoneRaw}`}
                    className="text-xs sm:text-sm font-mono text-neutral-200 hover:text-white truncate block font-medium"
                  >
                    {personalData.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyPhone}
                onMouseEnter={() => cyberAudio.playHover()}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                  copiedPhone
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-black border-white/15 text-neutral-300 hover:border-white hover:text-white'
                }`}
                title="Copy Phone Number"
                aria-label="Copy phone number"
              >
                {copiedPhone ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Social Grid (Min 44px touch height) */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
              <a
                href={personalData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="min-h-[44px] p-3 rounded-xl bg-neutral-950 border border-white/10 hover:border-white text-neutral-300 hover:text-white flex items-center justify-between text-xs font-mono transition-all"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </div>
                <ExternalLink size={12} className="text-neutral-500" />
              </a>

              <a
                href={personalData.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playClick()}
                onMouseEnter={() => cyberAudio.playHover()}
                className="min-h-[44px] p-3 rounded-xl bg-neutral-950 border border-white/10 hover:border-white text-neutral-300 hover:text-white flex items-center justify-between text-xs font-mono transition-all"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </div>
                <ExternalLink size={12} className="text-neutral-500" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Stacked Mobile-Optimized Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-[#080808] rounded-3xl p-6 sm:p-8 border border-white/10"
        >
          <h3 className="font-display font-bold text-xl text-white mb-2">
            Send a Direct Transmission
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm font-sans mb-6">
            Prepares your message and opens your email client addressed to{' '}
            <span className="text-white font-mono">{personalData.email}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stacked Fields with min 48px height and 16px font to prevent mobile zoom */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ada Lovelace"
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 focus:border-white focus:ring-1 focus:ring-white text-base sm:text-sm text-white placeholder-neutral-600 outline-none transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5 font-semibold">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., name@domain.com"
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 focus:border-white focus:ring-1 focus:ring-white text-base sm:text-sm text-white placeholder-neutral-600 outline-none transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5 font-semibold">
                Subject (Optional)
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Full-Stack Engineering Role / AI Collaboration"
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 focus:border-white focus:ring-1 focus:ring-white text-base sm:text-sm text-white placeholder-neutral-600 outline-none transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5 font-semibold">
                Message Content
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your transmission here..."
                className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 focus:border-white focus:ring-1 focus:ring-white text-base sm:text-sm text-white placeholder-neutral-600 outline-none transition-all resize-none font-sans"
              />
            </div>

            {/* Primary Button: Pure White Background + Black Text */}
            <button
              type="submit"
              onMouseEnter={() => cyberAudio.playHover()}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-white text-black font-display font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} />
              <span>SEND TRANSMISSION</span>
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
