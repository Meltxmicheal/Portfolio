const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const projectController = require('../controllers/projectController');
const featuredProjectController = require('../controllers/featuredProjectController');
const mediaAssetsController = require('../controllers/mediaAssetsController');
const otherController = require('../controllers/otherController');
const statsController = require('../controllers/statsController');
const eduExpController = require('../controllers/eduExpController');
const certificatesController = require('../controllers/certificatesController');

// Auth
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getMe);

// Education & Experience
router.get('/education', eduExpController.getEducation);
router.post('/education', auth, eduExpController.createEducation);
router.put('/education/:id', auth, eduExpController.updateEducation);
router.delete('/education/:id', auth, eduExpController.deleteEducation);

router.get('/experience', eduExpController.getExperience);
router.post('/experience', auth, eduExpController.createExperience);
router.put('/experience/:id', auth, eduExpController.updateExperience);
router.delete('/experience/:id', auth, eduExpController.deleteExperience);

// Certificates
router.get('/certificates', certificatesController.getCertificates);
router.post('/certificates', auth, certificatesController.createCertificate);
router.put('/certificates/:id', auth, certificatesController.updateCertificate);
router.delete('/certificates/:id', auth, certificatesController.deleteCertificate);

// Stats
router.get('/stats', auth, statsController.getStats);

// Profile
router.get('/profile', profileController.getProfile);
router.put('/profile', auth, profileController.updateProfile);

// Featured Project
router.get('/featured-project', featuredProjectController.getFeaturedProject);
router.put('/featured-project', auth, featuredProjectController.updateFeaturedProject);

// Projects
router.get('/projects', projectController.getProjects);
router.post('/projects', auth, projectController.createProject);
router.put('/projects/:id', auth, projectController.updateProject);
router.delete('/projects/:id', auth, projectController.deleteProject);

// Skills
router.get('/skills', otherController.getSkills);
router.post('/skills', auth, otherController.createSkill);
router.put('/skills/:id', auth, otherController.updateSkill);
router.delete('/skills/:id', auth, otherController.deleteSkill);

// Social Links
router.get('/social-links', otherController.getSocialLinks);
router.put('/social-links', auth, otherController.updateSocialLinks);

// Media Assets
router.get('/media-assets', mediaAssetsController.getMediaAssets);
router.post('/media-assets', auth, mediaAssetsController.createMediaAsset);
router.put('/media-assets/:id', auth, mediaAssetsController.updateMediaAsset);
router.delete('/media-assets/:id', auth, mediaAssetsController.deleteMediaAsset);

// Image Upload
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});

module.exports = router;
