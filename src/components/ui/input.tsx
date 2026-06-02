import * as React from 'react';

import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-2xl border border-vt-border bg-vt-surface px-4 text-sm text-vt-foreground shadow-sm transition-colors placeholder:text-vt-muted focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
