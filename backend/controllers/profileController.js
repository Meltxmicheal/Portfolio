const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM profile LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { 
    id, name, title, tagline, about, email, phone, location, 
    avatar_url, logo_url, contact_image_url, resume_url,
    status_badge, github_url, linkedin_url, twitter_url, whatsapp, website_url,
    years_experience, projects_count, clients_count,
    opportunity_status, career_stage, availability, experience_tags
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE profile SET 
        name = $1, title = $2, tagline = $3, about = $4, email = $5, 
        phone = $6, location = $7, avatar_url = $8, logo_url = $9, 
        contact_image_url = $10, resume_url = $11, status_badge = $12, 
        github_url = $13, linkedin_url = $14, twitter_url = $15, 
        whatsapp = $16, website_url = $17, years_experience = $18, 
        projects_count = $19, clients_count = $20, 
        opportunity_status = $21, career_stage = $22, availability = $23, 
        experience_tags = $24, updated_at = NOW()
       WHERE id = $25
       RETURNING *`,
      [
        name, title, tagline, about, email, 
        phone, location, avatar_url, logo_url, 
        contact_image_url, resume_url, status_badge, 
        github_url, linkedin_url, twitter_url, 
        whatsapp, website_url, years_experience, 
        projects_count, clients_count,
        opportunity_status, career_stage, availability, experience_tags,
        id
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
