import { cn } from '../../lib/utils';

type VTLogoProps = {
  className?: string;
  size?: 'header' | 'sm' | 'md' | 'lg';
};

const sizes = {
  header: 'h-[3.25rem] w-auto min-w-[9rem] max-w-[13.5rem]',
  sm: 'h-14 w-auto max-w-[11rem]',
  md: 'h-20 w-auto max-w-[14rem]',
  lg: 'h-36 w-auto max-w-[18rem]',
};

export function VTLogo({ className, size = 'md' }: VTLogoProps) {
  return (
    <img
      src="/logo.png"
      srcSet="/logo.png 1x, /logo@2x.png 2x"
      alt="Vikas Traders"
      decoding="async"
      className={cn('block object-contain object-left', sizes[size], className)}
    />
  );
}
