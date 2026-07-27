import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Avoid crashing the build when env is missing; surface at runtime instead.
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Domain = 'dev' | 'cybersecurity' | 'blockchain';

export interface Subcategory {
  id: string;
  name: string;
  domain: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  tech_stack: string[];
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  subcategory_id: string | null;
  images: string[];
  order: number;
  featured: boolean;
  created_at?: string;
  subcategory_ids?: string[];
}

export interface ProjectSubcategory {
  id: string;
  project_id: string;
  subcategory_id: string;
  created_at?: string;
}

export interface Resume {
  id: string;
  domain: string;
  title: string;
  file_url: string;
  created_at?: string;
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  dev: 'DEVELOPMENT',
  cybersecurity: 'CYBERSECURITY',
  blockchain: 'BLOCKCHAIN',
};
