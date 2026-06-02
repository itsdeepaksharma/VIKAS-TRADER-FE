import { cn } from '../../lib/utils';

type FilterPillsProps = {
  filters: readonly string[];
  active: string;
  onChange: (filter: string) => void;
};

export function FilterPills({ filters, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
            active === filter
              ? 'bg-vt-gradient text-white shadow-soft'
              : 'bg-slate-100 text-vt-muted hover:bg-vt-light-blue',
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
