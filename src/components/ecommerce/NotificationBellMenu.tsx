import { Bell } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  formatNotificationDate,
  getNotificationDestination,
} from '../../lib/notificationLinks';
import { useNotificationStore, type AppNotification } from '../../store/notificationStore';
import { cn } from '../../lib/utils';
import { NotificationUnreadDot } from './NotificationUnreadDot';

const PREVIEW_LIMIT = 10;

type NotificationBellMenuProps = {
  className?: string;
  /** Applied only to the bell trigger — never to dropdown items. */
  triggerClassName?: string;
};

type PanelPosition = {
  top: number;
  right: number;
  width: number;
};

export function NotificationBellMenu({ className, triggerClassName }: NotificationBellMenuProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const unreadItems = items.filter((n) => !n.read);
  const preview = unreadItems.slice(0, PREVIEW_LIMIT);
  const hasMore = unreadItems.length > PREVIEW_LIMIT;
  const hasUnread = unreadItems.length > 0;

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPanelPosition(null);
      return;
    }

    function updatePosition() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const width = Math.min(320, window.innerWidth - 24);
      setPanelPosition({
        top: rect.bottom + 8,
        right: Math.max(12, window.innerWidth - rect.right),
        width,
      });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function handleNotificationClick(notification: AppNotification) {
    markRead(notification.id);
    setOpen(false);
    navigate(getNotificationDestination(notification));
  }

  function handleViewAll() {
    setOpen(false);
    navigate('/notifications');
  }

  return (
    <div ref={rootRef} className={cn('relative shrink-0', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative flex h-11 w-11 items-center justify-center rounded-2xl bg-vt-surface shadow-vt-card',
          triggerClassName,
        )}
        aria-label={hasUnread ? `Notifications (${unreadItems.length} unread)` : 'Notifications'}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5 text-vt-foreground" />
        <NotificationUnreadDot visible={hasUnread && !open} className="right-2 top-2 h-3 w-3" />
      </button>

      {open && panelPosition && (
        <div
          ref={panelRef}
          className="fixed z-[80] overflow-hidden rounded-2xl border border-vt-border bg-vt-surface shadow-elevated"
          style={{
            top: panelPosition.top,
            right: panelPosition.right,
            width: panelPosition.width,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-vt-border px-4 py-3">
            <p className="font-semibold text-vt-foreground">Notifications</p>
            {hasUnread && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {unreadItems.length} new
              </span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {preview.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-vt-muted">No new notifications</p>
            ) : (
              preview.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className="flex w-full min-w-0 flex-col items-stretch gap-1 border-b border-vt-border/60 border-l-[3px] border-l-vt-blue bg-vt-light-blue/40 px-4 py-3 text-left transition-colors last:border-0 hover:bg-vt-light-blue/70 active:bg-vt-light-blue"
                >
                  <span className="block text-sm font-semibold leading-snug text-vt-foreground">
                    {n.title}
                  </span>
                  <span className="block whitespace-normal break-words text-xs leading-relaxed text-vt-foreground/80">
                    {n.message}
                  </span>
                  <span className="block text-[11px] leading-normal text-vt-muted">
                    {formatNotificationDate(n.createdAt)}
                  </span>
                </button>
              ))
            )}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={handleViewAll}
              className="w-full border-t border-vt-border py-3 text-center text-sm font-semibold text-vt-blue hover:bg-vt-surface-muted"
            >
              Load more ({unreadItems.length - PREVIEW_LIMIT} more)
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
