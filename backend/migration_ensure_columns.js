require('dotenv').config();
const pool = require('./config/db');

async function runMigration() {
  try {
    console.log('Ensuring columns exist...');
    
    // Add columns if they don't exist
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='thumbnail_image') THEN
          ALTER TABLE projects ADD COLUMN thumbnail_image TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='gallery_images') THEN
          ALTER TABLE projects ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
        END IF;

        -- Ensure github_url and live_url exist (renamed from link if necessary)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='github_link') THEN
          ALTER TABLE projects RENAME COLUMN github_link TO github_url;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='live_link') THEN
          ALTER TABLE projects RENAME COLUMN live_link TO live_url;
        END IF;
      END $$;
    `);
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
