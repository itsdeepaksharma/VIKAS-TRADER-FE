import { cn } from '../../lib/utils';

type VTLogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 'h-12',
  md: 'h-16',
  lg: 'h-24',
};

export function VTLogo({ className, size = 'md' }: VTLogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Vikas Traders"
      className={cn('w-auto object-contain drop-shadow-lg', sizes[size], className)}
    />
  );
}
