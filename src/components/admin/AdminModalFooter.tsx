import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type AdminModalFooterProps = {
  children: ReactNode;
  className?: string;
};

export function AdminModalFooter({ children, className }: AdminModalFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 flex flex-wrap items-center gap-2.5 border-t border-vt-border pt-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
