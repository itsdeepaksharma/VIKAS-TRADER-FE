import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  actionTo?: string;
  className?: string;
};

export function SectionHeader({
  title,
  actionLabel = 'View All',
  actionTo,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      <h2 className="text-lg font-bold text-vt-foreground">{title}</h2>
      {actionTo && (
        <Link to={actionTo} className="text-sm font-semibold text-vt-blue hover:underline">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
