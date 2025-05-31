import type { APIContext } from 'astro';
import { verifyToken } from './auth';
import prisma from './prisma';

export async function authenticateUser(context: APIContext) {
  const authToken = context.cookies.get('auth_token')?.value;
  
  if (!authToken) {
    return null;
  }

  const payload = verifyToken(authToken);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true }
  });

  return user;
}

export async function requireAuth(context: APIContext) {
  const user = await authenticateUser(context);
  
  if (!user) {
    return context.redirect('/auth/login');
  }
  
  return user;
}
