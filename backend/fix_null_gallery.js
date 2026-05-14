require('dotenv').config();
const pool = require('./config/db');

async function fixNulls() {
  try {
    console.log('Fixing NULL gallery_images...');
    await pool.query("UPDATE projects SET gallery_images = '{}' WHERE gallery_images IS NULL");
    console.log('Fixed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Fix failed:', err);
    process.exit(1);
  }
}

fixNulls();
