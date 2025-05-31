import GitHub from '@auth/core/providers/github'
import type { AuthConfig } from '@auth/core'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './src/lib/prisma'
import { defineConfig } from 'auth-astro'

export default defineConfig({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
})
