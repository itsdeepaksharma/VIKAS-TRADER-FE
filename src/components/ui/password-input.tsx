import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../../lib/utils';
import { Input, type InputProps } from './input';

type PasswordInputProps = Omit<InputProps, 'type'>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('vt-password-input pr-12', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl text-vt-muted transition-colors hover:text-vt-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vt-blue/20"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-5 w-5" strokeWidth={1.75} /> : <Eye className="h-5 w-5" strokeWidth={1.75} />}
      </button>
    </div>
  );
}
