import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type AdminModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function AdminModal({ open, title, onClose, children, className }: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-vt-dark/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-vt-border bg-vt-surface p-4 shadow-elevated sm:max-h-[90vh] sm:rounded-3xl sm:p-6',
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="admin-modal-title" className="text-lg font-bold text-vt-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-vt-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
