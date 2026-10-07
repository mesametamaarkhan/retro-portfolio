'use client';

import { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Typewriter } from '@/components/typewriter';
import { LogOut, KeyRound, Copy, Check, FileCode, Database } from 'lucide-react';
import {
  profileData,
  projectsData,
  experiencesData,
  certificationsData,
  skillsData,
  tagsData,
} from '@/lib/data';

type Tab = 'profile' | 'projects' | 'experience' | 'certifications' | 'skills' | 'tags' | 'raw';
const TABS: Tab[] = ['profile', 'projects', 'experience', 'certifications', 'skills', 'tags', 'raw'];

export default function AdminPage() {
  const { isAdmin, login, logout } = useAdmin();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="crt-box p-6">
          <div className="font-mono text-xs text-crt-text-dim mb-2">&gt; auth required</div>
          <h1 className="font-pixel text-3xl text-crt-accent mb-4">
            <Typewriter text="ADMIN LOGIN" speed={45} />
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (login(pw)) {
                setErr('');
              } else {
                setErr('ACCESS DENIED. WRONG KEY.');
              }
            }}
            className="flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1">
              <span className="font-mono text-xs text-crt-accent">PASSWORD:</span>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="crt-box-dim bg-crt-bg-soft px-3 py-2 font-mono text-sm text-crt-text outline-none focus:border-crt-accent"
                style={{ borderRadius: 0 }}
                placeholder="enter password"
              />
            </label>
            {err && (
              <div className="font-mono text-xs text-crt-amber">&gt; ERR: {err}</div>
            )}
            <button type="submit" className="crt-btn crt-btn-solid w-full">
              <KeyRound size={14} /> AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={logout} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('profile');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs text-crt-text-dim">&gt; su admin // static mode</div>
          <h1 className="font-pixel text-3xl text-crt-accent text-glow">
            SYSTEM CONTROL PANEL
          </h1>
        </div>
        <button onClick={onLogout} className="crt-btn">
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      {/* Info Notice */}
      <div className="crt-box-dim p-4 mb-6 border-l-4 border-crt-accent bg-crt-bg-soft">
        <div className="flex items-center gap-2 font-pixel text-lg text-crt-accent">
          <Database size={16} /> STORAGE MODE: PURE LOCAL STATIC STORE
        </div>
        <p className="font-mono text-xs text-crt-text/80 mt-1">
          Zero external database connected. All portfolio data is loaded directly from{' '}
          <code className="text-crt-accent bg-black/40 px-1 py-0.5">lib/data.ts</code>.
          Edit that file directly in your code editor to update items with instant preview.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`crt-chip ${tab === t ? 'crt-chip-active' : ''}`}
            style={{ cursor: 'pointer', padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
          >
            {tab === t ? '[ ' : '  '}
            {t.toUpperCase()}
            {tab === t ? ' ]' : '  '}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {tab === 'profile' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl text-crt-accent">&gt; PROFILE CONFIG</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(profileData, null, 2))}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY JSON
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 font-mono text-xs">
            <FieldRow label="NAME" value={profileData.name} />
            <FieldRow label="TITLE" value={profileData.title} />
            <FieldRow label="TAGLINE" value={profileData.tagline} />
            <FieldRow label="LOCATION" value={profileData.location} />
            <FieldRow label="EMAIL" value={profileData.email} />
            <FieldRow label="GITHUB" value={profileData.github_url || '—'} />
            <FieldRow label="LINKEDIN" value={profileData.linkedin_url || '—'} />
            <FieldRow label="RESUME URL" value={profileData.resume_url || '—'} />
          </div>
          <div className="mt-4 pt-4 border-t border-crt-border-dim font-mono text-xs">
            <span className="text-crt-accent font-bold">BIO:</span>
            <p className="mt-1 text-crt-text/90 leading-relaxed">{profileData.bio}</p>
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl text-crt-accent">&gt; PROJECTS LIST ({projectsData.length})</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(projectsData, null, 2))}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY ALL
            </button>
          </div>
          <div className="space-y-3">
            {projectsData.map((p) => (
              <div key={p.id} className="crt-box-dim p-4 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xl text-crt-accent">{p.title}</span>
                    {p.featured && (
                      <span className="crt-chip crt-chip-active text-[10px]">FEATURED</span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-crt-text/80">{p.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.tech_stack.map((t) => (
                      <span key={t} className="crt-chip text-[10px]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-xs text-crt-text-dim shrink-0">
                  ORDER: #{p.order}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'experience' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl text-crt-accent">&gt; WORK TIMELINE ({experiencesData.length})</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(experiencesData, null, 2))}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY JSON
            </button>
          </div>
          <div className="space-y-4">
            {experiencesData.map((exp) => (
              <div key={exp.id} className="crt-box-dim p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-pixel text-xl text-crt-accent">{exp.company}</h3>
                    <div className="font-mono text-sm text-crt-text">{exp.role}</div>
                  </div>
                  <span className="font-mono text-xs text-crt-text-dim">
                    {exp.start_date} — {exp.end_date || 'PRESENT'}
                  </span>
                </div>
                <ul className="font-mono text-xs text-crt-text/90 space-y-1 pl-2">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>&gt; {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'certifications' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl text-crt-accent">&gt; CERTIFICATIONS ({certificationsData.length})</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(certificationsData, null, 2))}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY JSON
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {certificationsData.map((c) => (
              <div key={c.id} className="crt-box-dim p-4 space-y-1">
                <h3 className="font-pixel text-lg text-crt-accent">{c.name}</h3>
                <div className="font-mono text-xs text-crt-text-dim">{c.issuer}</div>
                <div className="font-mono text-xs text-crt-text/80">
                  ISSUED: {c.issued_date} {c.expiry_date ? `| EXP: ${c.expiry_date}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl text-crt-accent">&gt; SKILLS INVENTORY ({skillsData.length})</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(skillsData, null, 2))}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY JSON
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillsData.map((s) => (
              <span key={s.id} className="crt-chip">
                <span className="text-crt-accent">[{s.group_name}]</span> {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === 'tags' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-2xl text-crt-accent">&gt; PROJECT TAGS ({tagsData.length})</h2>
            <button
              onClick={() => copyToClipboard(JSON.stringify(tagsData, null, 2))}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY JSON
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagsData.map((t) => (
              <span key={t.id} className="crt-chip crt-chip-active">
                {t.name} <span className="text-crt-text-dim text-[10px]">({t.id})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {tab === 'raw' && (
        <div className="crt-box p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode size={18} className="text-crt-accent" />
              <h2 className="font-pixel text-2xl text-crt-accent">&gt; RAW DATA PREVIEW</h2>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  JSON.stringify(
                    {
                      profile: profileData,
                      tags: tagsData,
                      projects: projectsData,
                      experiences: experiencesData,
                      certifications: certificationsData,
                      skills: skillsData,
                    },
                    null,
                    2
                  )
                )
              }
              className="crt-btn !text-xs !py-1 !px-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} COPY COMPLETE STORE
            </button>
          </div>
          <pre className="crt-box-dim bg-black/60 p-4 font-mono text-xs text-crt-text/90 overflow-x-auto max-h-[500px]">
            {JSON.stringify(
              {
                profile: profileData,
                tags: tagsData,
                projects: projectsData,
                experiences: experiencesData,
                certifications: certificationsData,
                skills: skillsData,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-crt-border-dim/40 p-2 bg-crt-bg-soft">
      <span className="text-crt-text-dim block text-[10px] uppercase">{label}</span>
      <span className="text-crt-accent font-medium truncate block">{value}</span>
    </div>
  );
}
