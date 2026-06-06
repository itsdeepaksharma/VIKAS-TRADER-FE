import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updateProfile } from '../api/users';
import { getApiErrorMessage } from '../api/client';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { useAuthStore } from '../store/authStore';

export function ProfileAddressPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateProfileState = useAuthStore((s) => s.updateProfile);
  const [address, setAddress] = useState(user?.address ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const updated = await updateProfile({ address: address.trim() });
      updateProfileState(updated);
      navigate('/profile');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save address.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-8">
      <PageHeader title="Delivery Address" />
      <form onSubmit={handleSubmit} className="space-y-4 px-4">
        <p className="text-sm text-vt-muted">
          This address is used when you place orders on Vikas Traders.
        </p>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={4}
          required
          className="w-full rounded-2xl border border-vt-border p-4 text-sm focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20"
          placeholder="House no., street, city, pin code"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <GradientButton type="submit" fullWidth disabled={loading}>
          {loading ? 'Saving...' : 'Save Address'}
        </GradientButton>
      </form>
    </div>
  );
}
