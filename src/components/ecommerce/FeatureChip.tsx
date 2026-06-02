import { cn } from '../../lib/utils';

type FeatureChipProps = {
  label: string;
  className?: string;
};

export function FeatureChip({ label, className }: FeatureChipProps) {
  return (
    <span
      className={cn(
        'rounded-full bg-vt-light-blue px-3 py-1 text-xs font-medium text-vt-cyan-dark dark:text-vt-cyan',
        className,
      )}
    >
      {label}
    </span>
  );
}
