const express = require('express');
const router = express.Router();
const { loginUser, registerUser, loginPage, registerPage, dashboardPage, logoutUser } = require('../controllers/authController'); // Import dashboardPage
const authenticate = require('../middleware/auth');
const upload = require('../utils/multer'); // Ensure multer middleware is imported

router.get('/register', registerPage); // Ensure this is a GET request for the registration page
router.post('/register', upload.single('cv'), registerUser); // Ensure this is a POST request for registration
router.post('/login', loginUser);
router.get('/login', loginPage); // Ensure the login page route is correctly defined
router.get('/dashboard', authenticate, dashboardPage); // Ensure authentication middleware is applied
router.get('/logout', logoutUser); // Ensure the logout route is correctly defined

module.exports = router;


