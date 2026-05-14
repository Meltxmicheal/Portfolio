const pool = require('../config/db');

const getCertificates = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM certificates ORDER BY sort_order ASC, issue_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCertificate = async (req, res) => {
  const { title, issuer, issue_date, expiry_date, credential_url, image_url, description, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO certificates (title, issuer, issue_date, expiry_date, credential_url, image_url, description, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, issuer, issue_date, expiry_date, credential_url, image_url, description, sort_order || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { title, issuer, issue_date, expiry_date, credential_url, image_url, description, sort_order } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE certificates SET 
        title = $1, issuer = $2, issue_date = $3, expiry_date = $4, 
        credential_url = $5, image_url = $6, description = $7, sort_order = $8 
       WHERE id = $9 RETURNING *`,
      [title, issuer, issue_date, expiry_date, credential_url, image_url, description, sort_order, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM certificates WHERE id = $1', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCertificates, createCertificate, updateCertificate, deleteCertificate };
