/*
# Projects to subcategories: many-to-many

1. New Tables
- `project_subcategories`: junction table linking a project to multiple subcategories.
  - id (uuid PK), project_id (FK -> projects ON DELETE CASCADE), subcategory_id (FK -> subcategories ON DELETE CASCADE), created_at
  - UNIQUE (project_id, subcategory_id) to prevent duplicate links.

2. Data Migration
- Copy each existing `projects.subcategory_id` (non-null) into a row in `project_subcategories`, so no existing assignments are lost.

3. Security
- RLS enabled on the junction table. anon + authenticated full CRUD (single-tenant public portfolio).

4. Notes
- The old `projects.subcategory_id` column is KEPT (not dropped) to avoid data loss. App code will stop using it and rely on the junction table instead. It can be dropped later once confirmed unused.
*/

CREATE TABLE IF NOT EXISTS project_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  subcategory_id uuid NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (project_id, subcategory_id)
);

ALTER TABLE project_subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_project_subcategories" ON project_subcategories;
CREATE POLICY "anon_select_project_subcategories" ON project_subcategories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_project_subcategories" ON project_subcategories;
CREATE POLICY "anon_insert_project_subcategories" ON project_subcategories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_project_subcategories" ON project_subcategories;
CREATE POLICY "anon_update_project_subcategories" ON project_subcategories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_project_subcategories" ON project_subcategories;
CREATE POLICY "anon_delete_project_subcategories" ON project_subcategories FOR DELETE
  TO anon, authenticated USING (true);

-- Migrate existing single subcategory_id assignments into the junction table.
INSERT INTO project_subcategories (project_id, subcategory_id)
SELECT id, subcategory_id
FROM projects
WHERE subcategory_id IS NOT NULL
ON CONFLICT (project_id, subcategory_id) DO NOTHING;
