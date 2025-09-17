const { body, validationResult } = require('express-validator');

const validateRegistration = [
  // Validate Username
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores')
    .escape(), // Sanitize against XSS

  // Validate Email
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Validate Password
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  // Validate Public Key (optional, basic check)
  body('publicKey')
    .optional()
    .trim()
    .isString()
    .escape(),
  
  // Middleware to handle the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, return a 400 response with the errors
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// ... (imports)

const validateProfileUpdate = [
  // Optional validation: if email is provided, it must be a valid email
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  // Optional validation: if username is provided, check its format
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores')
    .escape(),
  // ... add any other field validations as needed

  // Middleware to handle the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Placeholder for login validation to be created later
const validateLogin = [
  // Validate Email
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  // Validate Password
  body('password')
    .notEmpty().withMessage('Password cannot be empty'),

  // Middleware to handle the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegistration,
  validateLogin,
};