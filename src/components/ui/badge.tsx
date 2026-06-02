import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      default: 'bg-vt-light-blue text-vt-cyan-dark dark:text-vt-cyan',
      success: 'bg-vt-light-blue text-vt-cyan-dark dark:text-vt-cyan',
      warning: 'bg-vt-light-blue text-vt-navy dark:text-vt-mint',
      danger: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
      shipped: 'bg-vt-mint-light/60 text-vt-navy dark:bg-vt-surface-muted dark:text-vt-mint',
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
