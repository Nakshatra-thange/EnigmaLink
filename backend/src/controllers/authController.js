const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { generateTokens } = require('../utils/helpers');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    // Note: The schema field is now 'passwordHash'
    const { username, email, password, publicKey } = req.body;
    // ... check if user exists ...

    const user = await User.create({
        username,
        email,
        passwordHash: password, // Pass the plain password here; the pre-save hook handles hashing
        publicKey
    });
    
    if (user) {
        // Use the new instance method
        const { accessToken, refreshToken } = user.generateTokens();
    // 5. Send the refresh token in a secure, httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // 6. TODO: Send welcome email (optional)
    // await sendWelcomeEmail(user.email, user.username);

    // 7. Return success response with accessToken and user data
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      publicKey: user.publicKey,
      accessToken: accessToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/login
 * @access  Public
 */
// Add other controller functions as placeholders
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user by email
  // We must use .select('+password') because we excluded it in the schema
  const user = await User.findOne({ email }).select('+passwordHash');

  // OLD: if (user && (await bcrypt.compare(password, user.password)))
  // NEW: Use the instance method
  if (user && (await user.comparePassword(password))) {
    // ...
    // OLD: const { accessToken, refreshToken } = generateTokens(user._id);
    // NEW: Use the instance method
    const { accessToken, refreshToken } = user.generateTokens();
  // 4. User is valid, generate new tokens

  
  // 5. NEW: Update last login timestamp
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false }); // Save without running all validators

  // 6. Send the refresh token in a secure, httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });


    // 5. Return success response
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      publicKey: user.publicKey,
      accessToken: accessToken,
    });
  });
const logoutUser = asyncHandler(async (req, res) => { /* ... */ });
const refreshToken = asyncHandler(async (req, res) => { /* ... */ });

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};