const pool = require('../config/db');

const getProjects = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProject = async (req, res) => {
  const { 
    title, slug, short_description, description,
    cover_image, images,
    technologies, github_url, live_url, category, status, 
    is_featured, features, sort_order 
  } = req.body;
  
  try {
    const { rows } = await pool.query(
      `INSERT INTO projects (
        title, slug, short_description, description, 
        cover_image, images,
        technologies, github_url, live_url, category, status, 
        is_featured, features, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        title, slug, short_description, description, 
        cover_image, images || [],
        technologies || [], github_url, live_url, category || 'web', status || 'completed', 
        is_featured || false, features || [], sort_order || 0
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { 
    title, slug, short_description, description, 
    cover_image, images,
    technologies, github_url, live_url, category, status, 
    is_featured, features, sort_order 
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE projects SET 
        title = $1, slug = $2, short_description = $3, description = $4, 
        cover_image = $5, images = $6,
        technologies = $7, github_url = $8, live_url = $9, category = $10, status = $11, 
        is_featured = $12, features = $13, sort_order = $14, updated_at = NOW()
       WHERE id = $15 RETURNING *`,
      [
        title, slug, short_description, description, 
        cover_image, images || [],
        technologies || [], github_url, live_url, category, status, 
        is_featured, features, sort_order, id
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
