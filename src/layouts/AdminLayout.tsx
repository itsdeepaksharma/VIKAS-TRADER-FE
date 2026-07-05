import { useQuery } from '@tanstack/react-query';
import {
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { getAdminOrders } from '../api/admin';
import { AdminShellHeader } from '../components/layout/AdminShellHeader';
import { NotificationBellMenu } from '../components/ecommerce/NotificationBellMenu';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import { VTLogo } from '../components/layout/VTLogo';
import { useAdminOrderNotifications } from '../hooks/useAdminOrderNotifications';
import { mapAdminOrder } from '../lib/catalogMappers';
import { adminPageTitle } from '../lib/adminPageTitle';
import { useAuthStore, type UserProfile } from '../store/authStore';
import { cn } from '../lib/utils';

const mainNavItems: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  showPendingBadge?: boolean;
}[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, showPendingBadge: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function getInitials(name?: string) {
  if (!name?.trim()) return 'VT';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type AdminNavItemProps = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  badge?: number;
  onNavigate?: () => void;
};

function AdminNavItem({ to, label, icon: Icon, end, badge, onNavigate }: AdminNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-vt-gradient text-white shadow-soft'
            : 'text-vt-muted hover:bg-vt-light-blue/70 hover:text-vt-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
              isActive ? 'bg-white/15 text-white' : 'bg-vt-surface-muted text-vt-muted group-hover:bg-white/80',
            )}
          >
            <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {badge != null && badge > 0 && (
            <span
              className={cn(
                'ml-auto inline-flex min-w-[1.375rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white',
              )}
            >
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function AdminSidebar({
  user,
  pendingOrderCount,
  onNavigate,
  onLogout,
}: {
  user: UserProfile | null;
  pendingOrderCount: number;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="hidden border-b border-vt-border px-5 py-4 lg:block">
        <div className="flex items-center gap-3">
          <VTLogo size="home" className="h-9 w-auto max-w-[3.5rem]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-vt-foreground">Vikas Traders</p>
            <p className="text-xs text-vt-muted">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4 lg:px-5">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-vt-muted">
          Menu
        </p>
        {mainNavItems.map(({ to, label, icon, end, showPendingBadge }) => (
          <AdminNavItem
            key={to}
            to={to}
            label={label}
            icon={icon}
            end={end}
            badge={showPendingBadge ? pendingOrderCount : undefined}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="space-y-3 border-t border-vt-border px-4 py-4 lg:px-5">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl border border-vt-border bg-vt-surface px-3 py-2.5 text-sm font-medium text-vt-foreground transition-colors hover:border-vt-blue/30 hover:bg-vt-light-blue/40"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-vt-surface-muted text-vt-blue">
            <Store className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </span>
          <span className="flex-1">View Store</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-vt-muted" />
        </NavLink>

        <div className="rounded-2xl border border-vt-border bg-vt-surface-muted/50 p-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm',
                !user?.avatarUrl && 'bg-vt-gradient text-sm font-bold text-white',
              )}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-vt-foreground">
                {user?.name ?? 'Admin'}
              </p>
              <span className="mt-1.5 inline-flex rounded-full bg-vt-light-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-vt-blue">
                Super Admin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useAdminOrderNotifications();

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await getAdminOrders()).map(mapAdminOrder),
  });

  const pendingOrderCount = useMemo(
    () => orders.filter((order) => order.status === 'pending').length,
    [orders],
  );

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
        <AdminSidebar
          user={user}
          pendingOrderCount={pendingOrderCount}
          onNavigate={closeSidebar}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">
        <main className="min-w-0 flex-1">
          <div className="vt-container space-y-4 py-4 sm:py-5 lg:py-6">
            <AdminShellHeader
              title={adminPageTitle(location.pathname)}
              menuButton={
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-light-blue text-vt-foreground lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              }
              actions={
                <div className="flex shrink-0 items-center gap-1.5">
                  <NotificationBellMenu className="[&_button]:h-9 [&_button]:w-9 [&_button]:rounded-xl [&_.notification-dot]:right-1.5 [&_.notification-dot]:top-1.5 [&_.notification-dot]:h-2.5 [&_.notification-dot]:w-2.5" />
                  <ThemeToggle className="h-9 w-9 shadow-sm" />
                </div>
              }
            />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
