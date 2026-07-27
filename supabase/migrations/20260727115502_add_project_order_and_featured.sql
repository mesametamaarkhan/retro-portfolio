/*
# Add manual ordering + featured flag to projects

1. Schema
- `order integer` defaults to 0; backfill per-domain with current created_at ordering
  so existing projects keep a sensible starting order.
- `featured boolean` default false (optional flag; frontend sorts featured first but
  respects manual order within each group).

2. Index for efficient per-domain ordering.
*/

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Backfill order per domain based on current created_at ascending (oldest first).
WITH ranked AS (
  SELECT id, domain,
    ROW_NUMBER() OVER (PARTITION BY domain ORDER BY created_at ASC) AS rn
  FROM projects
)
UPDATE projects p
SET "order" = r.rn
FROM ranked r
WHERE p.id = r.id;

CREATE INDEX IF NOT EXISTS projects_domain_order_idx
  ON projects (domain, "order");
