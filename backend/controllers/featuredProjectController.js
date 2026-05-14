const pool = require('../config/db');

const getFeaturedProject = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM featured_project LIMIT 1');
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFeaturedProject = async (req, res) => {
  const { title, description, image, github_link, live_link, technologies } = req.body;
  try {
    const { rows: existing } = await pool.query('SELECT id FROM featured_project LIMIT 1');
    
    if (existing.length === 0) {
      const { rows } = await pool.query(
        `INSERT INTO featured_project (title, description, image, github_link, live_link, technologies)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, description, image, github_link, live_link, technologies]
      );
      return res.json(rows[0]);
    } else {
      const { rows } = await pool.query(
        `UPDATE featured_project SET 
          title = $1, description = $2, image = $3, github_link = $4, live_link = $5, technologies = $6
         WHERE id = $7 RETURNING *`,
        [title, description, image, github_link, live_link, technologies, existing[0].id]
      );
      return res.json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFeaturedProject, updateFeaturedProject };
