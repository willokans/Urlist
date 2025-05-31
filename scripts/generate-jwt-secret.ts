import { randomBytes } from 'crypto';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { logRotation } from './rotation-logger';

async function generateAndUpdateSecret() {
  try {
    // Generate new secret
    const newSecret = randomBytes(32).toString('hex');
    
    // Read current .env file
    const envPath = join(process.cwd(), '.env');
    const envContent = await readFile(envPath, 'utf-8');
    
    // Replace existing JWT_SECRET or add new one
    const updatedContent = envContent.includes('JWT_SECRET=') 
      ? envContent.replace(/JWT_SECRET=["'].*["']/, `JWT_SECRET="${newSecret}"`)
      : envContent + `\nJWT_SECRET="${newSecret}"`;
    
    // Backup old .env
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(`${envPath}.${timestamp}.backup`, envContent);
    
    // Write new .env
    // Extract old secret from env content
    const oldSecret = envContent.match(/JWT_SECRET="([^"]+)"/)?.[1] || 'unknown';
    
    await writeFile(envPath, updatedContent);
    
    const message = `JWT secret rotated successfully. Backup created at ${envPath}.${timestamp}.backup`;
    await logRotation(true, message, {
        oldSecret,
        newSecret
    });
    
    console.log('✅ JWT secret has been rotated successfully');
    console.log('📝 Previous .env file backed up');
    console.log(`🔑 New JWT_SECRET: ${newSecret}`);
    console.log('\n⚠️  Remember to:');
    console.log('1. Restart your application');
    console.log('2. Update any services that use this secret');
    console.log('3. Keep the new secret secure and never commit it to version control');
  } catch (err: any) {
    const errorMessage = `Error updating JWT secret: ${err.message || 'Unknown error'}`;
    await logRotation(false, errorMessage);
    console.error('❌ ' + errorMessage);
    process.exit(1);
  }
}

generateAndUpdateSecret();
