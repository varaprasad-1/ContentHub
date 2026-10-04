require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    const email = await ask('Enter your account email: ');
    const newPassword = await ask('Enter your new password: ');

    if (!email || !newPassword) {
      console.log('Email and password are required.');
      return;
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      console.log('No account found with that email.');
      return;
    }

    user.password = newPassword;
    await user.save();

    console.log('Password reset successfully!');
    console.log(`Account: ${user.email}`);

  } catch (error) {
    console.error('Password reset failed:', error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

resetPassword();