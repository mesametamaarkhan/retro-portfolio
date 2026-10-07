'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Field } from './field';
import { PdfUploader } from '@/components/image-uploader';
import { Save } from 'lucide-react';

export default function ResumeAdmin() {
  const [id, setId] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('profile').select('id, resume_url').limit(1).single();
    if (data) {
      setId(data.id);
      setUrl(data.resume_url || '');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await supabase.from('profile').update({ resume_url: url }).eq('id', id);
    } else {
      await supabase.from('profile').insert({ resume_url: url });
    }
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={save} className="crt-box flex flex-col gap-3 p-4">
        <div className="font-mono text-xs text-crt-accent">&gt; edit resume</div>
        <Field label="RESUME PDF">
          <PdfUploader url={url} onChange={setUrl} />
        </Field>
        <button type="submit" className="crt-btn crt-btn-solid w-full"><Save size={14} /> SAVE</button>
      </form>
    </div>
  );
}
