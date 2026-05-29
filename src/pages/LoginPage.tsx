import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { GradientButton } from '../components/ecommerce/GradientButton';
import { VTLogo } from '../components/layout/VTLogo';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { getApiErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <VTLogo size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-vt-dark">
          Welcome Back! <span className="inline-block">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to Vikas Traders wholesale & retail</p>

        <div className="mt-4 rounded-2xl border border-vt-blue/20 bg-vt-light-blue/50 p-4 text-sm">
          <p className="font-semibold text-vt-dark">Admin demo login</p>
          <p className="mt-1 text-slate-600">
            Email: <span className="font-mono text-vt-blue">admin@vikastraders.com</span>
          </p>
          <p className="text-slate-600">
            Password: <span className="font-mono text-vt-blue">VikasAdmin@2026</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-vt-dark">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-vt-dark">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
              Remember Me
            </label>
            <Link to="/login" className="text-sm font-medium text-vt-blue hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <GradientButton type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-vt-blue hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
