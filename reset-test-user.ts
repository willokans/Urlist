import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetTestUser() {
  // Delete existing user
  await prisma.user.deleteMany({
    where: { email: 'test@example.com' }
  });

  // Create new user with known password
  const password = 'testpass123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      hashedPassword,
      emailVerified: new Date(),
      name: 'Test User'
    }
  });

  console.log('Created new test user:', {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified
  });

  // Verify password
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password verification:', { isValid });
}

resetTestUser().catch(console.error);
