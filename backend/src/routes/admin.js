const express = require('express');
const router = express.Router();
// Import admin controllers and middleware when ready

// @route   GET /api/admin/dashboard
// @desc    Placeholder for fetching admin dashboard data
// @access  Private (Admin Only)
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;