import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import type { NotificationPort } from '../../application/ports/notification.port';

@Injectable()
export class FCMAdapter implements NotificationPort, OnModuleInit {
  private readonly logger = new Logger(FCMAdapter.name);

  onModuleInit() {
    try {
      if (admin.apps.length === 0) {
        const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Error initializing Firebase Admin SDK', error.stack);
    }
  }

  async sendPushNotification(token: string, title: string, body: string, data?: any): Promise<string> {
    try {
      const message: admin.messaging.Message = {
        notification: { title, body },
        token: token,
        data: data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'abastock_alerts',
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending push notification to token ${token}`, error.stack);
      throw error;
    }
  }
}
