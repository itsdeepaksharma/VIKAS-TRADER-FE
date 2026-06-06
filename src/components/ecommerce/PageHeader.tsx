import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { VTLogo } from '../layout/VTLogo';

type PageHeaderProps = {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
  homeTo?: string;
  rightAction?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  showBack = true,
  showLogo = true,
  homeTo = '/',
  rightAction,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'mb-4 flex items-center gap-2.5 rounded-3xl border border-vt-border bg-vt-surface px-4 py-3 shadow-vt-card sm:gap-3',
        className,
      )}
    >
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-light-blue text-vt-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      {showLogo && (
        <Link to={homeTo} className="shrink-0" aria-label="Vikas Traders home">
          <VTLogo size="home" />
        </Link>
      )}
      <h1 className="min-w-0 flex-1 truncate text-base font-bold text-vt-foreground sm:text-lg">
        {title}
      </h1>
      {rightAction ? <div className="flex shrink-0 items-center">{rightAction}</div> : null}
    </header>
  );
}
