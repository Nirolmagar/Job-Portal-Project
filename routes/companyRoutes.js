const express = require('express');
const router = express.Router();
const { addJob, updateJob, deleteJob, getCompanyJobs } = require('../controllers/jobController');
const { shortlistApplication, rejectApplication, scheduleInterview, getCompanyApplications } = require('../controllers/applicationController');
const authenticateUser = require('../middleware/authMiddleware');
const { logoutUser } = require('../controllers/authController');

const menuItems = [
    { name: 'Dashboard', link: '/company/dashboard' },
    { name: 'Job Management', link: '/company/jobs' },
    { name: 'Your Jobs', link: '/company/your-jobs' },
    { name: 'Application Management', link: '/company/applications' }
];

// Company routes
router.post('/jobs/add', authenticateUser, addJob);
router.post('/jobs/update/:id', authenticateUser, updateJob);
router.post('/jobs/delete/:id', authenticateUser, deleteJob);

// Application management routes
router.post('/applications/shortlist/:id', authenticateUser, shortlistApplication);
router.post('/applications/reject/:id', authenticateUser, rejectApplication);
router.post('/applications/schedule/:id', authenticateUser, scheduleInterview);

router.get('/logout', logoutUser);

router.get('/dashboard', authenticateUser, async (req, res) => {
    try {
        console.log('Company Dashboard route hit');
        
        // Adjust the data if needed for the dashboard
        const dashboardData = []; // Placeholder for actual dashboard data
        
        res.render('dashboard', {
            title: 'Company Dashboard',
            menuItems,
            section: 'yourJobs', // Default section
            userType: req.user.role,
            data: dashboardData
        });
    } catch (error) {
        console.error('Error rendering dashboard page:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});

router.get('/jobs', authenticateUser, async (req, res) => {
    try {
        console.log('Job Management route hit');
        
        // Fetch job data
        const jobs = await getCompanyJobs(req.user.id); // Ensure getCompanyJobs is properly set to return a promise
        
        res.render('dashboard', {
            title: 'Job Management',
            menuItems,
            section: 'jobManagement', // This should match the partial filename
            userType: req.user.role,
            data: jobs
        });
    } catch (error) {
        console.error('Error rendering job management page:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});

router.get('/your-jobs', authenticateUser, async (req, res) => {
    try {
        console.log('Your Jobs route hit');
        
        // Fetch your jobs data
        const yourJobs = await getCompanyJobs(req.user.id); // Pass companyId to getCompanyJobs
        
        console.log('Your Jobs:', yourJobs);

        res.render('dashboard', {
            title: 'Your Jobs',
            menuItems,
            section: 'yourJobs', // This should match the partial filename
            userType: req.user.role,
            data: yourJobs
        });
    } catch (error) {
        console.error('Error rendering your jobs page:', error);
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    }
});

router.get('/applications', authenticateUser, async (req, res) => {
    try {
        console.log('Application Management route hit');
        const applications = await getCompanyApplications(req.user.id);

        return res.render('dashboard', {
            title: 'Application Management',
            menuItems,
            section: 'applicationManage',
            userType: req.user.role,
            data: applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        if (!res.headersSent) {
            return res.status(500).send('Internal Server Error');
        }
    }
});


module.exports = router;
