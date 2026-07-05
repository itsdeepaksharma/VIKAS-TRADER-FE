import { Bell } from 'lucide-react';
import { useEffect } from 'react';

import { PageHeader } from '../components/ecommerce/PageHeader';
import { useNotificationStore } from '../store/notificationStore';
import { cn } from '../lib/utils';

export function NotificationsPage() {
  const items = useNotificationStore((s) => s.items);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

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
            <div
              key={n.id}
              className={cn(
                'rounded-2xl border p-4 shadow-vt-card',
                n.read
                  ? 'border-vt-border bg-vt-surface'
                  : 'border-vt-blue/40 bg-slate-100',
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
                  'mt-1 text-sm',
                  n.read ? 'text-vt-muted/80' : 'text-vt-foreground/75',
                )}
              >
                {n.message}
              </p>
              <p className="mt-2 text-xs text-vt-muted">
                {new Date(n.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
