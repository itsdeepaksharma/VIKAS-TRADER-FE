import { FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updateProfile } from '../api/users';
import { getApiErrorMessage } from '../api/client';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { Input } from '../components/ui/input';
import { useAuthStore } from '../store/authStore';

export function ProfileSettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateProfileState = useAuthStore((s) => s.updateProfile);
  const setAvatarUrl = useAuthStore((s) => s.setAvatarUrl);
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.mobile ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleAvatarChange(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const updated = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      updateProfileState(updated);
      navigate('/profile');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update profile.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-8">
      <PageHeader title="Settings" />
      <form onSubmit={handleSubmit} className="space-y-4 px-4">
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-vt-surface p-6 shadow-vt-card">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-vt-light-blue text-3xl font-bold text-vt-blue">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (user?.name?.charAt(0) ?? 'V')
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarChange(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm font-semibold text-vt-blue"
          >
            Change profile photo
          </button>
        </div>

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
        <Input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <p className="text-xs text-vt-muted">Email: {user?.email} (cannot be changed here)</p>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <GradientButton type="submit" fullWidth disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </GradientButton>
      </form>
    </div>
  );
}
