import { cn } from '../../lib/utils';

type VTLogoProps = {
  className?: string;
  size?: 'home' | 'header' | 'auth' | 'sm' | 'md' | 'lg';
  centered?: boolean;
};

const sizes = {
  home: 'h-11 w-auto max-w-[4.25rem] sm:h-12 sm:max-w-[4.75rem]',
  header: 'h-12 w-auto max-w-[8rem] sm:h-14 sm:max-w-[9rem]',
  auth: 'h-36 w-auto max-w-[15rem] sm:h-40 sm:max-w-[17rem]',
  sm: 'h-14 w-auto max-w-[6.5rem]',
  md: 'h-20 w-auto max-w-[10rem]',
  lg: 'h-40 w-auto max-w-[18rem]',
};

export function VTLogo({ className, size = 'md', centered = false }: VTLogoProps) {
  return (
    <img
      src="/logo@2x.png"
      srcSet="/logo.png 1x, /logo@2x.png 2x"
      sizes="(max-width: 640px) 4.75rem, (max-width: 1024px) 9rem, 18rem"
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
