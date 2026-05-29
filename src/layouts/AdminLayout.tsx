import { FolderTree, LayoutDashboard, LogOut, Package, Shield, ShoppingBag, Store, Users } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { VTLogo } from '../components/layout/VTLogo';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/', label: 'View Store', icon: Store },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white shadow-card">
        <div className="flex h-full flex-col p-5">
          <div className="mb-6 flex items-center gap-3">
            <VTLogo size="sm" />
            <div>
              <p className="text-sm font-bold text-vt-dark">Admin Panel</p>
              <p className="text-xs text-slate-500">Vikas Traders</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-vt-gradient p-4 text-white">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-semibold">Super Admin</span>
            </div>
            <p className="mt-2 text-xs text-white/90">{user?.name}</p>
            <p className="text-xs text-white/75">{user?.email}</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-vt-light-blue text-vt-blue'
                      : 'text-slate-600 hover:bg-slate-50',
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
