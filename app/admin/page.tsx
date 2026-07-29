'use client';

import { useEffect, useState } from 'react';
import { supabase, Project, Subcategory, Resume, Domain, DOMAIN_LABELS } from '@/lib/supabase';
import { useAdmin } from '@/lib/admin-context';
import { Typewriter } from '@/components/typewriter';
import { ImageUploader, PdfUploader } from '@/components/image-uploader';
import { Plus, Trash2, Pencil, X, Save, LogOut, KeyRound, GripVertical } from 'lucide-react';

type Tab = 'projects' | 'subcategories' | 'resumes';
const DOMAINS: Domain[] = ['dev', 'cybersecurity', 'blockchain'];

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
  const [tab, setTab] = useState<Tab>('projects');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-xs text-crt-text-dim">&gt; su admin</div>
          <h1 className="font-pixel text-3xl text-crt-accent text-glow">
            CONTROL PANEL
          </h1>
        </div>
        <button onClick={onLogout} className="crt-btn">
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      {/* tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['projects', 'subcategories', 'resumes'] as Tab[]).map((t) => (
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

      {tab === 'projects' && <ProjectsAdmin />}
      {tab === 'subcategories' && <SubcategoriesAdmin />}
      {tab === 'resumes' && <ResumesAdmin />}
    </div>
  );
}

/* ---------- Projects ---------- */

const EMPTY_PROJECT = {
  title: '',
  description: '',
  domain: 'dev' as Domain,
  tech_stack: '',
  github_url: '',
  demo_url: '',
  subcategory_ids: [] as string[],
  images: [] as string[],
};

/* ---------- Project list with drag-and-drop reordering ---------- */

interface ProjectListProps {
  items: Project[];
  onEdit: (p: Project) => void;
  onRemove: (id: string) => void;
  onReorder: (id: string, dir: 'up' | 'down') => void;
}

function ProjectList({ items, onEdit, onRemove, onReorder }: ProjectListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const onDrop = async (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    // Build the new ordering by moving the dragged item to the target position,
    // then persist sequential order values for the whole domain list.
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    await Promise.all(
      next.map((p, i) => supabase.from('projects').update({ order: i + 1 }).eq('id', p.id)),
    );
    setDragIdx(null);
    setOverIdx(null);
    // reload via onReorder hack: call onReorder with a no-op then parent reloads
    // Simpler: trigger parent reload by calling onReorder on first item id 'up' only if needed.
    // Instead we use a custom event to ask parent to reload.
    window.dispatchEvent(new CustomEvent('projects:reload'));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((p, i) => {
        const isOver = overIdx === i && dragIdx !== null && dragIdx !== i;
        return (
          <div
            key={p.id}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }}
            onDragLeave={() => setOverIdx((v) => (v === i ? null : v))}
            onDrop={() => onDrop(i)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            className={`flex flex-wrap items-center justify-between gap-2 border-2 px-3 py-2 transition-colors ${
              isOver
                ? 'border-crt-accent bg-crt-accent/10'
                : 'border-crt-border-dim bg-crt-bg-soft'
            } ${dragIdx === i ? 'opacity-50' : ''}`}
            style={{ cursor: 'grab' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical size={14} className="text-crt-text-dim shrink-0" />
              <span className="font-mono text-xs text-crt-text-dim shrink-0">
                #{p.order}
              </span>
              <div className="min-w-0">
                <div className="font-pixel text-lg text-crt-accent truncate">{p.title}</div>
                <div className="font-mono text-xs text-crt-text-dim truncate">
                  {p.tech_stack.join(', ')}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReorder(p.id, 'up'); }}
                className="crt-btn !text-xs !py-1 !px-1.5"
                disabled={i === 0}
                aria-label="move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReorder(p.id, 'down'); }}
                className="crt-btn !text-xs !py-1 !px-1.5"
                disabled={i === items.length - 1}
                aria-label="move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                className="crt-btn !text-xs !py-1 !px-2"
              >
                <Pencil size={12} /> EDIT
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(p.id); }}
                className="crt-btn !text-xs !py-1 !px-2"
              >
                <Trash2 size={12} /> DEL
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [subcats, setSubcats] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ ...EMPTY_PROJECT });
  const [showForm, setShowForm] = useState(false);

  const toggleSubcat = (id: string) => {
    setForm((f) => ({
      ...f,
      subcategory_ids: f.subcategory_ids.includes(id)
        ? f.subcategory_ids.filter((x) => x !== id)
        : [...f.subcategory_ids, id],
    }));
  };

  const load = async () => {
    setLoading(true);
    const [{ data: pj }, { data: sc }, { data: links }] = await Promise.all([
      supabase.from('projects').select('*').order('domain').order('order', { ascending: true }),
      supabase.from('subcategories').select('*').order('domain, name'),
      supabase.from('project_subcategories').select('*'),
    ]);
    const linkRows = (links as { project_id: string; subcategory_id: string }[]) || [];
    const withIds: Project[] = ((pj as Project[]) || []).map((p) => ({
      ...p,
      subcategory_ids: linkRows
        .filter((l) => l.project_id === p.id)
        .map((l) => l.subcategory_id),
    }));
    setItems(withIds);
    setSubcats((sc as Subcategory[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('projects:reload', handler);
    return () => window.removeEventListener('projects:reload', handler);
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_PROJECT });
    setShowForm(true);
  };
  const startEdit = (p: Project) => {
    setEditing(p);
    setShowForm(true);
    setForm({
      title: p.title,
      description: p.description,
      domain: p.domain as Domain,
      tech_stack: p.tech_stack.join(', '),
      github_url: p.github_url || '',
      demo_url: p.demo_url || '',
      subcategory_ids: p.subcategory_ids || [],
      images: p.images || [],
    });
  };

  const syncSubcats = async (projectId: string, ids: string[]) => {
    await supabase.from('project_subcategories').delete().eq('project_id', projectId);
    if (ids.length) {
      await supabase
        .from('project_subcategories')
        .insert(ids.map((subcategory_id) => ({ project_id: projectId, subcategory_id })));
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    let order = editing?.order ?? 0;
    if (!editing) {
      const sameDomain = items.filter((p) => p.domain === form.domain);
      order = sameDomain.length
        ? Math.max(...sameDomain.map((p) => p.order)) + 1
        : 1;
    }
    const payload = {
      title: form.title,
      description: form.description,
      domain: form.domain,
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      github_url: form.github_url || null,
      demo_url: form.demo_url || null,
      images: form.images,
      order,
    };
    let projectId = editing?.id;
    if (editing) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
    } else {
      const { data, error } = await supabase.from('projects').insert(payload).select('id').single();
      if (data) projectId = data.id;
      if (error) console.error(error);
    }
    if (projectId) await syncSubcats(projectId, form.subcategory_ids);
    setEditing(null);
    setForm({ ...EMPTY_PROJECT });
    setShowForm(false);
    await load();
  };

  const reorder = async (projectId: string, direction: 'up' | 'down') => {
    const domainItems = items.filter((p) => p.domain === items.find((x) => x.id === projectId)?.domain);
    const idx = domainItems.findIndex((p) => p.id === projectId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= domainItems.length) return;
    const a = domainItems[idx];
    const b = domainItems[swapIdx];
    const aOrder = a.order;
    const bOrder = b.order;
    await Promise.all([
      supabase.from('projects').update({ order: bOrder }).eq('id', a.id),
      supabase.from('projects').update({ order: aOrder }).eq('id', b.id),
    ]);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="crt-box-dim p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-crt-text-dim">&gt; projects.db</span>
          <button onClick={startNew} className="crt-btn crt-btn-solid !text-xs !py-1.5">
            <Plus size={14} /> NEW
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {DOMAINS.map((d) => {
            const domainItems = items.filter((p) => p.domain === d);
            if (domainItems.length === 0) return null;
            return (
              <div key={d} className="flex flex-col gap-2">
                <div className="font-mono text-xs text-crt-text-dim">
                  &gt; {DOMAIN_LABELS[d]} ({domainItems.length})
                </div>
                <ProjectList
                  items={domainItems}
                  onEdit={startEdit}
                  onRemove={remove}
                  onReorder={reorder}
                />
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="font-mono text-xs text-crt-text-dim">&gt; no records</div>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={save} className="crt-box flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-crt-accent">
              {editing ? '&gt; edit record' : '&gt; new record'}
            </span>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ ...EMPTY_PROJECT });
                setShowForm(false);
              }}
              className="crt-btn !text-xs !py-1 !px-2"
            >
              <X size={12} /> CLOSE
            </button>
          </div>

          <Field label="TITLE">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="crt-input"
              required
            />
          </Field>

          <Field label="DESCRIPTION">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="crt-input resize-none"
              required
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="DOMAIN">
              <select
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value as Domain })}
                className="crt-input"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {DOMAIN_LABELS[d]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="SUBCATEGORIES (select any)">
              <div className="flex flex-wrap gap-2">
                {subcats
                  .filter((s) => s.domain === form.domain)
                  .map((s) => {
                    const on = form.subcategory_ids.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSubcat(s.id)}
                        className={`crt-chip ${on ? 'crt-chip-active' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {on ? '[ ' : '  '}
                        {s.name}
                        {on ? ' ]' : '  '}
                      </button>
                    );
                  })}
                {subcats.filter((s) => s.domain === form.domain).length === 0 && (
                  <span className="font-mono text-xs text-crt-text-dim">— none defined —</span>
                )}
              </div>
            </Field>
          </div>

          <Field label="TECH STACK (comma separated)">
            <input
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
              className="crt-input"
              placeholder="TypeScript, React, ..."
            />
          </Field>

          <Field label="IMAGES">
            <ImageUploader
              images={form.images}
              onChange={(images) => setForm({ ...form, images })}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="GITHUB URL">
              <input
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="crt-input"
              />
            </Field>
            <Field label="DEMO URL">
              <input
                value={form.demo_url}
                onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
                className="crt-input"
              />
            </Field>
          </div>

          <button type="submit" className="crt-btn crt-btn-solid w-full">
            <Save size={14} /> SAVE
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------- Subcategories ---------- */

function SubcategoriesAdmin() {
  const [items, setItems] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState<Domain>('cybersecurity');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('subcategories')
      .select('*')
      .order('domain, name');
    setItems((data as Subcategory[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await supabase.from('subcategories').insert({ name, domain });
    setName('');
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category? Projects using it will be unlinked.')) return;
    await supabase.from('subcategories').delete().eq('id', id);
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={add} className="crt-box flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <Field label="NAME">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="crt-input"
            placeholder="e.g. Attack"
            required
          />
        </Field>
        <Field label="DOMAIN">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value as Domain)}
            className="crt-input"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {DOMAIN_LABELS[d]}
              </option>
            ))}
          </select>
        </Field>
        <button type="submit" className="crt-btn crt-btn-solid">
          <Plus size={14} /> ADD
        </button>
      </form>

      <div className="crt-box-dim p-4">
        <div className="mb-3 font-mono text-xs text-crt-text-dim">&gt; subcategories.db</div>
        <div className="flex flex-col gap-2">
          {items.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2"
            >
              <div className="font-mono text-sm text-crt-text">
                <span className="text-crt-accent">{s.name}</span>{' '}
                <span className="text-crt-text-dim">/ {s.domain}</span>
              </div>
              <button onClick={() => remove(s.id)} className="crt-btn !text-xs !py-1 !px-2">
                <Trash2 size={12} /> DEL
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="font-mono text-xs text-crt-text-dim">&gt; no records</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Resumes ---------- */

function ResumesAdmin() {
  const [items, setItems] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<Domain>('dev');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('resumes').select('*').order('domain');
    setItems((data as Resume[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;
    await supabase.from('resumes').insert({ domain, title, file_url: fileUrl });
    setTitle('');
    setFileUrl('');
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this resume?')) return;
    await supabase.from('resumes').delete().eq('id', id);
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={add} className="crt-box flex flex-col gap-3 p-4">
        <div className="font-mono text-xs text-crt-accent">&gt; new resume</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="DOMAIN">
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as Domain)}
              className="crt-input"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {DOMAIN_LABELS[d]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="TITLE">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="crt-input"
              required
            />
          </Field>
          <Field label="PDF FILE">
            <PdfUploader url={fileUrl} onChange={setFileUrl} />
          </Field>
        </div>
        <button type="submit" className="crt-btn crt-btn-solid">
          <Plus size={14} /> ADD
        </button>
      </form>

      <div className="crt-box-dim p-4">
        <div className="mb-3 font-mono text-xs text-crt-text-dim">&gt; resumes.db</div>
        <div className="flex flex-col gap-2">
          {items.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2"
            >
              <div className="min-w-0">
                <div className="font-pixel text-lg text-crt-accent truncate">{r.title}</div>
                <div className="font-mono text-xs text-crt-text-dim truncate">
                  {r.domain} · {r.file_url}
                </div>
              </div>
              <button onClick={() => remove(r.id)} className="crt-btn !text-xs !py-1 !px-2">
                <Trash2 size={12} /> DEL
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="font-mono text-xs text-crt-text-dim">&gt; no records</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-xs text-crt-accent">{label}:</span>
      {children}
    </label>
  );
}
