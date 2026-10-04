const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    mediaUrl: {
      type: String,
      default: '',
    },

    platforms: {
      type: [String],
      enum: [
        'YouTube',
        'TikTok',
        'Instagram',
        'Twitch',
        'Patreon',
        'Twitter',
        'LinkedIn',
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'archived'],
      default: 'draft',
    },

    scheduledTime: {
      type: Date,
      default: null,
    },

    category: {
      type: String,
      default: 'General',
    },

    tags: {
      type: [String],
      default: [],
    },

    // Content performance
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    comments: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);