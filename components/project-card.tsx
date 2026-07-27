'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/lib/supabase';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onOpen?: (project: Project) => void;
}

export function ProjectCard({ project, index = 0, onOpen }: ProjectCardProps) {
  const descRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);
  const cover = project.images?.[0] || project.image_url;

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [project.description]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.12, delay: Math.min(index * 0.04, 0.2) }}
      className="crt-box-dim flex flex-col p-0 overflow-hidden"
      style={{ borderRadius: 0 }}
    >
      {/* pixel-framed image */}
      <div
        className="relative w-full"
        style={{ aspectRatio: '16 / 10', border: '3px solid var(--crt-border-dim)', borderBottomWidth: '3px' }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={project.title}
            className="h-full w-full object-contain"
            style={{ filter: 'saturate(0.4) contrast(1.1) brightness(0.8) hue-rotate(70deg)', background: 'var(--crt-bg-soft)' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-crt-bg-soft font-pixel text-crt-text-dim">
            NO SIGNAL
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-pixel text-2xl leading-tight text-crt-accent">
          {project.title}
        </h3>
        <p
          ref={descRef}
          className="line-clamp-3 text-sm text-crt-text/90 leading-relaxed"
        >
          {project.description}
        </p>
        {truncated && onOpen && (
          <button
            onClick={() => onOpen(project)}
            className="self-start font-mono text-xs text-crt-accent hover:underline"
          >
            read more <ArrowRight size={12} className="inline" />
          </button>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.map((t) => (
            <span key={t} className="crt-chip">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="crt-btn !text-xs !py-1.5 !px-3"
            >
              <Github size={14} /> SOURCE
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="crt-btn crt-btn-solid !text-xs !py-1.5 !px-3"
            >
              <ExternalLink size={14} /> DEMO
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
