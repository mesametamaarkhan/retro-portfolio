'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/dev', label: 'DEV' },
  { href: '/cybersecurity', label: 'CYBER' },
  // { href: '/blockchain', label: 'CHAIN' },
  { href: '/resume', label: 'RESUME' },
  { href: '/contact', label: 'CONTACT' },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-2 border-crt-border-dim bg-crt-bg/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-pixel text-xl text-crt-accent text-glow">
          root@mtk
        </Link>

      {/* desktop menu */}
      <nav className="hidden md:flex items-center gap-1 font-mono text-sm">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <span className="text-crt-text-dim">[</span>
              <span className={active ? 'text-crt-accent' : ''}>{l.label}</span>
              <span className="text-crt-text-dim">]</span>
            </Link>
          );
        })}
      </nav>

      {/* mobile toggle */}
      <button
        className="crt-btn md:hidden !px-2 !py-1 text-xs"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? 'X' : '≡'}
      </button>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="md:hidden border-t-2 border-crt-border-dim bg-crt-panel px-4 py-2">
          <div className="flex flex-col gap-1 font-mono text-sm">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`nav-item ${active ? 'active' : ''}`}
                >
                  <span className="text-crt-text-dim">[</span>
                  <span className={active ? 'text-crt-accent' : ''}>{l.label}</span>
                  <span className="text-crt-text-dim">]</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
