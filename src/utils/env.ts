import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // SMTP
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_SECURE: z.string().transform((v) => v === 'true'),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),

  // Application
  PUBLIC_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  // Notifications
  SLACK_WEBHOOK_URL: z.union([z.string().url(), z.string().max(0)]),
  DISCORD_WEBHOOK_URL: z.union([z.string().url(), z.string().max(0)]),
});

function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    console.error('❌ Invalid environment variables:', error.errors);
    process.exit(1);
  }
}

export const env = validateEnv();
