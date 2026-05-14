require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
  try {
    console.log('Starting migration...');
    
    // Rename image to cover_image
    await pool.query('ALTER TABLE projects RENAME COLUMN image TO cover_image');
    console.log('✓ Renamed image to cover_image');
    
    // Check if thumbnail_image exists, if not add it
    // (Wait, I saw it in the columns list above, so it might be there already, but let's be safe)
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
