import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useNotificationStore } from '../../store/notificationStore';
import { cn } from '../../lib/utils';
import { NotificationUnreadDot } from './NotificationUnreadDot';

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
  const unread = useNotificationStore((s) => s.items.filter((n) => !n.read).length);
  const preview = items.slice(0, PREVIEW_LIMIT);
  const hasMore = items.length > PREVIEW_LIMIT;
  const hasUnread = unread > 0;

  useEffect(() => {
    if (!open) return;
    return () => {
      markAllRead();
    };
  }, [open, markAllRead]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function handleViewAll() {
    setOpen(false);
    markAllRead();
    navigate('/notifications');
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-vt-surface shadow-vt-card"
        aria-label={hasUnread ? `Notifications (${unread} unread)` : 'Notifications'}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-vt-foreground" />
        <NotificationUnreadDot visible={hasUnread && !open} className="right-2 top-2 h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-vt-border bg-vt-surface shadow-elevated">
          <div className="flex items-center justify-between border-b border-vt-border px-4 py-3">
            <p className="font-semibold text-vt-foreground">Notifications</p>
            {hasUnread && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {unread} new
              </span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {preview.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-vt-muted">No notifications yet</p>
            ) : (
              preview.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'border-b border-vt-border/60 px-4 py-3 last:border-0',
                    n.read
                      ? 'bg-vt-surface'
                      : 'border-l-[3px] border-l-vt-blue bg-slate-100',
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      n.read ? 'text-vt-muted' : 'text-vt-foreground',
                    )}
                  >
                    {n.title}
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 line-clamp-2 text-xs',
                      n.read ? 'text-vt-muted/80' : 'text-vt-foreground/75',
                    )}
                  >
                    {n.message}
                  </p>
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
              onClick={handleViewAll}
              className="w-full border-t border-vt-border py-3 text-center text-sm font-semibold text-vt-blue hover:bg-vt-surface-muted"
            >
              Load more ({items.length - PREVIEW_LIMIT} more)
            </button>
          )}
          <Link
            to="/notifications"
            onClick={handleViewAll}
            className="block border-t border-vt-border py-3 text-center text-sm font-medium text-vt-muted hover:bg-vt-surface-muted"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
