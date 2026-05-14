require('dotenv').config();
const pool = require('./config/db');

async function checkSkillsTable() {
  try {
    const { rows } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'skills'
    `);
    console.log('Columns in skills table:');
    rows.forEach(r => console.log(`- ${r.column_name}`));
    
    const { rows: skillRows } = await pool.query('SELECT * FROM skills LIMIT 1');
    console.log('Sample skill row:', skillRows[0]);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSkillsTable();
