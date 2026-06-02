import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/utils';

export type AdminStatVariant =
  | 'cyan'
  | 'navy'
  | 'mint'
  | 'amber'
  | 'coral'
  | 'violet'
  | 'teal'
  | 'slate';

type AdminStatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: AdminStatVariant;
  to?: string;
};

const variants: Record<
  AdminStatVariant,
  {
    shell: string;
    icon: string;
  }
> = {
  cyan: {
    shell: 'bg-[#00B4E6] border-[#0090BC] shadow-[0_8px_24px_rgba(0,180,230,0.35)]',
    icon: 'bg-white text-[#00B4E6]',
  },
  navy: {
    shell: 'bg-[#0F2A44] border-[#0A1F35] shadow-[0_8px_24px_rgba(15,42,68,0.4)]',
    icon: 'bg-white text-[#0F2A44]',
  },
  mint: {
    shell: 'bg-[#3AA88E] border-[#2D8A72] shadow-[0_8px_24px_rgba(58,168,142,0.35)]',
    icon: 'bg-white text-[#3AA88E]',
  },
  amber: {
    shell: 'bg-[#F59E0B] border-[#D97706] shadow-[0_8px_24px_rgba(245,158,11,0.35)]',
    icon: 'bg-white text-[#D97706]',
  },
  coral: {
    shell: 'bg-[#EF4444] border-[#DC2626] shadow-[0_8px_24px_rgba(239,68,68,0.35)]',
    icon: 'bg-white text-[#EF4444]',
  },
  violet: {
    shell: 'bg-[#8B5CF6] border-[#6D28D9] shadow-[0_8px_24px_rgba(139,92,246,0.35)]',
    icon: 'bg-white text-[#7C3AED]',
  },
  teal: {
    shell: 'bg-[#14B8A6] border-[#0D9488] shadow-[0_8px_24px_rgba(20,184,166,0.35)]',
    icon: 'bg-white text-[#14B8A6]',
  },
  slate: {
    shell: 'bg-[#64748B] border-[#475569] shadow-[0_8px_24px_rgba(100,116,139,0.35)]',
    icon: 'bg-white text-[#64748B]',
  },
};

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  variant = 'cyan',
  to,
}: AdminStatCardProps) {
  const style = variants[variant];

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/90">{title}</p>
          <p className="mt-1.5 text-3xl font-bold tracking-tight text-white">{value}</p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm',
            style.icon,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </div>
      </div>
      {to && (
        <p className="mt-3 text-xs font-semibold text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
          View details →
        </p>
      )}
    </>
  );

  const className = cn(
    'group block overflow-hidden rounded-2xl border p-4 text-white transition-all',
    style.shell,
    to && 'cursor-pointer hover:brightness-105 hover:scale-[1.02] active:scale-[0.99]',
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
