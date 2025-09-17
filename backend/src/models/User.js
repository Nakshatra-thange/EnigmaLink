const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    // Note: For production, a library like 'validator' is more robust than a simple regex.
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  passwordHash: {
    type: String,
    required: true,
    select: false, // Exclude by default
  },
  publicKey: {
    type: String,
    required: true,
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: String,
    bio: { type: String, maxlength: 250 },
  },
  settings: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
  },
  bio: {
    type: String,
    maxlength: 250,
    default: ''
  },
  profilePicture: {
    type: String,
    default: 'default_avatar_url.png' // A default placeholder image URL
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  

  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });

// --- MIDDLEWARE ---
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// --- INSTANCE METHODS ---
// Compare provided password with the stored hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Generate JWT access and refresh tokens
userSchema.methods.generateTokens = function() {
  const accessToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

// Override .toJSON to remove sensitive fields from output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.__v;
  return userObject;
};

// --- STATIC METHODS ---
// Find a user by their email address
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Find a user by their username
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', userSchema);
module.exports = User;