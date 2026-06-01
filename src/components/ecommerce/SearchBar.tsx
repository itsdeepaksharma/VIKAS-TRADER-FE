import { Search } from 'lucide-react';

import { cn } from '../../lib/utils';

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({
  placeholder = 'Search plasticware, containers...',
  className,
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-4 pr-14 text-sm shadow-sm focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20"
      />
      <button
        type="button"
        className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-vt-gradient text-white shadow-sm"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
}
