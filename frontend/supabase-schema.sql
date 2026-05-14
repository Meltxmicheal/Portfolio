-- PORTFOLIO DATABASE SCHEMA
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  tagline TEXT DEFAULT 'Building digital experiences that matter',
  about TEXT DEFAULT 'I am a passionate developer...',
  email TEXT DEFAULT 'michealjohnsonraj16@email.com',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT 'Your City, Country',
  avatar_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  github_url TEXT DEFAULT 'https://github.com/Meltxmicheal',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/meltxmicheal',
  twitter_url TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  clients_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile
INSERT INTO profile (id, name, title, tagline, about)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Alex Chen',
  'Full Stack Developer & UI/UX Designer',
  'Crafting digital experiences that blur the line between art and technology',
  'I am a passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, Next.js, and Node.js, with a deep love for creating beautiful, performant user interfaces. When not coding, I contribute to open source and mentor aspiring developers.'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  icon_url TEXT DEFAULT '',
  proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default skills
INSERT INTO skills (name, category, proficiency, is_featured, sort_order) VALUES
  ('React', 'frontend', 95, true, 1),
  ('Next.js', 'frontend', 92, true, 2),
  ('TypeScript', 'frontend', 90, true, 3),
  ('Node.js', 'backend', 88, true, 4),
  ('PostgreSQL', 'backend', 82, true, 5),
  ('Tailwind CSS', 'frontend', 95, true, 6),
  ('Framer Motion', 'frontend', 85, false, 7),
  ('Python', 'backend', 78, false, 8),
  ('Docker', 'devops', 75, false, 9),
  ('AWS', 'devops', 70, false, 10),
  ('GraphQL', 'backend', 80, true, 11),
  ('Figma', 'design', 85, true, 12);

-- ============================================================
-- EDUCATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  is_current BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  gpa TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO education (institution, degree, field, start_year, end_year, description, sort_order) VALUES
  ('MIT', 'Bachelor of Science', 'Computer Science', 2016, 2020, 'Graduated with honors. Focus on algorithms and distributed systems.', 1),
  ('Stanford Online', 'Certificate', 'Machine Learning', 2021, 2022, 'Andrew Ng''s ML specialization.', 2);

-- ============================================================
-- EXPERIENCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  company_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO experience (company, role, start_date, is_current, description, technologies, sort_order) VALUES
  ('TechCorp Inc', 'Senior Full Stack Developer', '2022-01-01', true, 'Lead development of microservices architecture serving 2M+ users. Reduced load time by 60% through optimization.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'], 1),
  ('StartupXYZ', 'Frontend Developer', '2020-06-01', false, 'Built the entire frontend from scratch. Implemented real-time features using WebSockets.', ARRAY['React', 'TypeScript', 'Socket.io', 'GraphQL'], 2);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'web',
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO projects (title, slug, short_description, description, technologies, github_url, live_url, is_featured, features, category, sort_order) VALUES
  (
    'NeuraBoard - AI Dashboard',
    'neuraboard-ai-dashboard',
    'A real-time AI analytics dashboard with predictive insights',
    'NeuraBoard is a comprehensive AI-powered analytics platform that provides real-time insights, predictive modeling, and beautiful data visualizations. Built for enterprise teams who need to make data-driven decisions at scale.',
    ARRAY['Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis', 'D3.js'],
    'https://github.com/example/neuraboard',
    'https://neuraboard.demo.com',
    true,
    ARRAY['Real-time data streaming', 'AI-powered predictions', 'Interactive charts', 'Team collaboration', 'Export to PDF/CSV'],
    'ai',
    1
  ),
  (
    'Lumina - E-Commerce Platform',
    'lumina-ecommerce',
    'A luxury e-commerce platform with stunning animations',
    'Lumina redefines online shopping with cinematic product showcases, AI-powered recommendations, and a checkout flow that converts. Built for premium brands who refuse to compromise on aesthetics.',
    ARRAY['Next.js', 'Stripe', 'Supabase', 'Framer Motion', 'Tailwind CSS'],
    'https://github.com/example/lumina',
    'https://lumina.demo.com',
    true,
    ARRAY['3D product views', 'AI recommendations', 'One-click checkout', 'Inventory management', 'Analytics dashboard'],
    'web',
    2
  ),
  (
    'Velocity - Developer CLI Tool',
    'velocity-cli',
    'Supercharge your development workflow with AI assistance',
    'Velocity is a powerful CLI tool that integrates AI assistance directly into your terminal. Generate boilerplate, refactor code, write tests, and deploy — all from the command line.',
    ARRAY['Rust', 'OpenAI API', 'Node.js', 'SQLite'],
    'https://github.com/example/velocity',
    'https://velocity.dev',
    true,
    ARRAY['AI code generation', 'Smart refactoring', 'Auto-testing', 'One-command deploy', 'Plugin system'],
    'tool',
    3
  );

-- ============================================================
-- CERTIFICATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKETS (run via Supabase dashboard or API)
-- ============================================================
-- Create a bucket named 'portfolio' with public access for images
-- Supabase Dashboard > Storage > New Bucket > Name: "portfolio" > Public: true

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio data
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin all profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all education" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
