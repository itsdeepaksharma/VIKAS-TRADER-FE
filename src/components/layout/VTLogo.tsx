import { cn } from '../../lib/utils';

type VTLogoProps = {
  className?: string;
  size?: 'home' | 'header' | 'auth' | 'sm' | 'md' | 'lg';
  centered?: boolean;
};

const sizes = {
  home: 'h-11 w-auto max-w-[3.75rem] sm:h-12 sm:max-w-[4.25rem]',
  header: 'h-[3.25rem] w-auto min-w-[9rem] max-w-[13.5rem]',
  auth: 'h-28 w-auto max-w-[16rem] sm:h-32',
  sm: 'h-14 w-auto max-w-[11rem]',
  md: 'h-20 w-auto max-w-[14rem]',
  lg: 'h-36 w-auto max-w-[18rem]',
};

export function VTLogo({ className, size = 'md', centered = false }: VTLogoProps) {
  return (
    <img
      src="/logo.png"
      srcSet="/logo.png 1x, /logo@2x.png 2x"
      alt="Vikas Traders"
      decoding="async"
      className={cn(
        'block object-contain',
        centered ? 'object-center' : 'object-left',
        sizes[size],
        className,
      )}
    />
  );
}
