/*
# Create portfolio schema (retro CRT variant)

1. New Tables
- `subcategories`: admin-editable categories scoped to a domain (dev, cybersecurity, blockchain).
  - id (uuid PK), name (text), domain (text), created_at
- `projects`: portfolio projects. Each belongs to a domain and optionally a subcategory.
  - id (uuid PK), title, description, domain, tech_stack (text[]), image_url, github_url, demo_url, subcategory_id (FK -> subcategories nullable), created_at
- `resumes`: one per domain, with a downloadable file URL.
  - id (uuid PK), domain, title, file_url, created_at

2. Security
- Single-tenant app; no Supabase sign-in screen. Admin is a simple frontend password gate.
- RLS enabled on all tables. anon + authenticated allowed full CRUD (data is intentionally public/shared for a personal portfolio).

3. Seed
- Subcategories for cybersecurity (Attack, Defense, Other) and blockchain (DeFi, NFT, Infrastructure).
- Sample projects across all three domains.
- Sample resumes for each domain.
*/

CREATE TABLE IF NOT EXISTS subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_subcategories" ON subcategories;
CREATE POLICY "anon_select_subcategories" ON subcategories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_subcategories" ON subcategories;
CREATE POLICY "anon_insert_subcategories" ON subcategories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_subcategories" ON subcategories;
CREATE POLICY "anon_update_subcategories" ON subcategories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_subcategories" ON subcategories;
CREATE POLICY "anon_delete_subcategories" ON subcategories FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  domain text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  image_url text,
  github_url text,
  demo_url text,
  subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_resumes" ON resumes;
CREATE POLICY "anon_select_resumes" ON resumes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_resumes" ON resumes;
CREATE POLICY "anon_insert_resumes" ON resumes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_resumes" ON resumes;
CREATE POLICY "anon_update_resumes" ON resumes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_resumes" ON resumes;
CREATE POLICY "anon_delete_resumes" ON resumes FOR DELETE
  TO anon, authenticated USING (true);

-- Seed subcategories
INSERT INTO subcategories (name, domain) VALUES
  ('Attack', 'cybersecurity'),
  ('Defense', 'cybersecurity'),
  ('Other', 'cybersecurity'),
  ('DeFi', 'blockchain'),
  ('NFT', 'blockchain'),
  ('Infrastructure', 'blockchain')
ON CONFLICT DO NOTHING;

-- Seed projects
INSERT INTO projects (title, description, domain, tech_stack, image_url, github_url, demo_url, subcategory_id) VALUES
  ('Neon Compiler', 'A toy compiler that turns a small Lisp-like language into x86 assembly, with a REPL and step-by-step codegen traces.', 'dev', ARRAY['TypeScript','V8','Node.js'], 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg', 'https://github.com/example/neon-compiler', 'https://example.com/neon', NULL),
  ('Pixel Canvas', 'A collaborative pixel-art editor with realtime cursors, undo history, and exportable animated GIFs.', 'dev', ARRAY['React','Canvas','WebRTC'], 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', 'https://github.com/example/pixel-canvas', 'https://example.com/pixel', NULL),
  ('Rust CLI Toolbox', 'A set of fast command-line utilities for file hashing, batch renaming, and directory diffing.', 'dev', ARRAY['Rust','Cargo'], 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg', 'https://github.com/example/rust-cli', '', NULL),
  ('Go Task Queue', 'A distributed job queue with retries, priorities, and a tiny web dashboard for inspecting worker health.', 'dev', ARRAY['Go','Redis','Docker'], 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', 'https://github.com/example/go-task-queue', 'https://example.com/taskq', NULL),
  ('RedPloit', 'A modular penetration-testing framework with plugin scripts for common CVEs and a report generator.', 'cybersecurity', ARRAY['Python','Scapy','Nmap'], 'https://images.pexels.com/photos/60504/security-protection-antivirus-software-60504.jpeg', 'https://github.com/example/redploit', '', (SELECT id FROM subcategories WHERE name='Attack' AND domain='cybersecurity' LIMIT 1)),
  ('PhishNet Detector', 'A browser extension that flags phishing pages using URL heuristics and a community blocklist.', 'cybersecurity', ARRAY['TypeScript','WebExtension'], 'https://images.pexels.com/photos/270700/pexels-photo-270700.jpeg', 'https://github.com/example/phishnet', 'https://example.com/phishnet', (SELECT id FROM subcategories WHERE name='Defense' AND domain='cybersecurity' LIMIT 1)),
  ('HoneyPot Farm', 'A honeypot orchestration tool that deploys fake services and logs attacker behavior for research.', 'cybersecurity', ARRAY['Python','Docker','Elasticsearch'], 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg', 'https://github.com/example/honeypot-farm', '', (SELECT id FROM subcategories WHERE name='Defense' AND domain='cybersecurity' LIMIT 1)),
  ('CTF Writeups', 'A collection of writeups and solver scripts for capture-the-flag competitions.', 'cybersecurity', ARRAY['Python','Bash'], 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg', 'https://github.com/example/ctf-writeups', '', (SELECT id FROM subcategories WHERE name='Other' AND domain='cybersecurity' LIMIT 1)),
  ('ChainSwap', 'A decentralized exchange router that finds the best swap path across multiple AMMs with slippage protection.', 'blockchain', ARRAY['Solidity','TypeScript','Ethers.js'], 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg', 'https://github.com/example/chainswap', 'https://example.com/chainswap', (SELECT id FROM subcategories WHERE name='DeFi' AND domain='blockchain' LIMIT 1)),
  ('MintGate', 'An NFT minting portal with allowlists, dutch-auction pricing, and metadata pinning to IPFS.', 'blockchain', ARRAY['Solidity','Next.js','IPFS'], 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg', 'https://github.com/example/mintgate', 'https://example.com/mintgate', (SELECT id FROM subcategories WHERE name='NFT' AND domain='blockchain' LIMIT 1)),
  ('NodeWatch', 'A monitoring dashboard for validator nodes with uptime alerts and reward tracking.', 'blockchain', ARRAY['Go','Grafana','Prometheus'], 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', 'https://github.com/example/nodewatch', 'https://example.com/nodewatch', (SELECT id FROM subcategories WHERE name='Infrastructure' AND domain='blockchain' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Seed resumes
INSERT INTO resumes (domain, title, file_url) VALUES
  ('dev', 'Software Development Resume', 'https://example.com/resume-dev.pdf'),
  ('cybersecurity', 'Cybersecurity Resume', 'https://example.com/resume-cyber.pdf'),
  ('blockchain', 'Blockchain Resume', 'https://example.com/resume-blockchain.pdf')
ON CONFLICT DO NOTHING;
