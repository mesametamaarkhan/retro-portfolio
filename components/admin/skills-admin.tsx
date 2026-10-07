'use client';
import { useEffect, useState } from 'react';
import { supabase, Skill } from '@/lib/supabase';
import { Field } from './field';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';

export default function SkillsAdmin() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ group_name: '', name: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    setItems((data as Skill[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const sort_order = items.length ? Math.max(...items.map(i => i.sort_order)) + 1 : 1;
    await supabase.from('skills').insert({ ...form, sort_order });
    setForm({ ...form, name: '' }); // keep group_name
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await supabase.from('skills').delete().eq('id', id);
    await load();
  };

  const reorder = async (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx], b = items[swapIdx];
    await Promise.all([
      supabase.from('skills').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('skills').update({ sort_order: a.sort_order }).eq('id', b.id)
    ]);
    await load();
  };

  const groups = Array.from(new Set(items.map(i => i.group_name)));

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={add} className="crt-box flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <Field label="GROUP NAME">
          <input value={form.group_name} onChange={e => setForm({...form, group_name: e.target.value})} className="crt-input" list="skill-groups" required />
          <datalist id="skill-groups">
            {groups.map(g => <option key={g} value={g} />)}
          </datalist>
        </Field>
        <Field label="NAME">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="crt-input" required />
        </Field>
        <button type="submit" className="crt-btn crt-btn-solid"><Plus size={14} /> ADD</button>
      </form>

      <div className="crt-box-dim p-4">
        <div className="mb-3 font-mono text-xs text-crt-text-dim">&gt; skills.db</div>
        <div className="flex flex-col gap-4">
          {groups.map(g => {
            const groupItems = items.filter(i => i.group_name === g);
            return (
              <div key={g} className="flex flex-col gap-2">
                <div className="font-mono text-xs text-crt-text-dim">&gt; {g}</div>
                {groupItems.map(it => {
                  const globalIdx = items.findIndex(i => i.id === it.id);
                  return (
                    <div key={it.id} className="flex items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <GripVertical size={14} className="text-crt-text-dim shrink-0" />
                        <span className="font-mono text-xs text-crt-text-dim shrink-0">#{it.sort_order}</span>
                        <span className="font-mono text-sm text-crt-text truncate">{it.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => reorder(it.id, 'up')} disabled={globalIdx === 0} className="crt-btn !text-xs !py-1 !px-1.5">↑</button>
                        <button onClick={() => reorder(it.id, 'down')} disabled={globalIdx === items.length - 1} className="crt-btn !text-xs !py-1 !px-1.5">↓</button>
                        <button onClick={() => remove(it.id)} className="crt-btn !text-xs !py-1 !px-2"><Trash2 size={12} /> DEL</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {items.length === 0 && <div className="font-mono text-xs text-crt-text-dim">&gt; no records</div>}
        </div>
      </div>
    </div>
  );
}
