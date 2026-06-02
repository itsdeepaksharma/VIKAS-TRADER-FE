import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type GradientButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children: ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'default' | 'lg';
};

const sizeClasses = {
  sm: 'min-h-9 rounded-xl px-5 py-2 text-sm',
  default: 'min-h-10 rounded-2xl px-6 py-2.5 text-sm',
  lg: 'min-h-12 rounded-2xl px-8 py-3 text-base',
} as const;

export function GradientButton({
  children,
  className,
  fullWidth,
  size = 'default',
  type = 'button',
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center bg-vt-gradient font-semibold text-white shadow-soft transition-shadow hover:shadow-elevated',
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
