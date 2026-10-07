/*
 * Migration: Single-profile security-focused portfolio restructure
 *
 * Changes:
 * 1. Creates `profile` table (single-row) for hero/about data.
 * 2. Creates `experiences` table for work timeline.
 * 3. Creates `certifications` table.
 * 4. Creates `skills` table (group + name).
 * 5. Leaves projects.domain and subcategories.domain columns intact (no destructive drops)
 *    but the app will stop using them — all projects render in one flat list.
 * 6. Seeds placeholder data for profile, experiences, certifications, skills.
 * 7. Flags former blockchain projects with a comment column.
 *
 * NOTE: Old migrations are NOT edited. This is purely additive.
 */

-- ============================================================
-- 1. Profile (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_url text,
  location text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  github_url text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profile" ON profile;
CREATE POLICY "anon_select_profile" ON profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile" ON profile;
CREATE POLICY "anon_insert_profile" ON profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile" ON profile;
CREATE POLICY "anon_update_profile" ON profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profile" ON profile;
CREATE POLICY "anon_delete_profile" ON profile FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 2. Experiences
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text,  -- null = present
  location text NOT NULL DEFAULT '',
  bullets text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_experiences" ON experiences;
CREATE POLICY "anon_select_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_experiences" ON experiences;
CREATE POLICY "anon_insert_experiences" ON experiences FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_experiences" ON experiences;
CREATE POLICY "anon_update_experiences" ON experiences FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_experiences" ON experiences;
CREATE POLICY "anon_delete_experiences" ON experiences FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 3. Certifications
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  issuer text NOT NULL DEFAULT '',
  issued_date text NOT NULL DEFAULT '',
  expiry_date text,
  credential_url text,
  badge_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_certifications" ON certifications;
CREATE POLICY "anon_select_certifications" ON certifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_certifications" ON certifications;
CREATE POLICY "anon_insert_certifications" ON certifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_certifications" ON certifications;
CREATE POLICY "anon_update_certifications" ON certifications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_certifications" ON certifications;
CREATE POLICY "anon_delete_certifications" ON certifications FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 4. Skills
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_skills" ON skills;
CREATE POLICY "anon_select_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_skills" ON skills;
CREATE POLICY "anon_insert_skills" ON skills FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_skills" ON skills;
CREATE POLICY "anon_update_skills" ON skills FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_skills" ON skills;
CREATE POLICY "anon_delete_skills" ON skills FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 5. Re-normalise project ordering across all domains into one list
-- ============================================================
-- Recompute order sequentially across all projects (old domain boundaries don't matter)
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (ORDER BY domain, "order", created_at) AS rn
  FROM projects
)
UPDATE projects p
SET "order" = r.rn
FROM ranked r
WHERE p.id = r.id;

-- ============================================================
-- 6. Flag former blockchain projects for review
--    (Adding a migration_note column; purely informational)
-- ============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS migration_note text;

UPDATE projects SET migration_note = 'REVIEW: formerly blockchain domain'
WHERE domain = 'blockchain';

-- ============================================================
-- 7. Seed profile placeholder
-- ============================================================
INSERT INTO profile (name, title, tagline, bio, location, email, github_url, linkedin_url, resume_url)
VALUES (
  'Mesam E Tamaar Khan',
  'Security Engineer / Analyst',
  'Building secure systems. Breaking insecure ones.',
  'Security-focused engineer with experience across offensive and defensive security, secure software development, and cloud infrastructure. I build tools that make systems harder to break and easier to trust.',
  'LOCATION_PLACEHOLDER',
  'mesamtamaark@gmail.com',
  'https://github.com/mesametamaarkhan',
  'https://linkedin.com/in/mesam-tamaar-khan',
  NULL
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. Seed placeholder experiences
-- ============================================================
INSERT INTO experiences (company, role, start_date, end_date, location, bullets, sort_order)
VALUES
  ('COMPANY_PLACEHOLDER', 'Security Engineer', '2025-01', NULL, 'LOCATION_PLACEHOLDER',
   ARRAY['Led vulnerability assessments and penetration testing engagements', 'Developed automated security scanning pipelines', 'Implemented incident response procedures'],
   1),
  ('COMPANY_PLACEHOLDER', 'Software Developer', '2024-01', '2024-12', 'LOCATION_PLACEHOLDER',
   ARRAY['Built full-stack web applications with security-first architecture', 'Integrated SAST/DAST tools into CI/CD pipelines', 'Conducted code reviews focused on secure coding practices'],
   2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. Seed placeholder certifications
-- ============================================================
INSERT INTO certifications (name, issuer, issued_date, expiry_date, credential_url, sort_order)
VALUES
  ('CERT_NAME_PLACEHOLDER', 'ISSUER_PLACEHOLDER', '2025-01', NULL, NULL, 1),
  ('CERT_NAME_PLACEHOLDER_2', 'ISSUER_PLACEHOLDER', '2024-06', '2027-06', NULL, 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. Seed placeholder skills
-- ============================================================
INSERT INTO skills (group_name, name, sort_order) VALUES
  ('Offensive', 'Penetration Testing', 1),
  ('Offensive', 'Vulnerability Assessment', 2),
  ('Offensive', 'Social Engineering', 3),
  ('Offensive', 'Exploit Development', 4),
  ('Defensive', 'Incident Response', 5),
  ('Defensive', 'SIEM / Log Analysis', 6),
  ('Defensive', 'Threat Hunting', 7),
  ('Defensive', 'Malware Analysis', 8),
  ('Cloud & Infra', 'AWS Security', 9),
  ('Cloud & Infra', 'Docker / K8s', 10),
  ('Cloud & Infra', 'Network Security', 11),
  ('Cloud & Infra', 'IAM / Zero Trust', 12),
  ('Dev & Tools', 'Python', 13),
  ('Dev & Tools', 'TypeScript', 14),
  ('Dev & Tools', 'Go', 15),
  ('Dev & Tools', 'Bash / Shell', 16),
  ('Dev & Tools', 'Burp Suite', 17),
  ('Dev & Tools', 'Wireshark', 18),
  ('Dev & Tools', 'Metasploit', 19),
  ('Dev & Tools', 'Nmap', 20)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. Add some cross-domain subcategories (tags) if they don't exist
-- ============================================================
INSERT INTO subcategories (name, domain) VALUES
  ('Security', 'all'),
  ('Web', 'all'),
  ('Tooling', 'all'),
  ('Research', 'all')
ON CONFLICT DO NOTHING;
