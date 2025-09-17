const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  // The authMiddleware has already fetched the user and attached it to req.user
  // We also know the user exists at this point.
  const user = req.user;

  // You can add profile statistics here if needed later
  // const chatCount = await ChatRoom.countDocuments({ participants: user._id });

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    preferences: user.preferences,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
    // stats: { chatCount }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  // Find the user from the database again to ensure we have the latest record
  const user = await User.findById(req.user._id);

  if (user) {
    // Check for unique constraints if username or email are being changed
    if (req.body.username && req.body.username !== user.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        res.status(400);
        throw new Error('Username is already taken');
      }
      user.username = req.body.username;
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        res.status(400);
        throw new Error('Email is already in use');
      }
      user.email = req.body.email;
    }

    // Update other fields
    user.bio = req.body.bio || user.bio;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    if (req.body.preferences) {
      user.preferences.theme = req.body.preferences.theme || user.preferences.theme;
      user.preferences.notifications = req.body.preferences.notifications !== undefined
        ? req.body.preferences.notifications
        : user.preferences.notifications;
    }
    
    const updatedUser = await user.save();

    // Return updated profile
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      preferences: updatedUser.preferences,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


/**
 * @desc    Search for users
 * @route   GET /api/users/search
 * @access  Private
 */
const searchUsers = asyncHandler(async (req, res) => {
  // Placeholder for user search logic
  res.json({ message: 'User search endpoint' });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  searchUsers,
};