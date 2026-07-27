/*
# Project images array + storage buckets

1. Schema
- Add `images text[]` to projects (default '{}'), keeping image_url for backward compat.
- Migrate existing image_url (non-null) into images[0].

2. Storage
- Create public buckets `project-images` and `resumes` if missing.
- Grant anon + authenticated full CRUD on objects in both buckets via storage policies.
*/

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

-- Backfill: push existing single image_url into the images array.
UPDATE projects
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM unnest(images) AS u WHERE u = image_url);

-- Storage buckets (public read).
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Policies: allow anon + authenticated full CRUD on objects in both buckets.
DROP POLICY IF EXISTS "anon_all_project_images" ON storage.objects;
CREATE POLICY "anon_all_project_images" ON storage.objects
  FOR ALL TO anon, authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "anon_all_resumes_bucket" ON storage.objects;
CREATE POLICY "anon_all_resumes_bucket" ON storage.objects
  FOR ALL TO anon, authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');
