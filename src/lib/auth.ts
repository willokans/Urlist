import GithubProvider from "@auth/core/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { Octokit } from '@octokit/rest';
import type { User } from '@prisma/client';

import { env } from '../utils/env';

const JWT_SECRET = env.JWT_SECRET;
const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: { id: string; email: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  } catch {
    return null;
  }
}

export function generateVerificationToken(): string {
  return nanoid(32);
}

export function generatePasswordResetToken(): string {
  return nanoid(32);
}

export async function verifyGithubCode(code: string): Promise<{
  githubId: string;
  email: string | null;
  name: string | null;
}> {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error('GitHub client credentials not configured');
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error('Failed to get GitHub access token');
  }

  // Get user data from GitHub
  const octokit = new Octokit({ auth: tokenData.access_token });
  const { data: githubUser } = await octokit.users.getAuthenticated();

  return {
    githubId: githubUser.id.toString(),
    email: githubUser.email,
    name: githubUser.name,
  };
}

export type AuthUser = Pick<User, 'id' | 'email' | 'name' | 'emailVerified'>;

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
}
