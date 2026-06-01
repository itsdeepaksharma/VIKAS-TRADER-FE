import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type GradientButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children: ReactNode;
  fullWidth?: boolean;
  size?: 'default' | 'lg';
};

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
        'rounded-2xl bg-vt-gradient font-semibold text-white shadow-soft transition-shadow hover:shadow-elevated',
        size === 'lg' ? 'h-14 text-base' : 'h-12 text-sm',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
