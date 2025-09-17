const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  encryptedContent: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text',
  },
  encryption: {
    iv: { type: String, required: true },
    algorithm: { type: String, default: 'AES-256-GCM' },
  },
  metadata: {
    fileName: String,
    fileSize: Number,
    mimeType: String,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  deliveredTo: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveredAt: { type: Date, default: Date.now },
  }],
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;