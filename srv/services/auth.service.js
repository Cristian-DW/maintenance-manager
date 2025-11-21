const cds = require('@sap/cds');
const { comparePasswords } = require('../utils/password');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication result with tokens and user data
 */
async function authenticate(email, password) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const { Users } = cds.entities('mm');

    // Query database directly to get password
    const user = await cds.db.run(
        SELECT.one.from(Users).where({ email, isActive: true })
    );

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload = {
        id: user.ID,
        email: user.email,
        name: user.name,
        role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.ID });

    // Remove password from user object
    delete user.password;
    delete user.createdAt;
    delete user.modifiedAt;
    delete user.createdBy;
    delete user.modifiedBy;

    return {
        success: true,
        user,
        accessToken,
        refreshToken
    };
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access token
 */
async function refreshAccessToken(refreshToken) {
    const { verifyToken } = require('../utils/jwt');

    try {
        const decoded = verifyToken(refreshToken);
        const { Users } = cds.entities('mm');

        // Get current user data
        const user = await SELECT.one.from(Users).where({ ID: decoded.id, isActive: true });

        if (!user) {
            throw new Error('User not found or inactive');
        }

        const tokenPayload = {
            id: user.ID,
            email: user.email,
            name: user.name,
            role: user.role
        };

        const accessToken = generateAccessToken(tokenPayload);

        return {
            success: true,
            accessToken
        };
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
}

/**
 * Validate user session
 * @param {string} token - Access token
 * @returns {Promise<Object>} User data if valid
 */
async function validateSession(token) {
    const { verifyToken } = require('../utils/jwt');

    try {
        const decoded = verifyToken(token);
        return {
            success: true,
            user: decoded
        };
    } catch (error) {
        throw new Error('Invalid or expired session');
    }
}

module.exports = {
    authenticate,
    refreshAccessToken,
    validateSession
};
