-- ============================================================
-- MELTX MICHEAL — PORTFOLIO DATABASE
-- Run this ENTIRE script once in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- 1. PROFILE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name              TEXT NOT NULL DEFAULT '',
  title             TEXT NOT NULL DEFAULT '',
  tagline           TEXT DEFAULT '',
  about             TEXT DEFAULT '',
  email             TEXT DEFAULT '',
  phone             TEXT DEFAULT '',
  location          TEXT DEFAULT '',
  avatar_url        TEXT DEFAULT '',
  logo_url          TEXT DEFAULT '',
  contact_image_url TEXT DEFAULT '',
  resume_url        TEXT DEFAULT '',
  status_badge      TEXT DEFAULT '',
  github_url        TEXT DEFAULT '',
  linkedin_url      TEXT DEFAULT '',
  twitter_url       TEXT DEFAULT '',
  whatsapp          TEXT DEFAULT '',
  website_url       TEXT DEFAULT '',
  years_experience  INTEGER DEFAULT 0,
  projects_count    INTEGER DEFAULT 0,
  clients_count     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Seed your profile (edit the values below with your real info)
INSERT INTO profile (
  id, name, title, tagline, about,
  email, phone, location,
  avatar_url, resume_url, status_badge,
  github_url, linkedin_url, twitter_url, whatsapp, website_url,
  years_experience, projects_count, clients_count
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Meltx Micheal',
  'Full Stack Developer & AI Engineer',
  'Building premium cinematic web experiences and intelligent systems.',
  'I am a passionate AI/ML engineering student focused on building intelligent systems and modern web applications. I love exploring the intersection of data science and full-stack development, and I am actively seeking internship opportunities.',
  'michealjohnsonraj16@gmail.com',
  '',
  'Tamil Nadu, India',
  'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1778765549/20260514_185944_bwzrqw.png',
  '',
  'Fresher / AI-ML Student',
  'https://github.com/Meltxmicheal',
  'https://www.linkedin.com/in/meltxmicheal',
  '',
  '',
  '',
  0,
  0,
  0
) ON CONFLICT (id) DO UPDATE SET
  name              = EXCLUDED.name,
  title             = EXCLUDED.title,
  tagline           = EXCLUDED.tagline,
  about             = EXCLUDED.about,
  email             = EXCLUDED.email,
  location          = EXCLUDED.location,
  avatar_url        = EXCLUDED.avatar_url,
  status_badge      = EXCLUDED.status_badge,
  github_url        = EXCLUDED.github_url,
  linkedin_url      = EXCLUDED.linkedin_url,
  updated_at        = NOW();


-- ============================================================
-- 2. SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'Extra Skills',
  proficiency  INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  is_featured  BOOLEAN DEFAULT false,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Clear old skills and insert fresh data
TRUNCATE skills;

INSERT INTO skills (name, category, proficiency, is_featured, sort_order) VALUES
  -- Frontend
  ('HTML',           'Frontend',     90, true,  1),
  ('CSS',            'Frontend',     90, true,  2),
  ('JavaScript',     'Frontend',     85, true,  3),
  ('React.js',       'Frontend',     80, true,  4),
  ('Next.js',        'Frontend',     75, true,  5),
  ('Tailwind CSS',   'Frontend',     85, false, 6),

  -- Backend
  ('Node.js',        'Backend',      75, true,  7),
  ('Express.js',     'Backend',      75, true,  8),
  ('Python',         'Backend',      80, true,  9),
  ('REST API',       'Backend',      80, false, 10),

  -- AI/ML
  ('Machine Learning','AI/ML',       75, true,  11),
  ('TensorFlow',     'AI/ML',        65, false, 12),
  ('Scikit-learn',   'AI/ML',        70, false, 13),
  ('NLP',            'AI/ML',        65, false, 14),

  -- Database
  ('SQL',            'Database',     80, true,  15),
  ('PostgreSQL',     'Database',     75, true,  16),
  ('Supabase',       'Database',     75, false, 17),
  ('MySQL',          'Database',     70, false, 18),

  -- Tools
  ('Git',            'Tools',        85, true,  19),
  ('GitHub',         'Tools',        85, true,  20),
  ('VS Code',        'Tools',        90, false, 21),
  ('Postman',        'Tools',        80, false, 22),
  ('Cloudinary',     'Tools',        70, false, 23),

  -- Extra Skills
  ('TypeScript',     'Extra Skills', 65, false, 24),
  ('Framer Motion',  'Extra Skills', 65, false, 25),
  ('Docker',         'Extra Skills', 50, false, 26);


-- ============================================================
-- 3. EDUCATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree      TEXT NOT NULL,
  field       TEXT NOT NULL DEFAULT '',
  start_year  INTEGER NOT NULL,
  end_year    INTEGER,
  is_current  BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  gpa         TEXT DEFAULT '',
  logo_url    TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

TRUNCATE education;

INSERT INTO education (institution, degree, field, start_year, end_year, is_current, gpa, description, sort_order) VALUES
  (
    'Arunai Engineering College',
    'B.E CSE (AI & ML)',
    'Artificial Intelligence and Machine Learning',
    2023, 2026, true,
    '8.5 CGPA (Current)',
    'Bachelor of Engineering in Computer Science specializing in Artificial Intelligence and Machine Learning.',
    0
  ),
  (
    'Government Higher Secondary School',
    '12th Standard',
    'Science Stream (Biology / Computer Science)',
    2021, 2022, false,
    '92%',
    '',
    1
  ),
  (
    'Government Higher Secondary School',
    '10th Standard',
    'General Education',
    2019, 2020, false,
    '95%',
    '',
    2
  );


