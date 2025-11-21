const { body, validationResult } = require('express-validator');

/**
 * Validation rules for user creation/update
 */
const userValidationRules = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Must be a valid email address'),
        body('name')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('password')
            .optional()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
        body('role')
            .optional()
            .isIn(['ADMIN', 'MANAGER', 'TECH', 'REQUESTER'])
            .withMessage('Invalid role')
    ];
};

/**
 * Validation rules for maintenance request
 */
const maintenanceRequestValidationRules = () => {
    return [
        body('title')
            .trim()
            .isLength({ min: 3, max: 200 })
            .withMessage('Title must be between 3 and 200 characters'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Description must be between 10 and 2000 characters'),
        body('priority')
            .isInt({ min: 1, max: 3 })
            .withMessage('Priority must be 1, 2, or 3'),
        body('asset_ID')
            .notEmpty()
            .withMessage('Asset ID is required')
    ];
};

/**
 * Validation rules for asset
 */
const assetValidationRules = () => {
    return [
        body('code')
            .trim()
            .isLength({ min: 2, max: 50 })
            .matches(/^[A-Z0-9-]+$/)
            .withMessage('Asset code must be alphanumeric with hyphens'),
        body('name')
            .trim()
            .isLength({ min: 2, max: 200 })
            .withMessage('Name must be between 2 and 200 characters'),
        body('location')
            .optional()
            .trim()
            .isLength({ max: 200 })
            .withMessage('Location must be less than 200 characters')
    ];
};

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
                    value: err.value
                }))
            }
        });
    }
    next();
};

/**
 * Sanitize string input to prevent XSS
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return str;

    // Remove HTML tags
    return str
        .replace(/<[^>]*>/g, '')
        .trim();
}

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
}

module.exports = {
    userValidationRules,
    maintenanceRequestValidationRules,
    assetValidationRules,
    validate,
    sanitizeString,
    sanitizeObject
};
