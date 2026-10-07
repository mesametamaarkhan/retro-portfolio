'use client';

import { useEffect, useState } from 'react';
import { supabase, Project, Subcategory } from '@/lib/supabase';
import { Field } from './field';
import { ImageUploader } from '@/components/image-uploader';
import { Plus, Trash2, Pencil, X, Save, GripVertical } from 'lucide-react';

const EMPTY_PROJECT = {
  title: '',
  description: '',
  tech_stack: '',
  github_url: '',
  demo_url: '',
  subcategory_ids: [] as string[],
  images: [] as string[],
  featured: false,
};

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
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    await Promise.all(
      next.map((p, i) => supabase.from('projects').update({ order: i + 1 }).eq('id', p.id)),
    );
    setDragIdx(null);
    setOverIdx(null);
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
                <div className="font-pixel text-lg text-crt-accent truncate">{p.title} {p.featured && <span className="text-crt-amber text-xs ml-2">[FEATURED]</span>}</div>
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
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onReorder(p.id, 'down'); }}
                className="crt-btn !text-xs !py-1 !px-1.5"
                disabled={i === items.length - 1}
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

export default function ProjectsAdmin() {
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
      supabase.from('projects').select('*').order('order', { ascending: true }),
      supabase.from('subcategories').select('*').order('name'),
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
      tech_stack: p.tech_stack.join(', '),
      github_url: p.github_url || '',
      demo_url: p.demo_url || '',
      subcategory_ids: p.subcategory_ids || [],
      images: p.images || [],
      featured: p.featured || false,
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
      order = items.length ? Math.max(...items.map((p) => p.order)) + 1 : 1;
    }
    const payload = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      github_url: form.github_url || null,
      demo_url: form.demo_url || null,
      images: form.images,
      featured: form.featured,
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
    const idx = items.findIndex((p) => p.id === projectId);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx];
    const b = items[swapIdx];
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
          <ProjectList
            items={items}
            onEdit={startEdit}
            onRemove={remove}
            onReorder={reorder}
          />
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
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-crt-accent" />
            <span className="font-mono text-xs text-crt-accent">FEATURED</span>
          </label>

          <Field label="DESCRIPTION">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="crt-input resize-none"
              required
            />
          </Field>

          <Field label="SUBCATEGORIES (select any)">
            <div className="flex flex-wrap gap-2">
              {subcats
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
              {subcats.length === 0 && (
                <span className="font-mono text-xs text-crt-text-dim">— none defined —</span>
              )}
            </div>
          </Field>

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
