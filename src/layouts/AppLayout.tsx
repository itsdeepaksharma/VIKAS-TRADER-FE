import { Link, Outlet } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

export function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            Vikas Trader
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Dashboard
            </Link>
            {isAuthenticated ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Signed in</span>
            ) : (
              <Link to="/login" className="hover:text-slate-900">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
