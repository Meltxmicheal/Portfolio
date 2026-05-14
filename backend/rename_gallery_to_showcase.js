require('dotenv').config();
const pool = require('./config/db');

async function renameColumn() {
  try {
    console.log('Renaming gallery_images to showcase_images...');
    
    // Check if gallery_images exists and showcase_images doesn't
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'gallery_images'
    `);
    
    if (res.rows.length > 0) {
      await pool.query('ALTER TABLE projects RENAME COLUMN gallery_images TO showcase_images');
      console.log('Renamed successfully.');
    } else {
      console.log('Column gallery_images not found or already renamed.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Rename failed:', err);
    process.exit(1);
  }
}

renameColumn();
