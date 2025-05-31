import prisma from './prisma';
import { env } from '../utils/env';

interface NotificationData {
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    metadata?: Record<string, any>;
}

export async function createNotification(data: NotificationData) {
    // Save to database
    const notification = await prisma.systemNotification.create({
        data: {
            type: data.type,
            title: data.title,
            message: data.message,
            metadata: data.metadata || {}
        }
    });

    // Send to Slack if configured
    if (env.SLACK_WEBHOOK_URL) {
        try {
            const color = data.type === 'success' ? '#36a64f' : 
                         data.type === 'error' ? '#ff0000' : '#ffa500';

            await fetch(env.SLACK_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attachments: [{
                        color,
                        title: data.title,
                        text: data.message,
                        fields: Object.entries(data.metadata || {}).map(([key, value]) => ({
                            title: key,
                            value: String(value),
                            short: true
                        }))
                    }]
                })
            });
        } catch (error) {
            console.error('Failed to send Slack notification:', error);
        }
    }

    // Send to Discord if configured
    if (env.DISCORD_WEBHOOK_URL) {
        try {
            const color = data.type === 'success' ? 0x36a64f : 
                         data.type === 'error' ? 0xff0000 : 0xffa500;

            await fetch(env.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: data.title,
                        description: data.message,
                        color,
                        fields: Object.entries(data.metadata || {}).map(([key, value]) => ({
                            name: key,
                            value: String(value),
                            inline: true
                        }))
                    }]
                })
            });
        } catch (error) {
            console.error('Failed to send Discord notification:', error);
        }
    }

    return notification;
}

export async function getNotifications(options: { 
    limit?: number; 
    offset?: number; 
    unreadOnly?: boolean;
} = {}) {
    const { limit = 10, offset = 0, unreadOnly = false } = options;

    return prisma.systemNotification.findMany({
        where: unreadOnly ? { read: false } : undefined,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
    });
}

export async function markNotificationAsRead(id: string) {
    return prisma.systemNotification.update({
        where: { id },
        data: { read: true }
    });
}

export async function getUnreadCount() {
    return prisma.systemNotification.count({
        where: { read: false }
    });
}
