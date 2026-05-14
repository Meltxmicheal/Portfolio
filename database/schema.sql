-- 1. admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. profile
CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  profile_image TEXT,
  resume_link TEXT,
  contact_image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. projects (includes featured flag)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  short_description TEXT,
  image TEXT,
  github_link TEXT,
  live_link TEXT,
  technologies TEXT[],
  is_featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'completed',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. skills
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  skill_name VARCHAR(255) NOT NULL,
  icon TEXT,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false
);

-- 5. social_links
CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  github TEXT,
  linkedin TEXT,
  email TEXT,
  whatsapp TEXT
);

-- 6. education
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. experience
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial profile and social links if not exists
INSERT INTO profile (name, role, bio) 
SELECT 'Alex Chen', 'Full Stack Developer', 'I build immersive digital experiences.'
WHERE NOT EXISTS (SELECT 1 FROM profile);

INSERT INTO social_links (github, linkedin, email)
SELECT '#', '#', 'hello@example.com'
WHERE NOT EXISTS (SELECT 1 FROM social_links);
