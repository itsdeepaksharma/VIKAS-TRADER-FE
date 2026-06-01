import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';

type AdminStatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent?: 'blue' | 'green' | 'amber' | 'slate';
  to?: string;
};

const accents = {
  blue: 'bg-vt-light-blue text-vt-blue',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  slate: 'bg-slate-100 text-slate-700',
};

export function AdminStatCard({ title, value, icon: Icon, accent = 'blue', to }: AdminStatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-vt-dark">{value}</p>
        </div>
        <div
          className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', accents[accent])}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {to && (
        <p className="mt-3 text-xs font-medium text-vt-blue opacity-0 transition-opacity group-hover:opacity-100">
          View details →
        </p>
      )}
    </>
  );

  const className = cn(
    'group block rounded-3xl border border-slate-100 bg-white p-5 shadow-card transition-all',
    to && 'cursor-pointer hover:border-vt-blue/30 hover:shadow-elevated active:scale-[0.99]',
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
