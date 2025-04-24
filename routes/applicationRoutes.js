const express = require('express');
const router = express.Router();
const { applyForJob, getApplications, shortlistApplication, rejectApplication, scheduleInterview, getCompanyApplications, updateApplicationStatus } = require('../controllers/applicationController');
const authenticate = require('../middleware/authMiddleware');

// POST /applications: Job seekers can apply for a job
router.post('/applications', authenticate, applyForJob);

// GET /applications: Fetch applications for a specific user or job
router.get('/applications', authenticate, getApplications);

// POST /applications/:id/shortlist: Shortlist an application
router.post('/applications/:id/shortlist', authenticate, shortlistApplication);

// POST /applications/:id/reject: Reject an application
router.post('/applications/:id/reject', authenticate, rejectApplication);

// POST /applications/:id/schedule: Schedule an interview for an application
router.post('/applications/:id/schedule', authenticate, scheduleInterview);

// GET /company/applications: Fetch applications for a specific company
router.get('/applications', authenticate, getCompanyApplications);

// PUT /company/applications/:id/status: Update the status of an application
router.put('/company/applications/:id/status', authenticate, updateApplicationStatus);

module.exports = router;