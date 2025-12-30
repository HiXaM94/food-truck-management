const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

/**
 * Authentication middleware
 * Protects routes by verifying JWT token in Authorization header
 */
const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        // Verify token
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't block request
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
        } catch (error) {
            // Token invalid, but we don't block the request
            req.user = null;
        }
    }

    next();
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    optionalAuth
};
