'use client';

import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud, X, FileText } from 'lucide-react';

const IMG_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMG = 5 * 1024 * 1024; // 5MB
const PDF_TYPE = 'application/pdf';
const MAX_PDF = 5 * 1024 * 1024;

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (files: FileList | File[]) => {
    setError('');
    const arr = Array.from(files);
    for (const file of arr) {
      if (!IMG_TYPES.includes(file.type)) {
        setError(`${file.name}: only jpg, png, webp allowed`);
        continue;
      }
      if (file.size > MAX_IMG) {
        setError(`${file.name}: exceeds 5MB limit`);
        continue;
      }
      setProgress(0);
      const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { data, error: upErr } = await supabase.storage
        .from('project-images')
        .upload(path, file, {
          upsert: false,
          cacheControl: '3600',
        });
      setProgress(null);
      if (upErr || !data) {
        setError(upErr?.message || 'upload failed');
        continue;
      }
      const { data: pub } = supabase.storage.from('project-images').getPublicUrl(path);
      if (pub?.publicUrl) onChange([...images, pub.publicUrl]);
    }
  }, [images, onChange]);

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed p-5 transition-colors ${
          dragOver ? 'border-crt-accent bg-crt-accent/10' : 'border-crt-border-dim bg-crt-bg-soft'
        }`}
        style={{ borderRadius: 0 }}
      >
        <UploadCloud size={22} className="text-crt-accent" />
        <span className="font-mono text-xs text-crt-text-dim">
          drag &amp; drop or click · jpg/png/webp · max 5MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) upload(e.target.files); e.target.value = ''; }}
        />
      </div>

      {progress !== null && (
        <div className="w-full border-2 border-crt-border-dim bg-crt-bg-soft">
          <div
            className="h-2 bg-crt-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="font-mono text-xs text-crt-amber">&gt; ERR: {error}</div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url, i) => (
            <div key={url + i} className="group relative border-2 border-crt-border-dim" style={{ borderRadius: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`upload ${i + 1}`}
                className="h-20 w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="absolute right-0 top-0 bg-crt-bg-soft/90 p-0.5 text-crt-amber hover:text-crt-red"
                aria-label="remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PdfUploaderProps {
  url: string;
  onChange: (url: string) => void;
}

export function PdfUploader({ url, onChange }: PdfUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(async (files: FileList | File[]) => {
    setError('');
    const file = Array.from(files)[0];
    if (!file) return;
    if (file.type !== PDF_TYPE) {
      setError('only .pdf files allowed');
      return;
    }
    if (file.size > MAX_PDF) {
      setError('file exceeds 5MB limit');
      return;
    }
    setProgress(0);
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: upErr } = await supabase.storage
      .from('resumes')
      .upload(path, file, { upsert: false, cacheControl: '3600' });
    setProgress(null);
    if (upErr) {
      setError(upErr.message);
      return;
    }
    const { data: pub } = supabase.storage.from('resumes').getPublicUrl(path);
    if (pub?.publicUrl) onChange(pub.publicUrl);
  }, [onChange]);

  const clear = () => onChange('');

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed p-5 transition-colors ${
          dragOver ? 'border-crt-accent bg-crt-accent/10' : 'border-crt-border-dim bg-crt-bg-soft'
        }`}
        style={{ borderRadius: 0 }}
      >
        <FileText size={22} className="text-crt-accent" />
        <span className="font-mono text-xs text-crt-text-dim">
          drag &amp; drop or click · pdf only · max 5MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) upload(e.target.files); e.target.value = ''; }}
        />
      </div>

      {progress !== null && (
        <div className="w-full border-2 border-crt-border-dim bg-crt-bg-soft">
          <div className="h-2 bg-crt-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && (
        <div className="font-mono text-xs text-crt-amber">&gt; ERR: {error}</div>
      )}

      {url && (
        <div className="flex items-center justify-between gap-2 border-2 border-crt-border-dim bg-crt-bg-soft px-3 py-2">
          <span className="truncate font-mono text-xs text-crt-text">{url.split('/').pop()}</span>
          <button type="button" onClick={clear} className="crt-btn !text-xs !py-1 !px-2">
            <X size={12} /> CLEAR
          </button>
        </div>
      )}
    </div>
  );
}
