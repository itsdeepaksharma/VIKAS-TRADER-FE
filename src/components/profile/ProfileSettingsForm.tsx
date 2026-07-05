import type { FormEvent, ReactNode, RefObject } from 'react';

import { GradientButton } from '../ecommerce/GradientButton';
import { Input } from '../ui/input';
import { getProfileInitials } from '../../hooks/useProfileSettingsForm';
import { sanitizePhoneInput } from '../../lib/phone';
import { cn } from '../../lib/utils';

type ProfileSettingsFormProps = {
  fileRef: RefObject<HTMLInputElement | null>;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  draftAvatarUrl?: string;
  email?: string;
  error: string;
  phoneError: string;
  setPhoneError: (value: string) => void;
  success?: string;
  loading: boolean;
  isDirty: boolean;
  onAvatarChange: (file: File | undefined) => void;
  onDiscard: () => void;
  onSubmit: (e: FormEvent) => void;
  avatarClassName?: string;
  avatarFallbackClassName?: string;
  children?: ReactNode;
};

export function ProfileSettingsForm({
  fileRef,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  address,
  setAddress,
  draftAvatarUrl,
  email,
  error,
  phoneError,
  setPhoneError,
  success,
  loading,
  isDirty,
  onAvatarChange,
  onDiscard,
  onSubmit,
  avatarClassName,
  avatarFallbackClassName = 'bg-vt-gradient text-3xl font-bold text-white',
  children,
}: ProfileSettingsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-vt-border bg-vt-surface p-6 shadow-vt-card">
        <div
          className={cn(
            'flex h-24 w-24 items-center justify-center overflow-hidden rounded-full',
            draftAvatarUrl ? 'bg-vt-surface-muted' : avatarFallbackClassName,
            avatarClassName,
          )}
        >
          {draftAvatarUrl ? (
            <img src={draftAvatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            getProfileInitials(firstName, lastName)
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onAvatarChange(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm font-semibold text-vt-blue"
        >
          Change profile photo
        </button>
      </div>

      <div className="space-y-4 rounded-3xl border border-vt-border bg-vt-surface p-6 shadow-vt-card">
        <Input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <div>
          <Input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="9876543210"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              setPhone(sanitizePhoneInput(e.target.value));
              if (phoneError) setPhoneError('');
            }}
            required
            aria-invalid={Boolean(phoneError)}
            className={cn(phoneError && 'border-red-400 focus:border-red-400 focus:ring-red-400/20')}
          />
          {phoneError && <p className="mt-1.5 text-sm text-red-500">{phoneError}</p>}
        </div>
        <Input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        {email && (
          <p className="text-xs text-vt-muted">Email: {email} (cannot be changed here)</p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <div className={cn('flex flex-col gap-3', isDirty && 'sm:flex-row')}>
          {isDirty && (
            <button
              type="button"
              onClick={onDiscard}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-vt-border bg-vt-surface-muted px-4 text-sm font-semibold text-vt-foreground transition-colors hover:bg-vt-surface-hover disabled:opacity-60"
            >
              Discard changes
            </button>
          )}
          <GradientButton type="submit" fullWidth disabled={loading || !isDirty} className={isDirty ? 'sm:flex-1' : undefined}>
            {loading ? 'Saving...' : 'Save Changes'}
          </GradientButton>
        </div>
      </div>
      {children}
    </form>
  );
}
