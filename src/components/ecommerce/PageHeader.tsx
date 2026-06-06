import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { cn } from '../../lib/utils';

type PageHeaderProps = {
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  className?: string;
};

export function PageHeader({ title, showBack = true, rightAction, className }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn('vt-page-header', className)}>
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-surface-muted text-vt-foreground transition-colors hover:bg-vt-light-blue"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="min-w-0 flex-1 truncate text-base font-bold text-vt-foreground sm:text-lg">
        {title}
      </h1>
      {rightAction ? <div className="flex shrink-0 items-center">{rightAction}</div> : null}
    </header>
  );
}
