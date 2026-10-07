'use client';
import { useEffect, useState } from 'react';
import { supabase, Certification } from '@/lib/supabase';
import { Field } from './field';
import { Plus, Trash2, Pencil, X, Save, GripVertical } from 'lucide-react';
import { ImageUploader } from '@/components/image-uploader';

const EMPTY = { name: '', issuer: '', issued_date: '', expiry_date: '', credential_url: '', badge_url: '' };

export default function CertificationsAdmin() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
    setItems((data as Certification[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startNew = () => { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); };
  const startEdit = (c: Certification) => { setEditing(c); setForm({ name: c.name, issuer: c.issuer, issued_date: c.issued_date, expiry_date: c.expiry_date || '', credential_url: c.credential_url || '', badge_url: c.badge_url || '' }); setShowForm(true); };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      expiry_date: form.expiry_date || null,
      credential_url: form.credential_url || null,
      badge_url: form.badge_url || null
    };
    if (editing) {
      await supabase.from('certifications').update(payload).eq('id', editing.id);
    } else {
      const sort_order = items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
      await supabase.from('certifications').insert({ ...payload, sort_order });
    }
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    await supabase.from('certifications').delete().eq('id', id);
    await load();
  };

  const reorder = async (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx], b = items[swapIdx];
    await Promise.all([
      supabase.from('certifications').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('certifications').update({ sort_order: a.sort_order }).eq('id', b.id)
    ]);
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="crt-box-dim p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-crt-text-dim">&gt; certs.db</span>
          <button onClick={startNew} className="crt-btn crt-btn-solid !text-xs !py-1.5"><Plus size={14} /> NEW</button>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <div key={it.id} className="flex flex-wrap items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical size={14} className="text-crt-text-dim shrink-0" />
                <span className="font-mono text-xs text-crt-text-dim shrink-0">#{it.sort_order}</span>
                <div className="min-w-0">
                  <div className="font-pixel text-lg text-crt-accent truncate">{it.name}</div>
                  <div className="font-mono text-xs text-crt-text-dim truncate">{it.issuer}</div>
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
            <Field label="NAME"><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="crt-input" required /></Field>
            <Field label="ISSUER"><input value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} className="crt-input" required /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ISSUED DATE (YYYY-MM)"><input value={form.issued_date} onChange={e => setForm({...form, issued_date: e.target.value})} className="crt-input" required /></Field>
            <Field label="EXPIRY DATE (YYYY-MM or empty)"><input value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} className="crt-input" /></Field>
          </div>
          <Field label="CREDENTIAL URL"><input value={form.credential_url} onChange={e => setForm({...form, credential_url: e.target.value})} className="crt-input" /></Field>
          <Field label="BADGE IMAGE">
            <ImageUploader images={form.badge_url ? [form.badge_url] : []} onChange={imgs => setForm({...form, badge_url: imgs[0] || ''})} />
          </Field>
          <button type="submit" className="crt-btn crt-btn-solid w-full"><Save size={14} /> SAVE</button>
        </form>
      )}
    </div>
  );
}
