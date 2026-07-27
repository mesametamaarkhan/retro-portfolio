'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Typewriter } from '@/components/typewriter';
import { Terminal, Shield, Boxes, ArrowRight } from 'lucide-react';

const CARDS = [
  {
    href: '/dev',
    title: 'DEV',
    desc: 'Software projects, compilers, tools and CLI utilities built across the stack.',
    icon: Terminal,
  },
  {
    href: '/cybersecurity',
    title: 'CYBER',
    desc: 'Offensive and defensive security work — frameworks, detectors and honeypots.',
    icon: Shield,
  },
  {
    href: '/blockchain',
    title: 'CHAIN',
    desc: 'Smart contracts, DeFi routers, NFT portals and validator infrastructure.',
    icon: Boxes,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="mb-14 crt-flicker">
        <div className="font-mono text-xs text-crt-text-dim mb-3">
          &gt; boot crt-portfolio.sys ... OK
        </div>
        <h1 className="font-pixel text-4xl sm:text-6xl text-crt-accent text-glow leading-tight">
          <Typewriter text="HELLO. I BUILD THINGS." speed={55} />
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-base text-crt-text/90 leading-relaxed">
          <Typewriter
            text="Welcome to my terminal. I'm a developer working across software, security and blockchain. Pick a domain below to browse projects."
            speed={28}
            startDelay={1400}
            cursor={false}
          />
        </p>
      </section>

      {/* Domain cards */}
      <section>
        <div className="font-mono text-xs text-crt-text-dim mb-3">
          &gt; SELECT DOMAIN:
        </div>
        <div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gridAutoRows: '1fr', alignItems: 'stretch' }}
        >
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.href}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.12, delay: i * 0.06 }}
              >
                <Link
                  href={c.href}
                  className="crt-box group flex h-full flex-col p-5 transition-colors duration-100"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="border-2 border-crt-accent p-2 text-crt-accent">
                      <Icon size={22} />
                    </span>
                    <h2 className="font-pixel text-3xl text-crt-accent">{c.title}</h2>
                  </div>
                  <p className="flex-1 text-sm text-crt-text/90 leading-relaxed">
                    {c.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-2 font-mono text-xs text-crt-accent">
                    ENTER <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
