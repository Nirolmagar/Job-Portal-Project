const pool = require('../config/db');

// Job seekers can apply for a job
const applyForJob = async (req, res) => {
    const { job_id } = req.body;
    const job_seeker_id = req.user.id; // Get user ID from authenticated user
    try {
        const query = 'INSERT INTO applications (job_id, job_seeker_id, status) VALUES (?, ?, "pending")';
        await pool.execute(query, [job_id, job_seeker_id]);

        console.log('Application inserted:', { job_id, job_seeker_id }); // Debugging statement

        res.redirect('/jobs'); // Redirect to the jobs page after applying
    } catch (error) {
        console.error('Error applying for job:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server Error', error });
        }
    }
};

// Fetch applications for a specific user or job
const getApplications = async (req, res) => {
    const { job_seeker_id, job_id } = req.query;
    try {
        let query = `
            SELECT applications.*, jobs.title, jobs.description, jobs.location 
            FROM applications 
            JOIN jobs ON applications.job_id = jobs.id 
            WHERE 1=1
        `;
        const values = [];
        if (job_seeker_id) {
            query += ' AND applications.job_seeker_id = ?';
            values.push(job_seeker_id);
        }
        if (job_id) {
            query += ' AND applications.job_id = ?';
            values.push(job_id);
        }

        const [result] = await pool.execute(query, values);
        console.log('Fetched applications:', JSON.stringify(result, null, 2));

        if (!res.headersSent) {  // Ensure no duplicate response
            return res.status(200).json(result);
        }
    } catch (error) {
        console.error('Error fetching applications:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Server Error', error });
        }
    }
};


// Shortlist an application
const shortlistApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE applications SET status = "shortlisted" WHERE id = ?';
        await pool.execute(query, [id]);
        res.status(200).send({ message: 'Application shortlisted successfully' });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(error);
        }
    }
};

// Reject an application
const rejectApplication = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE applications SET status = "rejected" WHERE id = ?';
        await pool.execute(query, [id]);
        res.status(200).send({ message: 'Application rejected successfully' });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(error);
        }
    }
};

// Schedule an interview for an application
const scheduleInterview = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'UPDATE applications SET status = "interview_selected" WHERE id = ?';
        await pool.execute(query, [id]);
        res.status(200).send({ message: 'Interview scheduled successfully' });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(error);
        }
    }
};

const getCompanyApplications = async (companyId) => {
    try {
        const query = `
            SELECT 
                applications.id AS application_id,
                applications.status AS application_status,
                applications.applied_at,
                jobs.title AS job_title,
                jobs.description AS job_description,
                users.username AS applicant_name,
                users.email AS applicant_email,
                users.cv AS applicant_resume
            FROM applications
            JOIN jobs ON applications.job_id = jobs.id
            JOIN users ON applications.job_seeker_id = users.id
            WHERE jobs.company_id = ? AND users.role = 'jobSeeker'
        `;

        const [applications] = await pool.execute(query, [companyId]);
        console.log('Fetched company applications:', applications);
        
        return applications; // Ensure it only returns data, not sending responses
    } catch (error) {
        console.error('Error fetching company applications:', error);
        throw error; // Throw error instead of sending response here
    }
};


const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const query = 'UPDATE applications SET status = ? WHERE id = ?';
        await pool.execute(query, [status, id]);

        if (!res.headersSent) {
            return res.status(200).json({ message: 'Application status updated successfully' });
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Server Error', error });
        }
    }
};

module.exports = { applyForJob, getApplications, shortlistApplication, rejectApplication, scheduleInterview, getCompanyApplications, updateApplicationStatus };
