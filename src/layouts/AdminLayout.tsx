import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Shield,
  ShoppingBag,
  Store,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AppBrandHeader } from '../components/layout/AppBrandHeader';
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

function AdminSidebar({
  user,
  onNavigate,
  onLogout,
}: {
  user: { name?: string; email?: string } | null;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col p-4 lg:p-5">
      <p className="mb-4 hidden text-center text-sm font-bold text-vt-foreground lg:block">
        Admin Panel
      </p>

      <div className="mb-5 rounded-2xl bg-vt-gradient-card p-4 text-white">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">Super Admin</span>
        </div>
        <p className="mt-2 truncate text-xs text-white/90">{user?.name}</p>
        <p className="truncate text-xs text-white/75">{user?.email}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-vt-light-blue text-vt-blue'
                  : 'text-vt-muted hover:bg-vt-surface-hover',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-vt-surface-hover"
      >
        <LogOut className="h-5 w-5 shrink-0" />
        Logout
      </button>
    </div>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-vt-page">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-vt-border bg-vt-surface shadow-elevated transition-transform duration-300 ease-out lg:w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-vt-border px-4 py-3 lg:hidden">
          <VTLogo size="sm" />
          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-vt-surface-muted text-vt-foreground"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <AdminSidebar user={user} onNavigate={closeSidebar} onLogout={handleLogout} />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-vt-border bg-vt-surface px-3 shadow-sm sm:h-[4.25rem] sm:px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-surface-muted text-vt-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-vt-foreground sm:text-base">
            Admin Panel
          </span>
        </header>

        <div className="hidden lg:block">
          <AppBrandHeader homeTo="/admin" />
        </div>

        <main className="min-w-0 flex-1 [--app-header-h:3.5rem] sm:[--app-header-h:4.25rem] lg:[--app-header-h:4.25rem]">
          <div className="vt-container py-4 sm:py-5 lg:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
