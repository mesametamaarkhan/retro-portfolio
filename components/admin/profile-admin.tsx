'use client';
import { useEffect, useState } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { Field } from './field';
import { ImageUploader, PdfUploader } from '@/components/image-uploader';
import { Save } from 'lucide-react';

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('profile').select('*').limit(1).single();
    if (data) {
      setProfile(data);
      setForm(data);
    }
    setLoading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      await supabase.from('profile').update(form).eq('id', profile.id);
    } else {
      await supabase.from('profile').insert(form);
    }
    await load();
  };

  if (loading) return <div className="font-pixel text-xl text-crt-text-dim blink">LOADING...</div>;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={save} className="crt-box flex flex-col gap-3 p-4">
        <div className="font-mono text-xs text-crt-accent">&gt; edit profile</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="NAME"><input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="crt-input" /></Field>
          <Field label="TITLE"><input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="crt-input" /></Field>
        </div>
        <Field label="TAGLINE"><input value={form.tagline || ''} onChange={e => setForm({...form, tagline: e.target.value})} className="crt-input" /></Field>
        <Field label="BIO"><textarea value={form.bio || ''} onChange={e => setForm({...form, bio: e.target.value})} className="crt-input resize-none" rows={4} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="LOCATION"><input value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} className="crt-input" /></Field>
          <Field label="EMAIL"><input value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} className="crt-input" /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="GITHUB URL"><input value={form.github_url || ''} onChange={e => setForm({...form, github_url: e.target.value})} className="crt-input" /></Field>
          <Field label="LINKEDIN URL"><input value={form.linkedin_url || ''} onChange={e => setForm({...form, linkedin_url: e.target.value})} className="crt-input" /></Field>
          <Field label="TWITTER URL"><input value={form.twitter_url || ''} onChange={e => setForm({...form, twitter_url: e.target.value})} className="crt-input" /></Field>
          <Field label="INSTAGRAM URL"><input value={form.instagram_url || ''} onChange={e => setForm({...form, instagram_url: e.target.value})} className="crt-input" /></Field>
        </div>
        <Field label="PHOTO">
          <ImageUploader images={form.photo_url ? [form.photo_url] : []} onChange={imgs => setForm({...form, photo_url: imgs[0] || null})} />
        </Field>
        <Field label="RESUME PDF">
          <PdfUploader url={form.resume_url || ''} onChange={url => setForm({...form, resume_url: url})} />
        </Field>
        <button type="submit" className="crt-btn crt-btn-solid w-full"><Save size={14} /> SAVE</button>
      </form>
    </div>
  );
}
