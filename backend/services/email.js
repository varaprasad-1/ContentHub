const nodemailer = require('nodemailer');

function getSmtpConfig() {
  const port = Number(process.env.SMTP_PORT);
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !Number.isInteger(port) || port <= 0) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    from: EMAIL_FROM || SMTP_USER,
  };
}

async function sendPasswordResetEmail({ to, resetUrl }) {
  const config = getSmtpConfig();
  if (!config) {
    const error = new Error('SMTP is not configured');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: 'ContentHub Password Reset',
    text: `A password reset was requested for your ContentHub account. Use this link within 20 minutes:\n\n${resetUrl}\n\nIf you did not request this reset, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937"><h2>Reset your ContentHub password</h2><p>A password reset was requested for your ContentHub account.</p><p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;border-radius:6px;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600">Reset Password</a></p><p>This link expires in 20 minutes. If you did not request this reset, you can ignore this email.</p></div>`,
  });
}

module.exports = { sendPasswordResetEmail };
