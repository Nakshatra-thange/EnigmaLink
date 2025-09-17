const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ['member', 'admin', 'owner'],
    default: 'member',
  },
  permissions: {
    canSendMessages: { type: Boolean, default: true },
    canAddMembers: { type: Boolean, default: false },
    canRemoveMembers: { type: Boolean, default: false },
  },
}, { _id: false });

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, trim: true }, // For group chats
  type: {
    type: String,
    enum: ['direct', 'group'],
    required: true,
  },
  participants: [participantSchema],
  settings: {
    isEncrypted: { type: Boolean, default: true },
    maxMembers: { type: Number, default: 100 },
    allowFileSharing: { type: Boolean, default: true },
    messageRetention: { type: Number, default: 0 }, // 0 = forever
  },
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date,
  },
  lastActivity: { type: Date, default: Date.now, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
module.exports = ChatRoom;