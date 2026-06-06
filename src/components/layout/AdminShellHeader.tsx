import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { VTLogo } from './VTLogo';

type AdminShellHeaderProps = {
  title: string;
  menuButton?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function AdminShellHeader({ title, menuButton, actions, className }: AdminShellHeaderProps) {
  return (
    <header
      className={cn(
        'mb-4 flex items-center gap-2.5 rounded-3xl border border-vt-border bg-vt-surface px-4 py-3 shadow-vt-card sm:gap-3 lg:hidden',
        className,
      )}
    >
      {menuButton}
      <Link to="/admin" className="shrink-0" aria-label="Vikas Traders admin home">
        <VTLogo size="home" />
      </Link>
      <h1 className="min-w-0 flex-1 truncate text-base font-bold text-vt-foreground sm:text-lg">
        {title}
      </h1>
      {actions}
    </header>
  );
}
