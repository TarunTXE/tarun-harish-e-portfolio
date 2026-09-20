import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, Eye, ExternalLink, X } from 'lucide-react';
import { cyberAudio } from '../utils/audio';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  link?: string;
}

export const Gallery: React.FC = () => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gallery-portfolio',
      title: 'Portfolio Creator & Career Hub',
      category: 'Full Stack SaaS',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      description: 'Dynamic portfolio generator with live template WYSIWYG editor and instant PDF compile engine.',
      tags: ['React', 'Node.js', 'MongoDB', 'Vercel'],
      link: 'https://portfolio-creator-cyan.vercel.app',
    },
    {
      id: 'gallery-wheelchair',
      title: 'Wheelchair Push-up Vision AI (SIH)',
      category: 'Computer Vision / Health',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      description: 'MediaPipe 33-landmark pose estimation for wheelchair pressure relief tracking and ulcer prevention.',
      tags: ['Python', 'OpenCV', 'MediaPipe', 'Scikit-learn'],
    },
    {
      id: 'gallery-qrforge',
      title: 'QRForge Dynamic Engine',
      category: 'Django + React Web App',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      description: 'Vectorized custom QR code platform with dynamic analytics, business card layouts, and SVG export.',
      tags: ['Django', 'React', 'Tailwind CSS'],
    },
    {
      id: 'gallery-careflow',
      title: 'CareFlow Hospital Portal',
      category: 'Healthcare Operations',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      description: 'Digital ward management system with real-time bed capacity and triage allocation metrics.',
      tags: ['JavaScript', 'HTML5', 'CSS3', 'REST API'],
    },
    {
      id: 'gallery-vhe',
      title: 'VHE Modern Web Experience',
      category: 'TypeScript Production',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: 'Clean responsive interface engineered with TypeScript and high-speed CSS animations.',
      tags: ['TypeScript', 'Vite', 'Responsive UI'],
      link: 'https://vhe-website.vercel.app',
    },
    {
      id: 'gallery-weather',
      title: 'AtmoSphere Weather Matrix',
      category: 'Geospatial Weather',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80',
      description: 'Dynamic atmospheric dashboard delivering microclimate radar telemetry and 7-day forecasts.',
      tags: ['JavaScript', 'OpenWeather API', 'CSS Grid'],
    },
  ];

  return (
    <section id="gallery" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue font-mono text-xs uppercase tracking-widest mb-3">
          <Images size={13} />
          Visual Architecture // Phase 06
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
          Project <span className="text-gradient-purple">Gallery</span>
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl font-sans">
          Curated visual representations of web architectures, computer vision models, and production deployments.
        </p>
      </div>

      {/* Masonry-Style Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => {
              cyberAudio.playClick();
              setActiveItem(item);
            }}
            onMouseEnter={() => cyberAudio.playHover()}
            className="group relative h-80 rounded-3xl overflow-hidden glass-panel border border-slate-800 cursor-pointer hover:border-cyber-blue/50 transition-all duration-500 hover:shadow-2xl"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover filter brightness-[0.7] contrast-105 group-hover:scale-110 group-hover:brightness-50 transition-all duration-700 ease-out"
            />

            {/* Sci-Fi scanline overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Corner Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-950/80 backdrop-blur-md border border-slate-700 text-cyber-cyan shadow-sm">
                {item.category}
              </span>
            </div>

            {/* Hover Floating Action Icon */}
            <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 group-hover:text-cyber-cyan group-hover:border-cyber-cyan/50 flex items-center justify-center transition-colors">
              <Eye size={15} />
            </div>

            {/* Info Overlay at Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-6 z-10 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-display font-bold text-xl text-white group-hover:text-cyber-cyan transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-slate-300 text-xs line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-panel rounded-3xl overflow-hidden border border-cyber-cyan/40 shadow-glow-cyan/20 z-10"
            >
              {/* Image Preview Banner */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 text-white border border-slate-700 hover:border-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Details Content */}
              <div className="p-6 sm:p-8">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyber-cyan block mb-1">
                  {activeItem.category}
                </span>
                <h3 className="font-display font-bold text-2xl text-white mb-3">
                  {activeItem.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-sans mb-6">
                  {activeItem.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeItem.tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg bg-cyber-card border border-slate-700 text-xs font-mono text-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {activeItem.link && (
                  <a
                    href={activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-display font-semibold text-xs tracking-wide shadow-glow-blue/20"
                  >
                    <span>Visit Live Deployment</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
