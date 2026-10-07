'use client';

import Link from 'next/link';
import { profileData } from '@/lib/data';
import { Typewriter } from '@/components/typewriter';
import { motion } from 'framer-motion';

export default function Hero() {
  const profile = profileData;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 md:py-24"
    >
      <div className="font-mono text-xs text-crt-text-dim mb-6 uppercase">{'>'} boot security.sys ... OK</div>
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="flex-1 space-y-6">
          <h1 className="font-pixel text-4xl sm:text-6xl text-crt-accent text-glow uppercase">
            {profile.name}
          </h1>
          <div className="font-mono text-xl md:text-2xl text-crt-text uppercase h-8">
            <Typewriter text={profile.title} speed={50} startDelay={500} />
          </div>
          <p className="font-mono text-crt-text/80 max-w-2xl text-lg leading-relaxed">
            {profile.tagline}
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link href="/projects" className="crt-btn crt-btn-solid uppercase">
              VIEW PROJECTS
            </Link>
            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="crt-btn uppercase">
                DOWNLOAD RESUME
              </a>
            )}
            <Link href="/contact" className="crt-btn uppercase">
              CONTACT
            </Link>
          </div>
        </div>
        
        <div className="shrink-0 relative group">
          <div className="border-2 border-crt-accent p-2 bg-crt-bg relative before:absolute before:inset-0 before:bg-[url('/scanline.png')] before:opacity-20 before:pointer-events-none before:z-10 shadow-[0_0_15px_rgba(50,205,50,0.3)]">
            {profile.photo_url ? (
              <img 
                src={profile.photo_url} 
                alt={profile.name} 
                className="w-48 h-48 md:w-64 md:h-64 object-cover filter contrast-125 brightness-90 grayscale-[0.5]"
              />
            ) : (
              <div className="w-48 h-48 md:w-64 md:h-64 bg-crt-bg-soft flex items-center justify-center font-pixel text-crt-accent text-6xl">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