-- ============================================================
-- 4. EXPERIENCE TABLE
-- ============================================================
-- This table drives: Hero badge, About floating card, Journey Profile card
-- is_current = true  → green glow + "Active for Hires"
-- is_current = false → gray badge, no glow
CREATE TABLE IF NOT EXISTS experience (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company     TEXT NOT NULL,
  role        TEXT NOT NULL,
  description TEXT DEFAULT '',
  start_date  DATE NOT NULL,
  end_date    DATE,
  is_current  BOOLEAN DEFAULT false,
  technologies TEXT[] DEFAULT '{}',
  company_url TEXT DEFAULT '',
  logo_url    TEXT DEFAULT '',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

TRUNCATE experience;

-- SET is_current = true  to show green glowing "Active for Hires" badge
-- SET is_current = false to hide the green badge (gray / inactive)
INSERT INTO experience (company, role, description, start_date, is_current, technologies, sort_order) VALUES
  (
    'Available for Opportunities',
    'Fresher / AI-ML Student',
    'Passionate AI/ML and Full Stack developer focused on building modern web applications, intelligent systems, and real-world projects while continuously learning new technologies.',
    '2023-01-01',
    true,   -- ← Change to false to hide "Active for Hires" badge
    ARRAY['Open to Internships', 'Open to Freelance', 'Open to Collaborations'],
    0
  );


-- ============================================================
-- 5. PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  short_description TEXT DEFAULT '',
  description       TEXT DEFAULT '',
  cover_image       TEXT DEFAULT '',
  images            TEXT[] DEFAULT '{}',
  technologies      TEXT[] DEFAULT '{}',
  github_url        TEXT DEFAULT '',
  live_url          TEXT DEFAULT '',
  features          TEXT[] DEFAULT '{}',
  category          TEXT DEFAULT 'web',
  status            TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
  is_featured       BOOLEAN DEFAULT false,
  sort_order        INTEGER DEFAULT 0,
  views             INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Add your real projects below (leave empty if you want to add via Admin)
-- Example structure (uncomment and fill in):
-- INSERT INTO projects (title, slug, short_description, description, technologies, github_url, live_url, is_featured, features, category, sort_order) VALUES
-- (
--   'My Project Name',
--   'my-project-name',
--   'Short one-line description',
--   'Detailed description of the project.',
--   ARRAY['Next.js', 'Python', 'Supabase'],
--   'https://github.com/Meltxmicheal/my-project',
--   'https://my-project.vercel.app',
--   true,
--   ARRAY['Feature 1', 'Feature 2', 'Feature 3'],
--   'web',
--   1
-- );


-- ============================================================
-- 6. FEATURED PROJECT TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS featured_project (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT DEFAULT '',
  image        TEXT DEFAULT '',
  github_link  TEXT DEFAULT '',
  live_link    TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Leave empty; manage via Admin Panel → Featured Project


-- ============================================================
-- 7. CERTIFICATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title          TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     DATE NOT NULL,
  expiry_date    DATE,
  credential_url TEXT DEFAULT '',
  image_url      TEXT DEFAULT '',
  description    TEXT DEFAULT '',
  sort_order     INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Add your certificates below (or via Admin Panel)
-- INSERT INTO certificates (title, issuer, issue_date, credential_url, description, sort_order) VALUES
-- ('Certificate Name', 'Issuer Name', '2024-01-01', 'https://credential.url', 'Description', 0);


-- ============================================================
-- 8. CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT DEFAULT '',
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 9. SOCIAL LINKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS social_links (
  id        UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  github    TEXT DEFAULT '',
  linkedin  TEXT DEFAULT '',
  email     TEXT DEFAULT '',
  whatsapp  TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default social links (edit with your real links)
INSERT INTO social_links (github, linkedin, email, whatsapp) VALUES
  (
    'https://github.com/Meltxmicheal',
    'https://www.linkedin.com/in/meltxmicheal',
    'michealjohnsonraj16@gmail.com',
    ''
  );


-- ============================================================
-- 10. MEDIA ASSETS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS media_assets (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url    TEXT NOT NULL DEFAULT '',
  section_name TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE education        ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links     ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets     ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Public read profile"          ON profile;
DROP POLICY IF EXISTS "Public read skills"           ON skills;
DROP POLICY IF EXISTS "Public read education"        ON education;
DROP POLICY IF EXISTS "Public read experience"       ON experience;
DROP POLICY IF EXISTS "Public read projects"         ON projects;
DROP POLICY IF EXISTS "Public read featured_project" ON featured_project;
DROP POLICY IF EXISTS "Public read certificates"     ON certificates;
DROP POLICY IF EXISTS "Public insert messages"       ON contact_messages;
DROP POLICY IF EXISTS "Public read social_links"     ON social_links;
DROP POLICY IF EXISTS "Public read media_assets"     ON media_assets;

-- Public read access (portfolio visitors)
CREATE POLICY "Public read profile"          ON profile          FOR SELECT USING (true);
CREATE POLICY "Public read skills"           ON skills           FOR SELECT USING (true);
CREATE POLICY "Public read education"        ON education        FOR SELECT USING (true);
CREATE POLICY "Public read experience"       ON experience       FOR SELECT USING (true);
CREATE POLICY "Public read projects"         ON projects         FOR SELECT USING (true);
CREATE POLICY "Public read featured_project" ON featured_project FOR SELECT USING (true);
CREATE POLICY "Public read certificates"     ON certificates     FOR SELECT USING (true);
CREATE POLICY "Public insert messages"       ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read social_links"     ON social_links     FOR SELECT USING (true);
CREATE POLICY "Public read media_assets"     ON media_assets     FOR SELECT USING (true);

-- ============================================================
-- DONE — Your portfolio database is ready.
-- ============================================================
