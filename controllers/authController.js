const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { setUser } = require('../utils/jwt');
const { getUsers, getJobs } = require('./adminController');
const { getStats } = require('./statsController');
const saltRounds = 10;

const registerUser = async (req, res) => {
    console.log(req.params);
    console.log("Request Body:", req.body);
    const { name, email, phoneNumber, password, location, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            console.error('Registration Failed: Missing Fields');
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Registration based on role
        if (role === "jobSeeker") {
            let cv;
            if (req.file) { cv = req.file.filename; }
            else { cv = null; }

            if (!cv) {
                return res.status(400).json({ success: false, message: "CV is required for jobSeeker!" });
            }
            await pool.execute("INSERT INTO users(username, email, password, phone_number, role, cv) VALUES (?, ?, ?, ?, ?, ?)", [name, email, hashedPassword, phoneNumber, role, cv]);

        } else if (role === "company") {
            if (!location) {
                return res.status(400).json({ success: false, message: "Location is required for company!" });
            }
            await pool.execute("INSERT INTO users(username, email, password, phone_number, role, location) VALUES (?, ?, ?, ?, ?, ?)", [name, email, hashedPassword, phoneNumber, role, location]);
        } else {
            return res.status(400).json({ success: false, message: "Invalid Role!" });
        }

        console.log(`Registration successful for role: ${role}`);
        return res.status(201).json({ success: true, message: "Registration is successful." });

    } catch (error) {
        console.error("Error occurred during registration: ", error);
        res.status(500).json({ success: false, message: "Server error! Please try again later." });
    }
};

const findUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows;
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt with email:', email);

        const users = await findUserByEmail(email);
        if (users.length === 0) {
            console.error('User not found');
            return res.status(401).send('Invalid credentials');
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Invalid password');
            return res.status(401).send('Invalid credentials');
        }

        const token = setUser(user);
        res.cookie('token', token, { httpOnly: true });

        switch (user.role) {
            case 'jobSeeker':
                const [jobs] = await pool.query('SELECT * FROM jobs WHERE status = "active"');
                const [appliedJobs] = await pool.query('SELECT jobs.title, applications.status FROM applications JOIN jobs ON applications.job_id = jobs.id WHERE applications.job_seeker_id = ?', [user.id]);
                const [locations] = await pool.query('SELECT DISTINCT location FROM jobs');
                return res.render('jobApp', { user, jobs, appliedJobs: appliedJobs.length ? appliedJobs : [], locations });
            case 'company':
                return res.redirect('/company/dashboard');
            case 'admin':
                return res.redirect('/admin/dashboard');
            default:
                return res.status(400).send('Invalid role');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Server error');
    }
};

const loginPage = (req, res) => {
    const role = req.query.role;
    res.render('login', { role });
};

const registerPage = (req, res) => {
    const { role } = req.query;
    console.log(`Role Provided: ${role}`);
    res.render('register', { role });
};

const dashboardPage = (req, res) => {
    const role = req.user.role;
    switch (role) {
        case 'jobSeeker':
            res.render('jobApp', { user: req.user }); // Render JobSeekerDashboard page with user data
            break;
        case 'company':
            res.render('dashboard', { user: req.user }); // Render CompanyDashboard page with user data
            break;
        case 'admin':
            res.render('dashboard', { user: req.user }); // Render AdminDashboard page with user data
            break;
        default:
            res.status(400).send('Invalid role');
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.redirect('/login'); // Redirect to login page
};

module.exports = {
    registerUser,
    loginUser,
    loginPage,
    registerPage,
    dashboardPage,
    logoutUser
};