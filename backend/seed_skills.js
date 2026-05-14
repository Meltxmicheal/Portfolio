require('dotenv').config();
const pool = require('./config/db');

const skillsToAdd = [
  'Python', 'AI', 'Machine Learning', 'React.js', 'Node.js', 'TypeScript', 
  'JavaScript', 'HTML', 'CSS', 'SQL', 'Supabase', 'PostgreSQL', 
  'GitHub', 'MS Word', 'Editing', 'Figma', 'AI Tools'
];

async function seedSkills() {
  try {
    console.log('Seeding skills...');
    for (const skill of skillsToAdd) {
      // Check if exists
      const { rows } = await pool.query('SELECT id FROM skills WHERE skill_name = $1', [skill]);
      if (rows.length === 0) {
        await pool.query(
          'INSERT INTO skills (skill_name, category, proficiency, is_featured) VALUES ($1, $2, $3, $4)',
          [skill, 'other', 100, false]
        );
        console.log(`Added: ${skill}`);
      } else {
        console.log(`Exists: ${skill}`);
      }
    }
    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedSkills();
