const jwt = require('jsonwebtoken');

/**
 * Generates JWT access and refresh tokens for a given user ID.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {{accessToken: string, refreshToken: string}}
 */
const generateTokens = (userId) => {
  // Create the access token
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Create the refresh token
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };