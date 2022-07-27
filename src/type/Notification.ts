export default interface NotificationType {
  notificationId: string;
  recipientId: string;
  createdAt: string;
  content: string;
  type: string;
  isRead: boolean;
}
