const express = require('express');
const router = express.Router();
const { updateJobSeekerProfile } = require('../controllers/profileManageController');
const authenticateUser = require('../middleware/authMiddleware');
const upload = require('../utils/multer'); // Corrected path to multer

// POST /profile/jobseeker: Allow job seekers to update their information
router.post('/jobseeker', authenticateUser, upload.single('cv'), updateJobSeekerProfile);

module.exports = router;
