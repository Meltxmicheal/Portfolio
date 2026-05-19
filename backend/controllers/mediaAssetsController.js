const pool = require('../config/db');

const getMediaAssets = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM media_assets');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMediaAsset = async (req, res) => {
  const { image_url, section_name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO media_assets (image_url, section_name) VALUES ($1, $2) RETURNING *',
      [image_url, section_name]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMediaAsset = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM media_assets WHERE id = $1', [id]);
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMediaAsset = async (req, res) => {
  const { id } = req.params;
  const { image_url, section_name } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE media_assets SET image_url = $1, section_name = $2 WHERE id = $3 RETURNING *',
      [image_url, section_name, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMediaAssets, createMediaAsset, deleteMediaAsset, updateMediaAsset };
