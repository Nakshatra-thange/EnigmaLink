const express = require('express');
const router = express.Router();
// ... in routes/index.js
const healthRoutes = require('./health');
// ...

// ...
// Import individual route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const chatRoutes = require('./chat');
// We will create adminRoutes in the next step
const adminRoutes = require('./admin');

// Mount the imported routes onto the main router
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/health', healthRoutes);
module.exports = router;