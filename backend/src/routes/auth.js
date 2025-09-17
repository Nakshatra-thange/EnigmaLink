const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// --- Placeholder Imports ---
// Controller functions for handling the logic of each route
const { registerUser, loginUser, logoutUser, refreshToken } = require('../controllers/authController');
// Middleware for request validation and authentication
const { validateRegistration, validateLogin } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

// --- Route Definitions ---

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validateLogin, loginUser);

// @route   POST /api/auth/logout
// @desc    Log out user
// @access  Private (requires JWT to identify the user session)
router.post('/logout', authMiddleware, logoutUser);

// @route   POST /api/auth/refresh
// @desc    Refresh an expired access token
// @access  Private (requires a valid refresh token)
router.post('/refresh', refreshToken);


module.exports = router;