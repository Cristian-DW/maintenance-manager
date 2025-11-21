const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * Rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many login attempts, please try again later'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for authentication', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many login attempts, please try again after 15 minutes'
            }
        });
    }
});

/**
 * Rate limiter for general API endpoints
 * Prevents API abuse
 */
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute per IP
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please slow down'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/';
    },
    handler: (req, res) => {
        logger.warn('Rate limit exceeded for API', {
            ip: req.ip,
            path: req.path,
            method: req.method
        });
        res.status(429).json({
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many requests, please try again later'
            }
        });
    }
});

/**
 * Strict rate limiter for sensitive operations
 * Used for operations like password reset, account deletion
 */
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many attempts, please try again later'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn('Strict rate limit exceeded', {
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many attempts, please try again after 1 hour'
            }
        });
    }
});

module.exports = {
    authLimiter,
    apiLimiter,
    strictLimiter
};
