import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';
import { PwaInstallCard } from '../components/pwa/PwaInstallCard';
import { VTLogo } from '../components/layout/VTLogo';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { PasswordInput } from '../components/ui/password-input';
import { getApiErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      const isAdmin = useAuthStore.getState().user?.isAdmin;
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="auth-card"
      >
        <div className="mb-6 flex justify-center sm:mb-8">
          <VTLogo size="auth" centered className="mx-auto" />
        </div>

        <h1 className="text-center text-2xl font-bold text-vt-foreground sm:text-[1.65rem]">
          Welcome Back! <span aria-hidden>👋</span>
        </h1>
        <p className="mt-2 text-center text-sm text-vt-muted">
          Sign in to Vikas Traders wholesale &amp; retail
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-vt-foreground">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-vt-foreground">Password</label>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-vt-muted">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-vt-cyan hover:underline dark:text-vt-blue"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </p>
          )}

          <GradientButton type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
            {loading ? 'Signing in…' : 'Login'}
          </GradientButton>
        </form>

        <PwaInstallCard />

        <p className="mt-6 text-center text-sm text-vt-muted">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-vt-cyan hover:underline dark:text-vt-blue"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
