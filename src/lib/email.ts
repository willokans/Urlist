import nodemailer from 'nodemailer';
import { env } from '../utils/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/auth/verify/${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@theurlist.com',
    to: email,
    subject: 'Verify your email address',
    text: `Please verify your email address by clicking this link: ${verifyUrl}`,
    html: `
      <h1>Verify your email address</h1>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/auth/reset/${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@theurlist.com',
    to: email,
    subject: 'Reset your password',
    text: `Reset your password by clicking this link: ${resetUrl}`,
    html: `
      <h1>Reset your password</h1>
      <p>Please click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:white;text-decoration:none;border-radius:6px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}
