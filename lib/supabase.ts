import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Optional supabase client - app runs in pure local static mode via lib/data.ts

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: { persistSession: true, autoRefreshToken: true },
  }
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Subcategory {
  id: string;
  name: string;
  domain?: string; // legacy column, not used in app
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  domain?: string; // legacy column, not used in app
  tech_stack: string[];
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  subcategory_id?: string | null;
  images: string[];
  order: number;
  featured: boolean;
  migration_note?: string | null;
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
  domain?: string; // legacy
  title: string;
  file_url: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  photo_url: string | null;
  location: string;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  resume_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  location: string;
  bullets: string[];
  sort_order: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;
  expiry_date: string | null;
  credential_url: string | null;
  badge_url: string | null;
  sort_order: number;
  created_at?: string;
}

export interface Skill {
  id: string;
  group_name: string;
  name: string;
  sort_order: number;
  created_at?: string;
}
