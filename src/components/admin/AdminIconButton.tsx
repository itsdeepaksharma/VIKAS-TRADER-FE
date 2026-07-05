import type { LucideIcon } from 'lucide-react';

import { cn } from '../../lib/utils';

type AdminIconButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'edit' | 'delete' | 'default';
  className?: string;
  disabled?: boolean;
};

const variantStyles = {
  edit: 'text-vt-blue hover:bg-vt-light-blue',
  delete: 'text-red-600 hover:bg-red-50',
  default: 'text-vt-muted hover:bg-vt-surface-muted hover:text-vt-foreground',
};

export function AdminIconButton({
  label,
  icon: Icon,
  onClick,
  variant = 'default',
  className,
  disabled,
}: AdminIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}
