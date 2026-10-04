const express = require('express');
const Analytics = require('../models/Analytics');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

/*
  CREATE ANALYTICS RECORD
*/
router.post('/', auth, async (req, res) => {
  try {
    const {
      postId,
      platform,
      views = 0,
      likes = 0,
      comments = 0,
      shares = 0,
      watches = 0,
      revenue = 0,
      engagement = 0
    } = req.body;

    const analytics = new Analytics({
      userId: req.userId,
      postId,
      platform,
      views,
      likes,
      comments,
      shares,
      watches,
      revenue,
      engagement
    });

    await analytics.save();

    res.status(201).json({
      message: 'Analytics created successfully',
      analytics
    });
  } catch (error) {
    console.error('Analytics POST error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});


/*
  GET ALL ANALYTICS

  If Analytics collection has data:
      return it.

  If Analytics collection is empty:
      generate analytics from existing Posts.
*/
router.get('/', auth, async (req, res) => {
  try {

    // First check actual analytics records
    const analytics = await Analytics.find({
      userId: req.userId
    })
      .populate('postId')
      .sort({ date: -1 });

    if (analytics.length > 0) {
      return res.json(analytics);
    }

    // No analytics records → use Posts
    const posts = await Post.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    const generatedAnalytics = [];

    posts.forEach((post) => {

      const platforms = Array.isArray(post.platforms)
        ? post.platforms
        : [];

      platforms.forEach((platform) => {

        generatedAnalytics.push({
          _id: `${post._id}-${platform}`,
          postId: post,
          platform: platform,

          // Existing data from Post
          views: Number(post.views || 0),
          likes: Number(post.likes || 0),

          // These may not exist in your Post model
          comments: Number(post.comments || 0),
          shares: Number(post.shares || 0),
          watches: Number(post.watches || 0),
          revenue: Number(post.revenue || 0),
          engagement: Number(post.engagement || 0),

          date: post.updatedAt || post.createdAt
        });

      });

    });

    res.json(generatedAnalytics);

  } catch (error) {
    console.error('Analytics GET error:', error);

    res.status(500).json({
      error: error.message
    });
  }
});


/*
  GET ANALYTICS BY PLATFORM
*/
router.get('/platform/:platform', auth, async (req, res) => {
  try {

    const platform = req.params.platform;

    // Check actual Analytics collection first
    const analytics = await Analytics.find({
      userId: req.userId,
      platform: platform
    })
      .populate('postId')
      .sort({ date: -1 });

    if (analytics.length > 0) {
      return res.json(analytics);
    }

    // Otherwise generate from Posts
    const posts = await Post.find({
      userId: req.userId,
      platforms: platform
    }).sort({ createdAt: -1 });

    const generatedAnalytics = posts.map((post) => ({
      _id: `${post._id}-${platform}`,
      postId: post,
      platform: platform,

      views: Number(post.views || 0),
      likes: Number(post.likes || 0),
      comments: Number(post.comments || 0),
      shares: Number(post.shares || 0),
      watches: Number(post.watches || 0),
      revenue: Number(post.revenue || 0),
      engagement: Number(post.engagement || 0),

      date: post.updatedAt || post.createdAt
    }));

    res.json(generatedAnalytics);

  } catch (error) {
    console.error('Platform analytics error:', error);

    res.status(500).json({
      error: error.message
    });
  }
});


/*
  DASHBOARD SUMMARY

  Uses Analytics collection if available.
  Otherwise calculates from Posts.
*/
router.get('/summary/all', auth, async (req, res) => {
  try {

    const analytics = await Analytics.find({
      userId: req.userId
    });

    // -----------------------------------------
    // If Analytics data exists
    // -----------------------------------------
    if (analytics.length > 0) {

      const summary = {
        totalViews: analytics.reduce(
          (sum, a) => sum + Number(a.views || 0),
          0
        ),

        totalLikes: analytics.reduce(
          (sum, a) => sum + Number(a.likes || 0),
          0
        ),

        totalComments: analytics.reduce(
          (sum, a) => sum + Number(a.comments || 0),
          0
        ),

        totalShares: analytics.reduce(
          (sum, a) => sum + Number(a.shares || 0),
          0
        ),

        totalRevenue: analytics.reduce(
          (sum, a) => sum + Number(a.revenue || 0),
          0
        ),

        averageEngagement:
          analytics.length > 0
            ? (
                analytics.reduce(
                  (sum, a) => sum + Number(a.engagement || 0),
                  0
                ) / analytics.length
              ).toFixed(2)
            : 0
      };

      return res.json(summary);
    }


    // -----------------------------------------
    // No Analytics data
    // Use Posts instead
    // -----------------------------------------

    const posts = await Post.find({
      userId: req.userId
    });

    const summary = {

      totalViews: posts.reduce(
        (sum, post) => sum + Number(post.views || 0),
        0
      ),

      totalLikes: posts.reduce(
        (sum, post) => sum + Number(post.likes || 0),
        0
      ),

      totalComments: posts.reduce(
        (sum, post) => sum + Number(post.comments || 0),
        0
      ),

      totalShares: posts.reduce(
        (sum, post) => sum + Number(post.shares || 0),
        0
      ),

      totalRevenue: posts.reduce(
        (sum, post) => sum + Number(post.revenue || 0),
        0
      ),

      averageEngagement:
        posts.length > 0
          ? (
              posts.reduce(
                (sum, post) =>
                  sum + Number(post.engagement || 0),
                0
              ) / posts.length
            ).toFixed(2)
          : 0
    };

    res.json(summary);

  } catch (error) {

    console.error('Analytics summary error:', error);

    res.status(500).json({
      error: error.message
    });
  }
});


module.exports = router;