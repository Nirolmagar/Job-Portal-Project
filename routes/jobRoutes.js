const express = require('express');
const router = express.Router();
const { getJobs, applyForJob, addJob, updateJob, deleteJob, getCompanyJobs } = require('../controllers/jobController');
const pool = require('../config/db');
const authenticateUser = require('../middleware/authMiddleware');

// GET /jobs: Fetch all job listings with optional location filter
router.get('/', getJobs);

// POST /jobs: Add a new job
router.post('/', authenticateUser, addJob);

// PUT /jobs/:id: Update an existing job
router.put('/:id', authenticateUser, updateJob);

// DELETE /jobs/:id: Delete a job
router.delete('/:id', authenticateUser, deleteJob);

// POST /apply: Apply for a job
router.post('/apply', authenticateUser, applyForJob);

// GET /company/jobs: Fetch jobs added by the logged-in company user
router.get('/company/jobs', authenticateUser, getCompanyJobs);

router.get('/app', authenticateUser, async (req, res) => {
    try {
        const user = req.user;
        const [jobs] = await pool.query('SELECT * FROM jobs');
        res.render('jobApp', { user, jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
