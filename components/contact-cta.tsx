'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ContactCTA() {
  return (
    <section className="py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="crt-box p-8 md:p-12 text-center flex flex-col items-center gap-6"
      >
        <div>
          <div className="font-mono text-xs text-crt-text-dim mb-2 uppercase">{'>'} OPEN CHANNEL</div>
          <h2 className="font-pixel text-3xl text-crt-accent uppercase">GET IN TOUCH</h2>
        </div>
        
        <p className="font-mono text-crt-text text-lg max-w-lg">
          Interested in working together? Let's connect.
        </p>

        <Link href="/contact" className="crt-btn crt-btn-solid mt-4 uppercase">
          INITIATE CONTACT
        </Link>
      </motion.div>
    </section>
  );
}
