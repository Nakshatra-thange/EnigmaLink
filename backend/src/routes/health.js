const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @route   GET /api/health
// @desc    Checks the health of the API and database connection
// @access  Public
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const healthStatus = {
    status: 'ok',
    database: {
      state: mongoose.STATES[dbState],
      // readyState values: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      isConnected: dbState === 1
    },
    timestamp: new Date().toISOString()
  };
  
  if (healthStatus.database.isConnected) {
    res.status(200).json(healthStatus);
  } else {
    res.status(503).json(healthStatus); // 503 Service Unavailable
  }
});

module.exports = router;