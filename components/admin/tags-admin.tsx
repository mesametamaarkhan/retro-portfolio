'use client';
import { useEffect, useState } from 'react';
import { supabase, Subcategory } from '@/lib/supabase';
import { Field } from './field';
import { Plus, Trash2 } from 'lucide-react';

export default function TagsAdmin() {
  const [items, setItems] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('subcategories').select('*').order('name');
    setItems((data as Subcategory[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await supabase.from('subcategories').insert({ name, domain: 'all' });
    setName('');
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this tag?')) return;
    await supabase.from('subcategories').delete().eq('id', id);
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={add} className="crt-box flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <Field label="NAME">
          <input value={name} onChange={e => setName(e.target.value)} className="crt-input" placeholder="e.g. Next.js" required />
        </Field>
        <button type="submit" className="crt-btn crt-btn-solid"><Plus size={14} /> ADD</button>
      </form>
      <div className="crt-box-dim p-4">
        <div className="mb-3 font-mono text-xs text-crt-text-dim">&gt; tags.db</div>
        <div className="flex flex-col gap-2">
          {items.map(s => (
            <div key={s.id} className="flex items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2">
              <div className="font-mono text-sm text-crt-text"><span className="text-crt-accent">{s.name}</span></div>
              <button onClick={() => remove(s.id)} className="crt-btn !text-xs !py-1 !px-2"><Trash2 size={12} /> DEL</button>
            </div>
          ))}
          {items.length === 0 && <div className="font-mono text-xs text-crt-text-dim">&gt; no records</div>}
        </div>
      </div>
    </div>
  );
}
