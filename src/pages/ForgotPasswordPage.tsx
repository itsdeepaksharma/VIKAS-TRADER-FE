import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPasswordApi, resetPasswordApi } from '../api/auth';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { Input } from '../components/ui/input';
import { getApiErrorMessage } from '../api/client';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPasswordApi(email.trim());
      setStep('reset');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not find this email.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPasswordApi(email.trim(), password);
      navigate('/login');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not reset password.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-vt-dark">Forgot Password</h1>
        <p className="mt-1 text-sm text-slate-500">
          {step === 'email'
            ? 'Enter your registered email to continue.'
            : 'Set a new password for your account.'}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleEmail} className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <GradientButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Checking...' : 'Continue'}
            </GradientButton>
          </form>
        ) : (
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <Input
              type="password"
              placeholder="New password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <GradientButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Saving...' : 'Reset Password'}
            </GradientButton>
          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-vt-blue hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
