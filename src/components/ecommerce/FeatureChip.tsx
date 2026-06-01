import { cn } from '../../lib/utils';

type FeatureChipProps = {
  label: string;
  className?: string;
};

export function FeatureChip({ label, className }: FeatureChipProps) {
  return (
    <span
      className={cn(
        'rounded-full bg-vt-light-mint px-3 py-1 text-xs font-medium text-emerald-700',
        className,
      )}
    >
      {label}
    </span>
  );
}
