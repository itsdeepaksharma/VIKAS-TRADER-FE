import { Bell } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../components/ecommerce/PageHeader';
import {
  formatNotificationDate,
  getNotificationDestination,
} from '../lib/notificationLinks';
import { useNotificationStore, type AppNotification } from '../store/notificationStore';
import { cn } from '../lib/utils';

export function NotificationsPage() {
  const navigate = useNavigate();
  const items = useNotificationStore((s) => s.items);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const markRead = useNotificationStore((s) => s.markRead);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  function handleNotificationClick(notification: AppNotification) {
    markRead(notification.id);
    navigate(getNotificationDestination(notification));
  }

  return (
    <div className="pb-6">
      <PageHeader title="Notifications" />
      <div className="space-y-3 px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Bell className="h-12 w-12 text-slate-200" />
            <p className="mt-4 font-medium text-vt-foreground">No notifications yet</p>
            <p className="text-sm text-vt-muted">
              You will be notified when an order is confirmed or cancelled.
            </p>
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => handleNotificationClick(n)}
              className={cn(
                'w-full rounded-2xl border p-4 text-left shadow-vt-card transition-colors hover:bg-vt-surface-muted',
                n.read ? 'border-vt-border bg-vt-surface' : 'border-vt-blue/40 bg-vt-light-blue/30',
              )}
            >
              <p
                className={cn(
                  'font-semibold',
                  n.read ? 'text-vt-muted' : 'text-vt-foreground',
                )}
              >
                {n.title}
              </p>
              <p
                className={cn(
                  'mt-1 break-words text-sm leading-relaxed',
                  n.read ? 'text-vt-muted/80' : 'text-vt-foreground/75',
                )}
              >
                {n.message}
              </p>
              <p className="mt-2 text-xs text-vt-muted">{formatNotificationDate(n.createdAt)}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
