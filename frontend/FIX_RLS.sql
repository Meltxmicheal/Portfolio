-- ============================================================
-- RLS FIX — Run this in Supabase SQL Editor
-- This allows the backend (which connects via DATABASE_URL)
-- to read AND write all tables without being blocked by RLS.
-- ============================================================

-- The backend connects as the "postgres" superuser role via
-- the direct connection string, which bypasses RLS anyway.
-- But if you're using pgBouncer/pooler, RLS can still block.
-- Safest fix: DISABLE RLS on backend-writable tables.

-- OPTION A — DISABLE RLS on all tables (simplest, safe for a personal portfolio)
ALTER TABLE profile          DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills           DISABLE ROW LEVEL SECURITY;
ALTER TABLE education        DISABLE ROW LEVEL SECURITY;
ALTER TABLE experience       DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects         DISABLE ROW LEVEL SECURITY;
ALTER TABLE featured_project DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates     DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE social_links     DISABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets     DISABLE ROW LEVEL SECURITY;

-- That's it. All reads and writes from the backend will now work.
