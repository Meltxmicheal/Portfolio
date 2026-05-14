require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pool = require('../config/db');

async function updateSchema() {
  const schema = `
    CREATE TABLE IF NOT EXISTS featured_project (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      github_link TEXT,
      live_link TEXT,
      technologies TEXT[]
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id SERIAL PRIMARY KEY,
      github TEXT,
      linkedin TEXT,
      email TEXT,
      whatsapp TEXT
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      section_name TEXT
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await pool.query(schema);
    console.log('Schema updated successfully');

    // Initialize social links if not exists
    const { rows } = await pool.query('SELECT * FROM social_links LIMIT 1');
    if (rows.length === 0) {
      await pool.query('INSERT INTO social_links (github, linkedin, email, whatsapp) VALUES ($1, $2, $3, $4)', 
        ['https://github.com/Meltxmicheal', 'https://www.linkedin.com/in/meltxmicheal', 'michealjohnsonraj16@gmail.com', '']
      );
      console.log('Social links initialized');
    }

  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    process.exit(0);
  }
}

updateSchema();
