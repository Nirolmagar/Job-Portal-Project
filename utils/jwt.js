const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
}

const setUser = (user) => {
    console.log('Setting user token for:', user); // Debugging
    return jwt.sign({
        id: user.id,
        role: user.role
    }, secret, {expiresIn: '1h'});
}

const verifyUserToken = (token) => {
    if(!token) return null;
    try {
        return jwt.verify(token, secret);
    }
    catch(error) {
        console.error("Token verification failed!", error);
        return null;
    }
}

module.exports = {setUser, verifyUserToken};