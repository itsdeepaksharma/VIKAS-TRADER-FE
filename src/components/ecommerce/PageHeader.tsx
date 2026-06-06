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
    <header
      className={cn(
        'relative z-10 flex shrink-0 items-center gap-3 border-b border-vt-border bg-vt-surface px-4 py-3',
        className,
      )}
    >
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-vt-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 truncate text-base font-bold text-vt-foreground sm:text-lg">{title}</h1>
      {rightAction}
    </header>
  );
}
