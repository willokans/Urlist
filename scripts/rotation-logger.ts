import { appendFile } from 'fs/promises';
import { join } from 'path';
import nodemailer from 'nodemailer';
import { env } from '../src/utils/env';
import { createNotification } from '../src/lib/notifications';

const LOG_FILE = join(process.cwd(), 'logs', 'jwt-rotation.log');

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

interface NotificationOptions {
    oldSecret?: string;
    newSecret?: string;
    timestamp?: string;
    error?: string;
}

async function sendNotificationEmail(success: boolean, options: NotificationOptions) {
    const subject = success 
        ? '🔄 JWT Secret Rotation Successful'
        : '⚠️ JWT Secret Rotation Failed';

    let html = success
        ? `
            <h1>JWT Secret Rotation Completed Successfully</h1>
            <p>The JWT secret was rotated at ${options.timestamp}</p>
            <h2>Actions Required:</h2>
            <ol>
                <li>Update any external services using the old secret</li>
                <li>Verify the application is running correctly</li>
                <li>Archive the old secret for potential rollback</li>
            </ol>
            <h2>Details:</h2>
            <ul>
                <li><strong>Old Secret:</strong> ${options.oldSecret}</li>
                <li><strong>New Secret:</strong> ${options.newSecret}</li>
                <li><strong>Rotation Time:</strong> ${options.timestamp}</li>
            </ul>
            `
        : `
            <h1>JWT Secret Rotation Failed</h1>
            <p>An error occurred during JWT secret rotation at ${options.timestamp}</p>
            <h2>Error Details:</h2>
            <pre style="background-color: #f8d7da; padding: 15px; border-radius: 4px;">
            ${options.error}
            </pre>
            <h2>Actions Required:</h2>
            <ol>
                <li>Check the application logs for more details</li>
                <li>Verify the current JWT secret is still valid</li>
                <li>Investigate and resolve the error</li>
                <li>Manually trigger a new rotation once resolved</li>
            </ol>
            `;

    await transporter.sendMail({
        from: env.SMTP_FROM,
        to: env.SMTP_USER, // Send to the admin email
        subject,
        html
    });
}

export async function logRotation(success: boolean, message: string, options: NotificationOptions = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${success ? 'SUCCESS' : 'ERROR'}: ${message}\n`;
    
    try {
        // Log to file
        try {
            await appendFile(LOG_FILE, logEntry);
        } catch (error) {
            // If logs directory doesn't exist, create it
            const { mkdir } = require('fs/promises');
            await mkdir(join(process.cwd(), 'logs'), { recursive: true });
            await appendFile(LOG_FILE, logEntry);
        }

        // Send email notification
        await sendNotificationEmail(success, {
            ...options,
            timestamp,
            error: success ? undefined : message
        });

        // Create system notification
        await createNotification({
            type: success ? 'success' : 'error',
            title: success ? 'JWT Secret Rotation Successful' : 'JWT Secret Rotation Failed',
            message: success 
                ? `JWT secret was successfully rotated at ${timestamp}`
                : `Failed to rotate JWT secret: ${message}`,
            metadata: {
                timestamp,
                ...(success ? {
                    backupFile: `${options.timestamp}.backup`,
                    oldSecret: options.oldSecret?.substring(0, 10) + '...',
                    newSecret: options.newSecret?.substring(0, 10) + '...'
                } : {
                    error: message
                })
            }
        });
    } catch (err) {
        console.error('Failed to send notification:', err);
        // Still throw the error if it was a rotation failure
        if (!success) throw err;
    }
}
