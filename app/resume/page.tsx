'use client';

import { Typewriter } from '@/components/typewriter';
import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { profileData } from '@/lib/data';

export default function ResumePage() {
  const resumeUrl = profileData.resume_url;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <div className="font-mono text-xs text-crt-text-dim mb-1">&gt; cd /resume</div>
        <h1 className="font-pixel text-4xl sm:text-5xl text-crt-accent text-glow">
          <Typewriter text="CLASSIFIED DOCUMENTS" speed={40} />
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-crt-text/80">
          <Typewriter text="Download the complete dossier." speed={10} startDelay={800} cursor={false}/>
        </p>
      </div>

      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gridAutoRows: '1fr', alignItems: 'stretch' }}
      >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.12 }}
            className="crt-box flex flex-col p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="border-2 border-crt-accent p-2 text-crt-accent">
                <FileText size={20} />
              </span>
              <h2 className="font-pixel text-2xl text-crt-accent">
                RESUME
              </h2>
            </div>
            <p className="flex-1 text-sm text-crt-text/90 leading-relaxed">
              {resumeUrl
                ? 'Curriculum vitae — formatted PDF, ready to download.'
                : 'NO FILE UPLOADED. Check back soon.'}
            </p>
            <div className="mt-4">
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="crt-btn crt-btn-solid w-full"
                >
                  <Download size={14} /> DOWNLOAD RESUME
                </a>
              ) : (
                <button className="crt-btn w-full" disabled>
                  NO FILE
                </button>
              )}
            </div>
          </motion.div>
        </div>
    </div>
  );
}
