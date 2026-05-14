const pool = require('../config/db');

// Education
const getEducation = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM education ORDER BY sort_order ASC, start_year DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEducation = async (req, res) => {
  const { institution, degree, field, start_year, end_year, is_current, description, gpa, logo_url, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO education (institution, degree, field, start_year, end_year, is_current, description, gpa, logo_url, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [institution, degree, field, start_year, end_year, is_current, description, gpa, logo_url, sort_order || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEducation = async (req, res) => {
  const { id } = req.params;
  const { institution, degree, field, start_year, end_year, is_current, description, gpa, logo_url, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE education SET 
        institution = $1, degree = $2, field = $3, start_year = $4, end_year = $5, 
        is_current = $6, description = $7, gpa = $8, logo_url = $9, sort_order = $10 
       WHERE id = $11 RETURNING *`,
      [institution, degree, field, start_year, end_year, is_current, description, gpa, logo_url, sort_order, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEducation = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM education WHERE id = $1', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Experience
const getExperience = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC, start_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createExperience = async (req, res) => {
  const { company, role, description, start_date, end_date, is_current, technologies, company_url, logo_url, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO experience (company, role, description, start_date, end_date, is_current, technologies, company_url, logo_url, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [company, role, description, start_date, end_date, is_current, technologies || [], company_url, logo_url, sort_order || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateExperience = async (req, res) => {
  const { id } = req.params;
  const { company, role, description, start_date, end_date, is_current, technologies, company_url, logo_url, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE experience SET 
        company = $1, role = $2, description = $3, start_date = $4, end_date = $5, 
        is_current = $6, technologies = $7, company_url = $8, logo_url = $9, sort_order = $10 
       WHERE id = $11 RETURNING *`,
      [company, role, description, start_date, end_date, is_current, technologies, company_url, logo_url, sort_order, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteExperience = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM experience WHERE id = $1', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getEducation, createEducation, updateEducation, deleteEducation,
  getExperience, createExperience, updateExperience, deleteExperience 
};
