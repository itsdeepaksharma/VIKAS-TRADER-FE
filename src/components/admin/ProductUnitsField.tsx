import { useMemo } from 'react';

import { MEASUREMENT_UNIT_OPTIONS } from '../../lib/measurementUnits';
import { cn } from '../../lib/utils';

type ProductUnitsFieldProps = {
  value: string[];
  onChange: (units: string[]) => void;
  className?: string;
  compact?: boolean;
};

export function ProductUnitsField({
  value,
  onChange,
  className,
  compact = false,
}: ProductUnitsFieldProps) {
  const selectedUnit = value[0] ?? '';

  const unitOptions = useMemo(() => {
    if (!selectedUnit) return [...MEASUREMENT_UNIT_OPTIONS];
    const isKnown = MEASUREMENT_UNIT_OPTIONS.some(
      (unit) => unit.toLowerCase() === selectedUnit.toLowerCase(),
    );
    return isKnown ? [...MEASUREMENT_UNIT_OPTIONS] : [selectedUnit, ...MEASUREMENT_UNIT_OPTIONS];
  }, [selectedUnit]);

  function handleChange(next: string) {
    onChange(next ? [next] : []);
  }

  return (
    <div className={cn(compact ? 'space-y-0' : 'space-y-2', className)}>
      {!compact && (
        <div>
          <p className="text-sm font-medium text-vt-foreground">Measurement unit</p>
          <p className="text-xs text-vt-muted">
            Optional — select one unit like Pieces, Dozen, kg, ml, or L.
          </p>
        </div>
      )}

      <select
        value={selectedUnit}
        onChange={(e) => handleChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-vt-border bg-vt-surface px-4 text-sm text-vt-foreground focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20"
        aria-label="Select measurement unit"
      >
        <option value="">Select unit</option>
        {unitOptions.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  );
}
