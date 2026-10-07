'use client';

import { experiencesData } from '@/lib/data';
import { motion } from 'framer-motion';

export default function ExperienceTimeline() {
  const experiences = experiencesData;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'PRESENT';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
  };

  if (experiences.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-10">
        <div className="font-mono text-xs text-crt-text-dim mb-2 uppercase">{'>'} SYSTEM LOG</div>
        <h2 className="font-pixel text-3xl text-crt-accent uppercase">EXPERIENCE</h2>
      </div>
      
      <div className="relative pl-6 border-l-2 border-crt-accent space-y-12">
        {experiences.map((exp, idx) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-1 w-4 h-4 bg-crt-bg border-2 border-crt-accent rounded-full shadow-[0_0_8px_rgba(50,205,50,0.8)]"></div>
            <div className="space-y-2">
              <h3 className="font-pixel text-xl text-crt-accent uppercase">{exp.company}</h3>
              <div className="font-mono text-lg text-crt-text uppercase">{exp.role}</div>
              <div className="font-mono text-sm text-crt-text-dim uppercase">
                {formatDate(exp.start_date)} — {formatDate(exp.end_date)} | {exp.location}
              </div>
              <ul className="mt-4 space-y-2 font-mono text-sm text-crt-text/90">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-crt-accent">{'>'}</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
