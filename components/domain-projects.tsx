'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, Project, Subcategory, Domain, ProjectSubcategory } from '@/lib/supabase';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { FilterBar } from '@/components/filter-bar';
import { Typewriter } from '@/components/typewriter';
import { DOMAIN_LABELS } from '@/lib/supabase';

interface DomainProjectsProps {
  domain: Domain;
  heading: string;
  subheading: string;
}

export function DomainProjects({ domain, heading, subheading }: DomainProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [subcats, setSubcats] = useState<Subcategory[]>([]);
  const [active, setActive] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [flickerKey, setFlickerKey] = useState(0);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: pj }, { data: sc }, { data: links }] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('domain', domain)
          .order('featured', { ascending: false })
          .order('order', { ascending: true }),
        supabase.from('subcategories').select('*').eq('domain', domain).order('name'),
        supabase.from('project_subcategories').select('*'),
      ]);
      if (cancelled) return;
      const linkRows = (links as ProjectSubcategory[]) || [];
      const withIds: Project[] = ((pj as Project[]) || []).map((p) => ({
        ...p,
        subcategory_ids: linkRows
          .filter((l) => l.project_id === p.id)
          .map((l) => l.subcategory_id),
      }));
      setProjects(withIds);
      setSubcats((sc as Subcategory[]) || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [domain]);

  const toggle = useCallback((name: string) => {
    setActive((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
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
          &gt; cd /{domain}
        </div>
        <h1 className="font-pixel text-4xl sm:text-5xl text-crt-accent text-glow">
          <Typewriter text={heading} speed={40} />
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-crt-text/80">{subheading}</p>
      </div>

      <div className="mb-6">
        <div className="font-mono text-xs text-crt-text-dim mb-2">
          &gt; FILTER {DOMAIN_LABELS[domain]} CATEGORIES:
        </div>
        <FilterBar
          subcategories={subcats}
          active={active}
          onToggle={toggle}
          onAll={clearAll}
        />
      </div>

      {loading ? (
        <div className="font-pixel text-2xl text-crt-text-dim blink">
          LOADING SIGNAL...
        </div>
      ) : filtered.length === 0 ? (
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
            <ProjectCard key={p.id} project={p} index={i} onOpen={setOpenProject} />
          ))}
        </div>
      )}

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}
