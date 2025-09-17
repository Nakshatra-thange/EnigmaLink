const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Token Extraction: Check for the Authorization header and 'Bearer' prefix
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>" -> "<token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Token Verification: Verify the signature and check expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach User to Request: Find the user by the ID from the token payload
      // Exclude the password from the user object attached to the request
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user still exists
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      // 4. Error Handling for JWT failures
      console.error(error);
      res.status(401); // Unauthorized
      if (error.name === 'TokenExpiredError') {
        throw new Error('Not authorized, token has expired');
      }
      throw new Error('Not authorized, token failed verification');
    }
  }

  // 5. Handle Missing Token Scenario
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

module.exports = authMiddleware;