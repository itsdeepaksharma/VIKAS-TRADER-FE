import { cn } from '../../lib/utils';

type NotificationUnreadDotProps = {
  visible: boolean;
  className?: string;
};

export function NotificationUnreadDot({ visible, className }: NotificationUnreadDotProps) {
  if (!visible) return null;

  return (
    <span
      className={cn(
        'notification-dot pointer-events-none absolute block rounded-full bg-red-500 ring-2 ring-vt-surface animate-pulse',
        className,
      )}
      aria-hidden
    />
  );
}
