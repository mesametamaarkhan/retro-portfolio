'use client';

import { useState, useCallback } from 'react';
import { projectsData, tagsData } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { FilterBar } from '@/components/filter-bar';
import { Typewriter } from '@/components/typewriter';

interface AllProjectsProps {
  heading: string;
  subheading: string;
}

export function AllProjects({ heading, subheading }: AllProjectsProps) {
  const [active, setActive] = useState<string[]>([]);
  const [flickerKey, setFlickerKey] = useState(0);
  const [openProject, setOpenProject] = useState<any | null>(null);

  // Map projects to format expected by cards (with subcategory_ids)
  const projects = projectsData.map((p) => ({
    ...p,
    domain: '',
    subcategory_id: null,
    subcategory_ids: p.tag_ids,
  }));

  const subcats = tagsData.map((t) => ({
    id: t.id,
    name: t.name,
    domain: 'all',
  }));

  const toggle = useCallback((name: string) => {
    setActive((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
    setFlickerKey((k) => k + 1);
  }, []);

  const clearAll = useCallback(() => {
    setActive([]);
    setFlickerKey((k) => k + 1);
  }, []);

  const filtered = active.length
    ? projects.filter((p) => {
        const ids = p.subcategory_ids || [];
        return active.some((name) => {
          const sc = subcats.find((s) => s.name === name);
          return sc && ids.includes(sc.id);
        });
      })
    : projects;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <div className="font-mono text-xs text-crt-text-dim mb-1">
          &gt; cd /projects
        </div>
        <h1 className="font-pixel text-4xl sm:text-5xl text-crt-accent text-glow">
          <Typewriter text={heading} speed={40} />
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-crt-text/80">
          <Typewriter text={subheading} speed={10} startDelay={800} cursor={false} />
        </p>
      </div>

      <div className="mb-6">
        <div className="font-mono text-xs text-crt-text-dim mb-2">
          &gt; FILTER BY TAG:
        </div>
        <FilterBar
          subcategories={subcats}
          active={active}
          onToggle={toggle}
          onAll={clearAll}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="crt-box-dim p-6 font-pixel text-xl text-crt-text-dim">
          &gt; NO PROJECTS MATCH FILTER. PRESS [ ALL ] TO RESET.
        </div>
      ) : (
        <div
          key={flickerKey}
          className="grid grid-flicker gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gridAutoRows: '1fr', alignItems: 'stretch' }}
        >
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p as any} index={i} onOpen={setOpenProject} />
          ))}
        </div>
      )}

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}
