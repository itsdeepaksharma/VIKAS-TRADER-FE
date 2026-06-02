import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-vt-light-blue text-vt-blue',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-600',
      shipped: 'bg-sky-100 text-sky-700',
      discount: 'bg-vt-gradient text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
