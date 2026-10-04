const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, content, mediaUrl, platforms, category, tags } = req.body;

    const post = new Post({
      userId: req.userId,
      title,
      description,
      content,
      mediaUrl,
      platforms,
      category,
      tags,
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, content, mediaUrl, platforms, status, category, tags, scheduledTime } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description, content, mediaUrl, platforms, status, category, tags, scheduledTime },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/publish', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
    res.json({ message: 'Post published successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
