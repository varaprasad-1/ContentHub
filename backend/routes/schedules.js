const express = require('express');
const Schedule = require('../models/Schedule');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { postId, platform, scheduledTime, notes } = req.body;

    const post = await Post.findOne({
      _id: postId,
      userId: req.userId
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    const schedule = new Schedule({
      userId: req.userId,
      postId,
      platform,
      scheduledTime,
      notes,
    });

    await schedule.save();

    // Change the post status from draft to scheduled
    post.status = 'scheduled';
    post.scheduledTime = scheduledTime;

    await post.save();

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule,
      post
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.userId })
      .populate('postId')
      .sort({ scheduledTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/platform/:platform', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.userId, platform: req.params.platform })
      .populate('postId')
      .sort({ scheduledTime: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { scheduledTime, status, notes } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { scheduledTime, status, notes },
      { new: true }
    ).populate('postId');

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({ message: 'Schedule updated successfully', schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
