import { Bell } from 'lucide-react';
import { useEffect } from 'react';

import { PageHeader } from '../components/ecommerce/PageHeader';
import { useNotificationStore } from '../store/notificationStore';

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
            <p className="mt-4 font-medium text-vt-dark">No notifications yet</p>
            <p className="text-sm text-slate-500">
              You will be notified when an order is confirmed or cancelled.
            </p>
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`rounded-2xl border p-4 shadow-card ${
                n.read ? 'border-slate-100 bg-white' : 'border-vt-blue/30 bg-vt-light-blue/30'
              }`}
            >
              <p className="font-semibold text-vt-dark">{n.title}</p>
              <p className="mt-1 text-sm text-slate-600">{n.message}</p>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(n.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
