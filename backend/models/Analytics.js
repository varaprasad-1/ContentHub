const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    platform: {
      type: String,
      enum: ['YouTube', 'TikTok', 'Instagram', 'Twitch', 'Patreon', 'Twitter', 'LinkedIn'],
      required: true,
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    watches: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
