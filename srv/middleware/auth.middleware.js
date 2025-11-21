const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to verify JWT token in requests
 * Adds user data to req.user if token is valid
 */
function authenticateToken(req, res, next) {
    // Skip authentication for OPTIONS requests
    if (req.method === 'OPTIONS') {
        return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Access token is required'
            }
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: {
                code: 'FORBIDDEN',
                message: error.message || 'Invalid or expired token'
            }
        });
    }
}

/**
 * Middleware to check if user has required role
 * Must be used after authenticateToken middleware
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required'
                }
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions'
                }
            });
        }

        next();
    };
}

/**
 * Optional authentication - adds user to req if token is valid, but doesn't require it
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
        } catch (error) {
            // Token invalid but we don't fail the request
            req.user = null;
        }
    }

    next();
}

module.exports = {
    authenticateToken,
    requireRole,
    optionalAuth
};
