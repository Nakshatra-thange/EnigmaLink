const express = require('express');
const router = express.Router();

// --- Placeholder Imports ---
const { createChatRoom, getUserChatRooms, sendMessage, getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');


// --- Route Definitions ---

// @route   POST /api/chat/rooms
// @desc    Create a new chat room
// @access  Private
router.post('/rooms', authMiddleware, createChatRoom);

// @route   GET /api/chat/rooms
// @desc    Get all chat rooms for the current user
// @access  Private
router.get('/rooms', authMiddleware, getUserChatRooms);

// @route   POST /api/chat/messages
// @desc    Send a message to a chat room
// @access  Private
router.post('/messages', authMiddleware, sendMessage);

// @route   GET /api/chat/messages/:roomId
// @desc    Get message history for a specific room with pagination
// @access  Private
router.get('/messages/:roomId', authMiddleware, getChatHistory);


module.exports = router;