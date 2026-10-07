'use client';
import { skillsData, type Skill } from '@/lib/data';
import { motion } from 'framer-motion';

export default function SkillsBlock() {
  const skills = skillsData;

  if (skills.length === 0) return null;

  const groups = skills.reduce((acc, skill) => {
    if (!acc[skill.group_name]) acc[skill.group_name] = [];
    acc[skill.group_name].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="font-mono text-xs text-crt-text-dim mb-2 uppercase">{'>'} LOADED MODULES</div>
        <h2 className="font-pixel text-3xl text-crt-accent uppercase">SKILLS & TOOLS</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(groups).map(([groupName, groupSkills], i) => (
          <motion.div 
            key={groupName}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="crt-box-dim p-6 space-y-4"
          >
            <h3 className="font-pixel text-lg text-crt-accent uppercase">{groupName}</h3>
            <div className="flex flex-wrap gap-3">
              {groupSkills.map(skill => (
                <span key={skill.id} className="crt-chip">
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
