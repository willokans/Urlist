import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTestUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });
  
  if (!user) {
    console.log('User not found');
    return;
  }

  const password = 'testpass123';
  const isValid = await bcrypt.compare(password, user.hashedPassword);
  
  console.log('User found:', {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    passwordValid: isValid
  });
}

verifyTestUser().catch(console.error);
