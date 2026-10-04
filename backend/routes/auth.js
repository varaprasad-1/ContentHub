const express = require('express');
const jwt = require('jsonwebtoken');
const { createHash, randomBytes } = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../services/email');

const router = express.Router();
const PASSWORD_RESET_TTL_MS = 20 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hashResetToken = (token) =>
  createHash('sha256').update(token).digest('hex');

const resetResponseMessage =
  'If an account exists for that email, a password reset link will be sent.';

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;

    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      username,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  try {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return res.status(503).json({
        error: 'Password reset email service is not configured. Please contact the administrator.',
      });
    }

    const rawToken = randomBytes(32).toString('hex');
    const user = await User.findOne({ email });

    if (user) {
      user.resetPasswordToken = hashResetToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
      await user.save();

      const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
      const resetUrl = `${frontendUrl}/reset-password/${rawToken}`;
      try {
        await sendPasswordResetEmail({ to: user.email, resetUrl });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        console.error('Password reset email delivery failed:', error.code || error.name);
        return res.status(503).json({
          error: 'Password reset email could not be sent. Please try again later.',
        });
      }
    }

    return res.json({
      message: resetResponseMessage,
    });
  } catch (error) {
    console.error('Password reset request failed:', error.name);
    return res.status(500).json({ error: 'Unable to process password reset request' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token) || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'A valid reset token and new password are required' });
  }

  try {
    const user = await User.findOneAndUpdate(
      {
        resetPasswordToken: hashResetToken(token),
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        $unset: {
          resetPasswordToken: 1,
          resetPasswordExpires: 1,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ error: 'This password reset link is invalid or has expired' });
    }

    user.password = password;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset failed:', error.name);
    return res.status(500).json({ error: 'Unable to reset password' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, username, bio, profilePicture, platforms } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, username, bio, profilePicture, platforms },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
