'use client';
import { useState } from 'react';
import Link from 'next/link';
import { projectsData } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';

export default function FeaturedProjects() {
  const projects = projectsData.filter((p) => p.featured).slice(0, 6);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="font-mono text-xs text-crt-text-dim mb-2 uppercase">{'>'} FEATURED PROJECTS</div>
        <h2 className="font-pixel text-3xl text-crt-accent uppercase">SELECTED WORK</h2>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {projects.map((project) => (
            <div key={project.id} onClick={() => setSelectedProject(project)}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="font-mono text-crt-text-dim py-8 mb-8">
          {'>'} NO PROJECTS FOUND IN SYSTEM.
        </div>
      )}
      
      <div className="text-center">
        <Link href="/projects" className="crt-btn uppercase">
          VIEW ALL PROJECTS
        </Link>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
