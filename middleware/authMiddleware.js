const { verifyUserToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;
    console.log('Token:', token); // Debugging

    if (!token) {
        console.error('Access denied. No token provided.');
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = verifyUserToken(token);
    if (!decoded) {
        console.error('Invalid token.');
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    req.user = decoded;
    console.log('User authenticated:', req.user); // Debugging
    next();
};

module.exports = authenticate;