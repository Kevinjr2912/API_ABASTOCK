export interface NotificationPort {
  sendPushNotification(token: string, title: string, body: string, data?: any): Promise<string>;
}
