import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';
import { VTLogo } from './VTLogo';

type AppBrandHeaderProps = {
  className?: string;
  homeTo?: string;
  rightSlot?: ReactNode;
};

export function AppBrandHeader({ className, homeTo = '/', rightSlot }: AppBrandHeaderProps) {
  return (
    <header
      className={cn(
        'flex h-[4.25rem] shrink-0 items-center justify-between gap-3 border-b border-vt-border bg-vt-surface px-4 shadow-sm',
        className,
      )}
    >
      <Link
        to={homeTo}
        className="flex h-full min-w-0 items-center py-1"
        aria-label="Vikas Traders home"
      >
        <VTLogo size="header" />
      </Link>
      {rightSlot ? <div className="flex shrink-0 items-center">{rightSlot}</div> : null}
    </header>
  );
}
