'use client';
import { certificationsData } from '@/lib/data';
import { motion } from 'framer-motion';

export default function CertificationsGrid() {
  const certs = certificationsData;

  if (certs.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mb-8">
        <div className="font-mono text-xs text-crt-text-dim mb-2 uppercase">{'>'} VERIFIED CREDENTIALS</div>
        <h2 className="font-pixel text-3xl text-crt-accent uppercase">CERTIFICATIONS</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certs.map((cert, i) => (
          <motion.div 
            key={cert.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="crt-box-dim p-6 flex flex-col h-full"
          >
            <div className="flex items-start gap-4 mb-4">
              {cert.badge_url && (
                <img src={cert.badge_url} alt={cert.name} className="w-12 h-12 object-contain filter contrast-125 brightness-90 grayscale-[0.2]" />
              )}
              <div>
                <h3 className="font-pixel text-lg text-crt-accent leading-tight uppercase">{cert.name}</h3>
                <div className="font-mono text-sm text-crt-text-dim mt-1 uppercase">{cert.issuer}</div>
              </div>
            </div>
            <div className="font-mono text-xs text-crt-text/80 mb-4 uppercase flex-grow">
              ISSUED: {new Date(cert.issued_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              {cert.expiry_date && ` | EXPIRES: ${new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
            </div>
            {cert.credential_url && (
              <a 
                href={cert.credential_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="crt-btn text-center text-xs mt-auto uppercase"
              >
                VERIFY
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
