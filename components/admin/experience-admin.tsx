'use client';
import { useEffect, useState } from 'react';
import { supabase, Experience } from '@/lib/supabase';
import { Field } from './field';
import { Plus, Trash2, Pencil, X, Save, GripVertical } from 'lucide-react';

const EMPTY = { company: '', role: '', start_date: '', end_date: '', location: '', bullets: [] as string[] };

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [showForm, setShowForm] = useState(false);
  const [bulletsStr, setBulletsStr] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
    setItems((data as Experience[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing(null); setForm({ ...EMPTY }); setBulletsStr(''); setShowForm(true); };
  const startEdit = (e: Experience) => { setEditing(e); setForm({ company: e.company, role: e.role, start_date: e.start_date, end_date: e.end_date || '', location: e.location || '', bullets: e.bullets }); setBulletsStr(e.bullets.join('\n')); setShowForm(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      end_date: form.end_date || null,
      bullets: bulletsStr.split('\n').map(s => s.trim()).filter(Boolean)
    };
    if (editing) {
      await supabase.from('experience').update(payload).eq('id', editing.id);
    } else {
      const sort_order = items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
      await supabase.from('experience').insert({ ...payload, sort_order });
    }
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await supabase.from('experience').delete().eq('id', id);
    await load();
  };

  const reorder = async (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx], b = items[swapIdx];
    await Promise.all([
      supabase.from('experience').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('experience').update({ sort_order: a.sort_order }).eq('id', b.id)
    ]);
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="crt-box-dim p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-crt-text-dim">&gt; experience.log</span>
          <button onClick={startNew} className="crt-btn crt-btn-solid !text-xs !py-1.5"><Plus size={14} /> NEW</button>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <div key={it.id} className="flex flex-wrap items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical size={14} className="text-crt-text-dim shrink-0" />
                <span className="font-mono text-xs text-crt-text-dim shrink-0">#{it.sort_order}</span>
                <div className="min-w-0">
                  <div className="font-pixel text-lg text-crt-accent truncate">{it.company}</div>
                  <div className="font-mono text-xs text-crt-text-dim truncate">{it.role} | {it.start_date} - {it.end_date || 'Present'}</div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => reorder(it.id, 'up')} disabled={i === 0} className="crt-btn !text-xs !py-1 !px-1.5">↑</button>
                <button onClick={() => reorder(it.id, 'down')} disabled={i === items.length - 1} className="crt-btn !text-xs !py-1 !px-1.5">↓</button>
                <button onClick={() => startEdit(it)} className="crt-btn !text-xs !py-1 !px-2"><Pencil size={12} /> EDIT</button>
                <button onClick={() => remove(it.id)} className="crt-btn !text-xs !py-1 !px-2"><Trash2 size={12} /> DEL</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="font-mono text-xs text-crt-text-dim">&gt; no records</div>}
        </div>
      </div>

      {showForm && (
        <form onSubmit={save} className="crt-box flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-crt-accent">{editing ? '&gt; edit record' : '&gt; new record'}</span>
            <button type="button" onClick={() => setShowForm(false)} className="crt-btn !text-xs !py-1 !px-2"><X size={12} /> CLOSE</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="COMPANY"><input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="crt-input" required /></Field>
            <Field label="ROLE"><input value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="crt-input" required /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="START DATE (YYYY-MM)"><input value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="crt-input" required /></Field>
            <Field label="END DATE (YYYY-MM or empty for Present)"><input value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="crt-input" /></Field>
          </div>
          <Field label="LOCATION"><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="crt-input" /></Field>
          <Field label="BULLETS (one per line)">
            <textarea value={bulletsStr} onChange={e => setBulletsStr(e.target.value)} rows={5} className="crt-input resize-none" />
          </Field>
          <button type="submit" className="crt-btn crt-btn-solid w-full"><Save size={14} /> SAVE</button>
        </form>
      )}
    </div>
  );
}
