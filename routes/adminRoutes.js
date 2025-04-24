const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, deleteJob, getJobs } = require('../controllers/adminController'); 
const { getStats } = require('../controllers/statsController');
const { logoutUser } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const menuItems = [
    { name: 'Dashboard', link: '/admin/dashboard' },
    { name: 'User Management', link: '/admin/users' },
    { name: 'Job Postings', link: '/admin/jobs' },
    { name: 'Statistics', link: '/admin/stats' }
];

// Route: Admin Dashboard
router.get('/dashboard', authenticate, async (req, res) => {
    try {
        console.log('Dashboard route hit');
        
        // Adjust the data if needed for the dashboard
        const dashboardData = []; // Placeholder for actual dashboard data
        
        res.render('dashboard', {
            title: 'Admin Dashboard',
            menuItems,
            section: 'allJobs', // This should match the partial filename
            userType: req.user.role,
            data: dashboardData
        });
    } catch (error) {
        console.error('Error rendering dashboard page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route: User Management
router.get('/users', authenticate, async (req, res) => {
    try {
        console.log('User Management route hit');
        
        // Fetch user data
        const users = await getUsers(); // Ensure getUsers is properly set to return a promise
        
        res.render('dashboard', {
            title: 'User Management',
            menuItems,
            section: 'userManagement', // This should match the partial filename
            userType: req.user.role,
            data: users
        });
    } catch (error) {
        console.error('Error rendering user management page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route: Delete User
router.delete('/users/:id', authenticate, deleteUser);

// Route: Job Postings
router.get('/jobs', authenticate, async (req, res) => {
    try {
        console.log('Job Postings route hit');
        
        // Fetch job data
        const jobs = await getJobs(); // Ensure getJobs is properly set to return a promise
        
        res.render('dashboard', {
            title: 'Job Postings Oversight',
            menuItems,
            section: 'allJobs', // This should match the partial filename
            userType: req.user.role,
            data: jobs
        });
    } catch (error) {
        console.error('Error rendering job postings page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route: Delete Job
router.delete('/jobs/:id', authenticate, deleteJob);

// Route: Statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        console.log('Statistics route hit');
        
        // Fetch stats data
        const stats = await getStats(); // Properly await the stats data
        
        res.render('dashboard', {
            title: 'Platform Statistics',
            menuItems,
            section: 'stats', // This should match the partial filename
            userType: req.user.role,
            data: stats
        });
    } catch (error) {
        console.error('Error rendering stats page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route: Logout
router.get('/logout', logoutUser);

module.exports = router;
