'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/lib/supabase';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const allImages = project
    ? [
        ...(project.images || []),
        ...(project.image_url && !(project.images || []).includes(project.image_url)
          ? [project.image_url]
          : []),
      ]
    : [];
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => { setGalleryIdx(0); }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/80" />

          {/* panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.12 }}
            className="crt-box relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto p-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 crt-btn !p-1.5"
            >
              <X size={16} />
            </button>

            {/* large image / gallery */}
            <div
              className="relative w-full"
              style={{
                aspectRatio: '16 / 9',
                border: '3px solid var(--crt-border-dim)',
                borderBottomWidth: '3px',
              }}
            >
              {allImages.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={allImages[galleryIdx]}
                  alt={project.title}
                  className="h-full w-full object-contain"
                  style={{
                    filter: 'saturate(0.4) contrast(1.1) brightness(0.8) hue-rotate(70deg)',
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-crt-bg-soft font-pixel text-2xl text-crt-text-dim">
                  NO SIGNAL
                </div>
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setGalleryIdx((i) => (i - 1 + allImages.length) % allImages.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 crt-btn !p-1.5"
                    aria-label="previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setGalleryIdx((i) => (i + 1) % allImages.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 crt-btn !p-1.5"
                    aria-label="next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs text-crt-text-dim">
                    {galleryIdx + 1}/{allImages.length}
                  </div>
                </>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {allImages.map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setGalleryIdx(i); }}
                    className={`shrink-0 border-2 ${i === galleryIdx ? 'border-crt-accent' : 'border-crt-border-dim'}`}
                    style={{ borderRadius: 0 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`thumb ${i + 1}`} className="h-12 w-16 object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 p-6">
              <h2 className="font-pixel text-3xl leading-tight text-crt-accent text-glow">
                {project.title}
              </h2>

              <div>
                <div className="mb-1 font-mono text-xs text-crt-text-dim">
                  &gt; description
                </div>
                <p className="text-sm text-crt-text/95 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="mb-2 font-mono text-xs text-crt-text-dim">
                  &gt; tech_stack
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.map((t) => (
                    <span key={t} className="crt-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crt-btn"
                  >
                    <Github size={14} /> SOURCE
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="crt-btn crt-btn-solid"
                  >
                    <ExternalLink size={14} /> DEMO
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
