import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';
import { VTLogo } from '../components/layout/VTLogo';
import { Input } from '../components/ui/input';
import { PasswordInput } from '../components/ui/password-input';
import { getApiErrorMessage } from '../api/client';
import {
  isValidIndianPhone,
  normalizeIndianPhone,
  PHONE_VALIDATION_MESSAGE,
  sanitizePhoneInput,
} from '../lib/phone';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export function SignupPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPhoneError('');

    const normalizedPhone = normalizeIndianPhone(phone);
    if (!isValidIndianPhone(normalizedPhone)) {
      setPhoneError(PHONE_VALIDATION_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      await register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: normalizedPhone,
        address: address.trim(),
        password,
      });
      navigate('/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vt-container flex flex-1 flex-col items-center justify-center py-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-6 sm:p-8"
      >
        <div className="mb-6 flex justify-center sm:mb-8">
          <VTLogo size="auth" centered className="mx-auto" />
        </div>
        <h1 className="text-center text-2xl font-bold text-vt-foreground">Create Account</h1>
        <p className="mt-1 text-center text-sm text-vt-muted">
          Join Vikas Traders for wholesale & retail shopping
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-vt-foreground">First Name</label>
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-vt-foreground">Last Name</label>
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-vt-foreground">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-vt-foreground">Phone Number</label>
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-vt-foreground">Address</label>
            <textarea
              placeholder="Street, city, state, PIN code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              minLength={5}
              rows={3}
              className="flex w-full resize-none rounded-2xl border border-vt-border bg-vt-surface px-4 py-3 text-sm text-vt-foreground shadow-sm focus:border-vt-blue focus:outline-none focus:ring-2 focus:ring-vt-blue/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-vt-foreground">Password</label>
            <PasswordInput
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <GradientButton type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-vt-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-vt-blue hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
