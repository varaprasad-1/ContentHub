const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    platform: {
      type: String,
      enum: ['YouTube', 'TikTok', 'Instagram', 'Twitch', 'Patreon', 'Twitter', 'LinkedIn'],
      required: true,
    },
    scheduledTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'published', 'failed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
