const pool = require('../config/db');

const getStats = async () => {
    try {
        // Adjust the queries to match your database schema
        const [activeUsers] = await pool.query('SELECT COUNT(*) AS count FROM users'); // Assuming all users are active
        const [jobPostings] = await pool.query('SELECT COUNT(*) AS count FROM jobs WHERE status = "active"');
        const [applications] = await pool.query('SELECT COUNT(*) AS count FROM applications');

        return {
            activeUsers: activeUsers[0].count,
            jobPostings: jobPostings[0].count,
            applications: applications[0].count
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
};

module.exports = {
    getStats
};
