const pool = require('../config/db');

const getStats = async (req, res) => {
  try {
    const [
      { rows: [{ count: projects }] },
      { rows: [{ count: skills }] }
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM projects'),
      pool.query('SELECT COUNT(*) FROM skills')
    ]);

    res.json({
      projects: parseInt(projects),
      skills: parseInt(skills)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats };
