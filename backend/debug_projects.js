require('dotenv').config();
const pool = require('./config/db');

async function debug() {
  try {
    // 1. Check column names
    const cols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `);
    console.log('\n=== DATABASE COLUMNS ===');
    cols.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

    // 2. Check actual data
    const projects = await pool.query('SELECT id, title, slug, thumbnail_image, gallery_images FROM projects LIMIT 5');
    console.log('\n=== PROJECT DATA ===');
    projects.rows.forEach(p => {
      console.log(`\n  Project: ${p.title} (${p.slug})`);
      console.log(`  thumbnail_image: ${p.thumbnail_image || 'NULL'}`);
      console.log(`  gallery_images type: ${typeof p.gallery_images}`);
      console.log(`  gallery_images value: ${JSON.stringify(p.gallery_images)}`);
      console.log(`  gallery_images isArray: ${Array.isArray(p.gallery_images)}`);
      if (Array.isArray(p.gallery_images)) {
        console.log(`  gallery_images length: ${p.gallery_images.length}`);
        console.log(`  gallery_images non-empty: ${p.gallery_images.filter(Boolean).length}`);
      }
    });

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err.message);
    process.exit(1);
  }
}

debug();
