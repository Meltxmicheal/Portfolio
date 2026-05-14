require('dotenv').config();
const pool = require('./config/db');

async function checkCols() {
  try {
    const { rows } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects'
    `);
    console.log('Columns in projects table:');
    rows.forEach(r => console.log(`- ${r.column_name}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCols();
