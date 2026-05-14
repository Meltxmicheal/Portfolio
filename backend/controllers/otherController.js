const pool = require('../config/db');

// Skills
const getSkills = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM skills ORDER BY category');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSkill = async (req, res) => {
  const { name, category, proficiency, is_featured } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO skills (skill_name, category, proficiency, is_featured) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, proficiency, is_featured || false]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Social Links
const getSocialLinks = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM social_links LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSocialLinks = async (req, res) => {
  const { github, linkedin, email, whatsapp } = req.body;
  try {
    // Update the first row (assuming only one exists as per common portfolio pattern)
    const { rows } = await pool.query(
      `UPDATE social_links SET github = $1, linkedin = $2, email = $3, whatsapp = $4 
       WHERE id = (SELECT id FROM social_links LIMIT 1) 
       RETURNING *`,
      [github, linkedin, email, whatsapp]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSkills, createSkill, deleteSkill, getSocialLinks, updateSocialLinks };
