export const MEASUREMENT_UNIT_OPTIONS = [
  'Pieces',
  'Dozen',
  'Pair',
  'Set',
  'Pack',
  'Box',
  'Carton',
  'g',
  'kg',
  'ml',
  'L',
  'Small',
  'Medium',
  'Large',
  'Extra Large',
] as const;

export type MeasurementUnit = (typeof MEASUREMENT_UNIT_OPTIONS)[number];
