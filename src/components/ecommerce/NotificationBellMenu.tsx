import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useNotificationStore } from '../../store/notificationStore';
import { cn } from '../../lib/utils';

const PREVIEW_LIMIT = 10;

type NotificationBellMenuProps = {
  className?: string;
};

export function NotificationBellMenu({ className }: NotificationBellMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const items = useNotificationStore((s) => s.items);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unread = useNotificationStore((s) => s.unreadCount());
  const preview = items.slice(0, PREVIEW_LIMIT);
  const hasMore = items.length > PREVIEW_LIMIT;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleOpen() {
    setOpen((prev) => {
      if (!prev) markAllRead();
      return !prev;
    });
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-vt-surface shadow-vt-card"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-vt-foreground" />
        {unread > 0 && (
          <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-vt-border bg-vt-surface shadow-elevated">
          <div className="border-b border-vt-border px-4 py-3">
            <p className="font-semibold text-vt-foreground">Notifications</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {preview.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-vt-muted">No notifications yet</p>
            ) : (
              preview.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'border-b border-slate-50 px-4 py-3 last:border-0',
                    !n.read && 'bg-vt-light-blue/30',
                  )}
                >
                  <p className="text-sm font-semibold text-vt-foreground">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-vt-muted">{n.message}</p>
                  <p className="mt-1 text-[10px] text-vt-muted">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            )}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/notifications');
              }}
              className="w-full border-t border-vt-border py-3 text-center text-sm font-semibold text-vt-blue hover:bg-vt-surface-muted"
            >
              Load more ({items.length - PREVIEW_LIMIT} more)
            </button>
          )}
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-vt-border py-3 text-center text-sm font-medium text-vt-muted hover:bg-vt-surface-muted"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
