const { verifyUserToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = verifyUserToken(token);
    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }

    req.user = decoded;
    next();
};

module.exports = authenticate;