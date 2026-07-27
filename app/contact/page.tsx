'use client';

import { useState } from 'react';
import { Typewriter } from '@/components/typewriter';
import { Github, Linkedin, Mail, Send, Instagram } from 'lucide-react';

const SOCIALS = [
  { label: 'GITHUB', href: 'https://github.com/mesametamaarkhan', icon: Github },
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/mesam-tamaar-khan', icon: Linkedin },
  { label: 'EMAIL', href: 'mailto:mesamtamaark@gmail.com', icon: Mail },
  { label: 'INSTAGRAM', href: 'https://twitter.com', icon: Instagram },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('ALL FIELDS REQUIRED.');
      return;
    }
    // No backend mailer configured — simulate success in this demo.
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="font-mono text-xs text-crt-text-dim mb-1">&gt; cd /contact</div>
        <h1 className="font-pixel text-4xl sm:text-5xl text-crt-accent text-glow">
          <Typewriter text="OPEN CHANNEL" speed={40} />
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-crt-text/80">
          <Typewriter text="Send a transmission via the form below, or reach out through any of the open channels." speed={10} startDelay={500} cursor={false}/>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* form */}
        <form onSubmit={submit} className="crt-box flex flex-col gap-4 p-5">
          <div className="font-mono text-xs text-crt-text-dim">&gt; compose_message</div>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs text-crt-accent">NAME:</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="crt-box-dim bg-crt-bg-soft px-3 py-2 font-mono text-sm text-crt-text outline-none focus:border-crt-accent"
              style={{ borderRadius: 0 }}
              placeholder="your handle"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs text-crt-accent">EMAIL:</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="crt-box-dim bg-crt-bg-soft px-3 py-2 font-mono text-sm text-crt-text outline-none focus:border-crt-accent"
              style={{ borderRadius: 0 }}
              placeholder="you@domain.io"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-mono text-xs text-crt-accent">MESSAGE:</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="crt-box-dim bg-crt-bg-soft px-3 py-2 font-mono text-sm text-crt-text outline-none focus:border-crt-accent resize-none"
              style={{ borderRadius: 0 }}
              placeholder="type your message..."
            />
          </label>

          {error && (
            <div className="font-mono text-xs text-crt-amber">&gt; ERR: {error}</div>
          )}
          {sent && (
            <div className="font-mono text-xs text-crt-accent">
              &gt; MESSAGE TRANSMITTED. STAND BY.
            </div>
          )}

          <button type="submit" className="crt-btn crt-btn-solid w-full">
            <Send size={14} /> TRANSMIT
          </button>
        </form>

        {/* socials */}
        <div className="crt-box-dim flex flex-col gap-3 p-5">
          <div className="font-mono text-xs text-crt-text-dim">&gt; open_channels</div>
          <div className="flex flex-col gap-2">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crt-btn justify-start"
                >
                  <Icon size={16} /> {s.label}
                </a>
              );
            })}
          </div>
          <p className="mt-2 font-mono text-xs text-crt-text-dim">
            &gt; response time: usually within 48h
          </p>
        </div>
      </div>
    </div>
  );
}
