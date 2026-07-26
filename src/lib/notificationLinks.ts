import type { AppNotification } from '../store/notificationStore';

export function getNotificationDestination(notification: AppNotification): string {
  if (notification.linkTo) return notification.linkTo;

  if (notification.title.toLowerCase().includes('order')) {
    return '/orders';
  }

  return '/notifications';
}

export function formatNotificationDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
